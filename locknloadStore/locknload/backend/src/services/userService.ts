import { Service } from 'typedi';

import jwt from 'jsonwebtoken';
import config from '../../config';

//import MailerService from './mailer.ts.bak';

import IUserService from '../services/IServices/IUserService';
import { UserMap } from '../mappers/UserMap';
import { IUserDTO } from '../dto/IUserDTO';

import { User } from '../domain/user/user';
import { UserEmail } from '../domain/user/userEmail';

import { Role } from '../domain/user/role';

import { Result } from '../core/logic/Result';
import { UserPhoneNumber } from '../domain/user/userPhoneNumber';
import { UserPassword } from '../domain/user/userPassword';
import { UserMorada } from '../domain/user/userMorada';
import UserRepo from '../repos/userRepo';
import { Container } from 'typedi';
import { UserBirthDate } from '../domain/user/userBirthDate';
import sendEmail from '../utils/email/sendEmail';
import { StatusToken } from '../domain/token/statusToken';
import * as bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import IStatusTokenRepo from './IRepos/IStatusTokenRepo';
import speakeasy from 'speakeasy';
import qr from 'qr-image';
import jwtService from 'jsonwebtoken';

// Ensure your jwtSecret is sufficiently random and long
const jwtSecret = crypto.randomBytes(64).toString('hex');
config.jwtSecret = jwtSecret;

@Service()
export default class UserService implements IUserService {
  private userRepo: UserRepo;
  private logger: any;
  private statusTokenRepo: IStatusTokenRepo;

  constructor() {
    this.userRepo = Container.get('UserRepo');
    this.logger = Container.get('logger');
    this.statusTokenRepo = Container.get('StatusTokenRepo');
  }

  public async signUp(userDTO: IUserDTO): Promise<Result<IUserDTO>> {
    try {
      console.log(userDTO.email);
      const userDocument = await this.userRepo.findByEmail2(userDTO.email);
      console.log('miau');
      const found = !!userDocument;
      if (found && userDocument.phoneNumber != '999999999') {
        return Result.fail<IUserDTO>(
          'User already exists with email=' + userDTO.email
        );
      }

      const email = UserEmail.create(userDTO.email).getValue();
      const role = Role.create(userDTO.role).getValue();
      const phoneNumber = UserPhoneNumber.create(
        userDTO.phoneNumber
      ).getValue();
      const birthDate = UserBirthDate.create(userDTO.birthDate).getValue();
      const password = await UserPassword.create({
        value: userDTO.password,
        hashed: false,
      });
      const morada = UserMorada.create(userDTO.morada).getValue();
      const fingerPrints = [];
      const twofaSecret = speakeasy.generateSecret({
        name: config.authenticatorSecret,
      });

      const userOrError = User.create({
        name: userDTO.name,
        email: email,
        role: role,
        password: password.getValue(),
        phoneNumber: phoneNumber,
        birthDate: birthDate,
        morada: morada,
        fingerPrints: fingerPrints,
        twofaSecret: twofaSecret.base32,
      });

      if (userOrError.isFailure) {
        throw Result.fail<IUserDTO>(userOrError.errorValue());
      }

      const userResult = userOrError.getValue();

      await this.userRepo.save(userResult);
      const userDTOResult = UserMap.toDTO(userResult) as IUserDTO;
      return Result.ok<IUserDTO>(userDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(
    email: string,
    password: string,
    fingerprint: string,
    twoFactorCode: string | string[]
  ): Promise<Result<{ userDTO: IUserDTO; token: string }> | Result<any>> {
    const user = await this.userRepo.findByEmail(email);

    if (user.phoneNumber.value == '999999999') {
      return Result.fail<{ userDTO: IUserDTO; token: string }>(
        'This account was deleted'
      );
    }

    if (await user.password.comparePassword(password)) {
      // Generate a new token on successful authentication
      const token = this.generateToken(user) as string;
      const userDTO = UserMap.toDTO(user) as IUserDTO;

      if (user.fingerPrints.length == 0) {
        user.fingerPrints.push(fingerprint);
        await this.userRepo.update(user);
      } else {
        let found = false;
        user.fingerPrints.forEach(function (fp) {
          if (fp == fingerprint) {
            found = true;
          }
        });
        if (!found) {
          const statusToken = crypto.randomBytes(32).toString('hex');
          const hashedToken = bcrypt.hashSync(
            statusToken,
            bcrypt.genSaltSync(8)
          );

          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);

          const statusTokenOrError = StatusToken.create({
            email: user.email.value,
            token: hashedToken,
            expiresAt: expiresAt,
          });

          if (statusTokenOrError.isFailure) {
            return Result.fail<{ userDTO: IUserDTO; token: string }>(
              statusTokenOrError.errorValue()
            );
          }

          await this.statusTokenRepo.createStatusToken(
            statusTokenOrError.getValue()
          );

          const statusLink =
            config.frontEnd.url +
            '/itsMe?email=' +
            user.email.value +
            '&token=' +
            statusToken +
            '&fingerprint=' +
            fingerprint;

          await sendEmail(
            user.email.value,
            'Unauthorized login attempt',
            { statusLink: statusLink },
            'unauthorizedLoginAttempt'
          );

          return Result.fail<{ userDTO: IUserDTO; token: string }>({
            error: 'You are not allowed to login',
          });
        }
      }

      if (user.twofaSecret == '' || user.twofaSecret == null) {
        return Result.ok<{ userDTO: IUserDTO; token: string }>({
          userDTO: userDTO,
          token: token,
        });
      }

      const secret = user.twofaSecret;

      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: twoFactorCode as string,
        window: 1,
      });

      if (!verified) {
        return Result.fail<{ userDTO: IUserDTO; token: string }>({
          error: '2FA not valid',
        });
      }

      // Generate a new token after 2FA is verified
      const newToken = this.generateToken(user) as string;

      return Result.ok<{ userDTO: IUserDTO; token: string }>({
        userDTO: userDTO,
        token: newToken,
      });
    } else {
      return Result.fail<{ userDTO: IUserDTO; token: string }>({
        error: 'Password not valid',
      });
    }
  }

