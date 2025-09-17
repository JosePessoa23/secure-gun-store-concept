import { Inject, Service } from 'typedi';

import config from '../../config';

import { Result } from '../core/logic/Result';
import IResetPasswordService from './IServices/IResetPasswordService';
import { IResetPasswordDTO } from '../dto/IResetPasswordDTO';
import { IResetPasswordEmailDTO } from '../dto/IResetPasswordEmailDTO';
import IUserRepo from './IRepos/IUserRepo';
import IResetPasswordRepo from './IRepos/IResetPasswordRepo';
import { ResetToken } from '../domain/token/resetTokens';
import * as bcrypt from 'bcrypt-nodejs';
import sendEmail from '../utils/email/sendEmail';
import { Password } from '../domain/password/password';
import { User } from '../domain/user/user';
import { UserPassword } from '../domain/user/userPassword';
import crypto from 'crypto';
import { Container } from 'typedi';
import { IChangePasswordDTO } from '../dto/IChangePasswordDTO';
import IStatusTokenRepo from './IRepos/IStatusTokenRepo';

@Service()
export default class ResetPasswordService implements IResetPasswordService {
  private userRepo: IUserRepo;
  private statusRepo: IStatusTokenRepo;
  private resetPasswordRepo: IResetPasswordRepo;
  private logger: any;

  public constructor() {
    this.userRepo = Container.get('UserRepo');
    this.resetPasswordRepo = Container.get('ResetPasswordRepo');
    this.statusRepo = Container.get('StatusTokenRepo');
    this.logger = Container.get('logger');
  }


  public async changePassword(
    resetPasswordDTO: IChangePasswordDTO
  ): Promise<Result<IChangePasswordDTO>> {
    const userDocument = await this.userRepo.findByEmail(
      resetPasswordDTO.email
    );

    if (!userDocument) {
      return Result.fail<IChangePasswordDTO>(
        "User dont exists with email '" + resetPasswordDTO.email + "'"
      );
    }

    console.log('userDocument.password: ', userDocument.password.value)
    console.log('resetPasswordDTO.oldPassword: ', resetPasswordDTO.oldPassword)

    // verify if the oldPassword is correct
    try {
      const isValid = await userDocument.password.comparePassword(
        resetPasswordDTO.oldPassword
      );
      console.log('isValid: ', isValid)

      if (!isValid) {
        return Result.fail<IChangePasswordDTO>('Invalid old password');
      }
    } catch (e) {
      return Result.fail<IChangePasswordDTO>('Invalid old password');
    }

    const newPasswordOrError = await UserPassword.create({
      value: resetPasswordDTO.newPassword,
      hashed: false,
    });
    let password!: UserPassword;
    if (newPasswordOrError.isFailure) {
      return Result.fail<IChangePasswordDTO>(newPasswordOrError.errorValue());
    } else {
      password = newPasswordOrError.getValue();
    }

    // update user password

    // Pass the current user password to passwords table with deleted_at = now()
    const deletedAt = new Date();
    const passwordOrError = Password.create({
      userId: userDocument.id.toString(),
      password: userDocument.password,
      deletedAt: deletedAt,
    });
    if (passwordOrError.isFailure) {
      return Result.fail<IChangePasswordDTO>(passwordOrError.errorValue());
    }
    await this.resetPasswordRepo.createPassword(passwordOrError.getValue());

    // Update user password
    const userOrError = User.create(
      {
        name: userDocument.name,
        email: userDocument.email,
        role: userDocument.role,
        password: password,
        morada: userDocument.morada,
        phoneNumber: userDocument.phoneNumber,
        birthDate: userDocument.birthDate,
        fingerPrints: userDocument.fingerPrints,
        twofaSecret: userDocument.twofaSecret,
      },
      userDocument.id
    );
    if (userOrError.isFailure) {
      throw Result.fail<IChangePasswordDTO>(userOrError.errorValue());
    }
    await this.userRepo.save(userOrError.getValue());
    return Result.ok<IChangePasswordDTO>(resetPasswordDTO);
  }

  public async resetPasswordEmail(
    resetPasswordEmailDTO: IResetPasswordEmailDTO
  ): Promise<Result<IResetPasswordEmailDTO>> {
    try {
      // Get user by email
      const userDocument = await this.userRepo.findByEmail(
        resetPasswordEmailDTO.email
      );
      if (!userDocument) {
        return Result.fail<IResetPasswordEmailDTO>(
          "User dont exists with email '" + resetPasswordEmailDTO.email + "'"
        );
      }

      // Create reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      console.log('resetToken: ', resetToken);
      const hashedToken = bcrypt.hashSync(resetToken, bcrypt.genSaltSync(8));

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const resetTokenOrError = ResetToken.create({
        userId: userDocument.id.toString(),
        token: hashedToken,
        expiresAt: expiresAt,
      });

      if (resetTokenOrError.isFailure) {
        return Result.fail<IResetPasswordEmailDTO>(
          resetTokenOrError.errorValue()
        );
      }

      await this.resetPasswordRepo.createResetToken(
        resetTokenOrError.getValue()
      );

      const resetPasswordLink =
        config.frontEnd.url + '/reset-password/' + resetToken;

      await sendEmail(
        resetPasswordEmailDTO.email,
        'Password Reset Request',
        { name: userDocument.name, resetPasswordLink: resetPasswordLink },
        'resetPasswordEmail'
      );

      return Result.ok<IResetPasswordEmailDTO>(resetPasswordEmailDTO);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  public async addFingerPrint(
    { email, token, fingerprint }: { email: string; token: string; fingerprint: string }
  ): Promise<Result<{ email: string; token: string; fingerprint: string }>> {
    const userDocument = await this.userRepo.findByEmail(email);
    if (!userDocument) {
      return Result.fail<{ email: string; token: string; fingerprint: string }>(
        "User dont exists with email '" + email + "'"
      );
    }

    const statusTokenDocument = await this.statusRepo.getMostRecentNotExpiredTokenByUserId(
      email
    );
    if (!statusTokenDocument) {
      return Result.fail<{ email: string; token: string; fingerprint: string }>('Invalid or expired token');
    }

    const isValid = bcrypt.compareSync(
      token,
      statusTokenDocument.token
    );
    if (!isValid) {
      return Result.fail<{ email: string; token: string; fingerprint: string }>('Invalid token');
    }

    // Add fingerprint to user
    userDocument.fingerPrints.push(fingerprint);
    const userOrError = User.create(
      {
        name: userDocument.name,
        email: userDocument.email,
        role: userDocument.role,
        password: userDocument.password,
        phoneNumber: userDocument.phoneNumber,
        birthDate: userDocument.birthDate,
        morada: userDocument.morada,
        fingerPrints: userDocument.fingerPrints,
        twofaSecret: userDocument.twofaSecret,
      },
      userDocument.id
    );
    if (userOrError.isFailure) {
      throw Result.fail<{ email: string; token: string; fingerprint: string }>(userOrError.errorValue());
    }
    await this.userRepo.save(userOrError.getValue());
    return Result.ok<{ email: string; token: string; fingerprint: string }>({ email, token, fingerprint });
  }

  public async resetPassword(
    resetPasswordDTO: IResetPasswordDTO
  ): Promise<Result<IResetPasswordDTO>> {
    console.log('resetPasswordDTO: ', resetPasswordDTO);
    // Get user by email
    const userDocument = await this.userRepo.findByEmail(
      resetPasswordDTO.email
    );
    if (!userDocument) {
      return Result.fail<IResetPasswordDTO>(
        "User dont exists with email '" + resetPasswordDTO.email + "'"
      );
    }

    // Get reset token
    const resetTokenDocument =
      await this.resetPasswordRepo.getMostRecentNotExpiredTokenByUserId(
        userDocument.id.toString()
      );
    if (!resetTokenDocument) {
      return Result.fail<IResetPasswordDTO>('Invalid or expired token');
    }

    // Check if token is valid
    const isValid = bcrypt.compareSync(
      resetPasswordDTO.token,
      resetTokenDocument.token
    );
    if (!isValid) {
      return Result.fail<IResetPasswordDTO>('Invalid token');
    }

    // Pass the current user password to passwords table with deleted_at = now()
    const deletedAt = new Date();
    const passwordOrError = Password.create({
      userId: userDocument.id.toString(),
      password: userDocument.password,
      deletedAt: deletedAt,
    });
    if (passwordOrError.isFailure) {
      return Result.fail<IResetPasswordDTO>(passwordOrError.errorValue());
    }
    await this.resetPasswordRepo.createPassword(passwordOrError.getValue());

    // Update user password
    const password = await UserPassword.create({
      value: resetPasswordDTO.new_password,
      hashed: false,
    });
    const userOrError = User.create(
      {
        name: userDocument.name,
        email: userDocument.email,
        role: userDocument.role,
        password: password.getValue(),
        phoneNumber: userDocument.phoneNumber,
        birthDate: userDocument.birthDate,
        morada: userDocument.morada,
        fingerPrints: userDocument.fingerPrints,
        twofaSecret: userDocument.twofaSecret,
      },
      userDocument.id
    );
    if (userOrError.isFailure) {
      throw Result.fail<IResetPasswordDTO>(userOrError.errorValue());
    }
    await this.userRepo.save(userOrError.getValue());
    return Result.ok<IResetPasswordDTO>(resetPasswordDTO);
  }
}