  private generateToken(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setMinutes(today.getMinutes() + 20);

    const email = user.email.value;
    const role = user.role.name;

    return jwt.sign(
      {
        email: email,
        role: role,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  public async updateUser(userDTO: IUserDTO): Promise<Result<IUserDTO>> {
    try {
      const userDocument = await this.userRepo.findByEmail(userDTO.email);

      if (userDocument === null) {
        return Result.fail<IUserDTO>('User not found');
      } else {
        const email = UserEmail.create(userDTO.email).getValue();
        const phoneNumber = UserPhoneNumber.create(
          userDTO.phoneNumber
        ).getValue();
        const birthDate = UserBirthDate.create(userDTO.birthDate).getValue();
        const morada = UserMorada.create(userDTO.morada).getValue();
        const fingerPrints = userDocument.fingerPrints;
        const twofaSecret = userDocument.twofaSecret;

        const userOrError = User.create({
          name: userDTO.name,
          email: email,
          role: userDocument.role,
          password: userDocument.password,
          phoneNumber: phoneNumber,
          birthDate: birthDate,
          morada: morada,
          fingerPrints: fingerPrints,
          twofaSecret: twofaSecret,
        });

        if (userOrError.isFailure) {
          throw Result.fail<IUserDTO>(userOrError.errorValue());
        }

        const userResult = userOrError.getValue();

        await this.userRepo.update(userResult);
        const userDTOResult = UserMap.toDTO(userResult) as IUserDTO;
        return Result.ok<IUserDTO>(userDTOResult);
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async deleteUser(token:string | string[]): Promise<boolean> {
    try {

      let email;
      jwt.verify(token as string, config.jwtSecret, (err, userInfo) => {
        if (!err && userInfo) {
          email = (userInfo as any).email;
        }
      });

      const userDocument = await this.userRepo.findByEmail(email);

      if (userDocument === null) {
        return false;
      } else {
        const persistenceData = {
          domainId: userDocument.id.toString(),
          email: userDocument.email.value,
          name: 'null',
          password: 'null',
          phoneNumber: '999999999',
          birthDate: '12-10-2002',
          role: 'null',
          morada: 'null',
          fingerPrints: [],
          twofaSecret: 'null',
        };

        console.log(persistenceData);

        await this.userRepo.delete(persistenceData);
        return true;
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getUsers(): Promise<Result<IUserDTO[]>> {
    const users = await this.userRepo.findUsers();

    if (users === null) {
      return Result.fail<IUserDTO[]>('user não encontrado');
    } else {
      const usersResult: IUserDTO[] = [];
      users.forEach(function (user) {
        usersResult.push(UserMap.toDTO(user) as IUserDTO);
      });
      return Result.ok<IUserDTO[]>(usersResult);
    }
  }

  public async getUserByEmail(email: string): Promise<Result<IUserDTO>> {
    const user = await this.userRepo.findByEmail(email);

    if (user === null) {
      return Result.fail<IUserDTO>('user não encontrado');
    } else {
      const userResult = UserMap.toDTO(user);
      return Result.ok<IUserDTO>(userResult);
    }
  }

  public async getCurrentUser(
    token: string | string[]
  ): Promise<Result<IUserDTO>> {
    let email;
    jwt.verify(token as string, config.jwtSecret, (err, userInfo) => {
      if (!err && userInfo) {
        email = (userInfo as any).email;
      }
    });

    const user = await this.userRepo.findByEmail(email);

    if (user === null) {
      return Result.fail<IUserDTO>('user não encontrado');
    } else {
      const userResult = UserMap.toDTO(user);
      return Result.ok<IUserDTO>(userResult);
    }
  }

  public async get2fa(token: string | string[]): Promise<Result<string>> {
    let email;
    jwtService.verify(
      token as string,
      config.jwtSecret,
      (err, userInfo: { email: string }) => {
        if (!err) {
          email = userInfo.email;
        }
      }
    );

    const user = await this.userRepo.findByEmail(email);

    if (user === null) {
      return Result.fail<string>('User not found');
    } else {
      const secret = speakeasy.generateSecret({
        name: config.authenticatorSecret,
      });

      const otpauth_url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: email,
        issuer: 'DESOFS',
        encoding: 'base32',
      });

      // update the user with the new secret
      user.twofaSecret = secret.base32;
      await this.userRepo.update(user);

      const qrCode = qr.imageSync(otpauth_url, { type: 'svg' });

      // send an email to the user telling that a new 2fa was generated
      await sendEmail(
        user.email.value,
        'New 2FA code generated',
        {},
        '2faCode'
      );

      return Result.ok<string>(qrCode.toString('base64'));
    }
  }

  public async has2fa(email: string | string[]): Promise<Result<boolean>> {
    const user = await this.userRepo.findByEmail(email as string);

    if (user === null) {
      return Result.fail<boolean>('User not found');
    } else {
      if (user.twofaSecret == '' || user.twofaSecret == null) {
        return Result.ok<boolean>(false);
      } else {
        return Result.ok<boolean>(true);
      }
    }
  }
}
