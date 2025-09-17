import { Inject, Service } from 'typedi';
import config from '../../config';

import { Result } from '../core/logic/Result';
import ILicenseService from './IServices/ILicenseService';
import { IApplicationDTO } from '../dto/IApplicationDTO';
import IApplicationRepo from './IRepos/IApplicationRepo';
import { Application } from '../domain/license/application';
import { ApplicationMap } from '../mappers/ApplicationMapper';
import { UserEmail } from '../domain/user/userEmail';
import { UserBirthDate } from '../domain/user/userBirthDate';
import { UserMorada } from '../domain/user/userMorada';
import { ApplicationStatus } from '../domain/license/applicationStatus';
import { Container } from 'typedi';
import { IApplicationStatusDTO } from '../dto/IApplicationStatusDTO';
import { License } from '../domain/license/license';
import ILicenseRepo from './IRepos/ILicenseRepo';
import * as bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import { StatusToken } from '../domain/token/statusToken';
import IStatusTokenRepo from './IRepos/IStatusTokenRepo';
import sendEmail from '../utils/email/sendEmail';
import { User } from '../domain/user/user';
import { UserPassword } from '../domain/user/userPassword';
import { Role } from '../domain/user/role';
import { UserPhoneNumber } from '../domain/user/userPhoneNumber';
import UserRepo from '../repos/userRepo';

@Service()
export default class LicenseService implements ILicenseService {
  private applicationRepo: IApplicationRepo;
  private licenseRepo: ILicenseRepo;
  private userRepo: UserRepo;
  private statusTokenRepo: IStatusTokenRepo;
  private logger: any;

  public constructor() {
    this.applicationRepo = Container.get('ApplicationRepo');
    this.statusTokenRepo = Container.get('StatusTokenRepo');
    this.userRepo = Container.get('UserRepo');
    this.licenseRepo = Container.get('LicenseRepo');
    this.logger = Container.get('logger');
  }

  public async submitApplication(
    applicationDTO: IApplicationDTO
  ): Promise<Result<IApplicationDTO>> {
    try {
      const email = UserEmail.create(applicationDTO.email).getValue();
      const birthDate = UserBirthDate.create(
        applicationDTO.birthDate
      ).getValue();
      const address = UserMorada.create(applicationDTO.address).getValue();

      const applicationOrError = Application.create({
        email: email,
        medicalCertificate: applicationDTO.medicalCertificate,
        name: applicationDTO.name,
        birthDate: birthDate,
        address: address,
        documentId: applicationDTO.documentId,
        status: ApplicationStatus.Pending,
        date: new Date(),
      });

      if (applicationOrError.isFailure) {
        return Result.fail<IApplicationDTO>(applicationOrError.errorValue());
      }

      const application = applicationOrError.getValue();
      await this.applicationRepo.save(application);

      const applicationDTOResult = ApplicationMap.toDTO(
        application
      ) as IApplicationDTO;

      // Create status token
      const statusToken = crypto.randomBytes(32).toString('hex');
      console.log('statusToken: ', statusToken);
      const hashedToken = bcrypt.hashSync(statusToken, bcrypt.genSaltSync(8));

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const statusTokenOrError = StatusToken.create({
        email: application.email.value,
        token: hashedToken,
        expiresAt: expiresAt,
      });

      if (statusTokenOrError.isFailure) {
        return Result.fail<IApplicationDTO>(statusTokenOrError.errorValue());
      }

      await this.statusTokenRepo.createStatusToken(
        statusTokenOrError.getValue()
      );

      const statusLink =
        config.frontEnd.url +
        '/status/email/' +
        application.email.value +
        '/' +
        statusToken;

      await sendEmail(
        application.email.value,
        'License Application',
        { name: application.name, statusLink: statusLink },
        'checkStatus'
      );

      return Result.ok<IApplicationDTO>(applicationDTOResult);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IApplicationDTO>(e.toString());
    }
  }

  public async getApplicationStatusByEmail(
    email: string,
    token: string
  ): Promise<Result<IApplicationStatusDTO>> {
    try {
      const application = await this.applicationRepo.findByEmail(email);
      if (application == null) {
        return Result.fail<IApplicationStatusDTO>(
          'Não possui um pedido de licença.'
        );
      }
      const statusTokenDocument =
        await this.statusTokenRepo.getMostRecentNotExpiredTokenByUserId(email);
      if (!statusTokenDocument) {
        return Result.fail<IApplicationStatusDTO>('Invalid or expired token');
      }

      // Check if token is valid
      const isValid = bcrypt.compareSync(token, statusTokenDocument.token);
      if (!isValid) {
        return Result.fail<IApplicationStatusDTO>('Invalid token');
      }
      const statusDTO = ApplicationMap.statusToDTO(application);
      return Result.ok<IApplicationStatusDTO>(statusDTO);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IApplicationStatusDTO>(e.toString());
    }
  }

  public async getApplicationByEmail(
    email: string
  ): Promise<Result<IApplicationDTO>> {
    try {
      const application = await this.applicationRepo.findByEmail(email);
      const applicationDTOResult = ApplicationMap.toDTO(
        application
      ) as IApplicationDTO;
      return Result.ok<IApplicationDTO>(applicationDTOResult);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IApplicationDTO>(e.toString());
    }
  }

  public async getApplicationsOrderedByDate(): Promise<
    Result<IApplicationDTO[]>
  > {
    const applications = await this.applicationRepo.getAllOrderedByDate();

    if (applications === null) {
      return Result.fail<IApplicationDTO[]>('application não encontrado');
    } else {
      const applicationsResult: IApplicationDTO[] = [];
      applications.forEach(function (application) {
        applicationsResult.push(
          ApplicationMap.toDTO(application) as IApplicationDTO
        );
      });
      return Result.ok<IApplicationDTO[]>(applicationsResult);
    }
  }

  public async approveApplication(
    email: string,
    approve: string
  ): Promise<Result<IApplicationDTO>> {
    console.log(email);
    if (approve == 'Denied') {
      const application = await this.applicationRepo.findByEmail(email);
      application.status = ApplicationStatus.Denied;
      this.applicationRepo.save(application);
      const applicationDTOResult = ApplicationMap.toDTO(
        application
      ) as IApplicationDTO;
      await sendEmail(
        application.email.value,
        'License Feedback',
        { name: application.name },
        'rejectedLicenseEmail'
      );
      return Result.fail<IApplicationDTO>(applicationDTOResult);
    } else if (approve == 'Approve') {
      const application = await this.applicationRepo.findByEmail(email);
      application.status = ApplicationStatus.Approved;
      this.applicationRepo.save(application);
      const expiryDate = application.date;
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const licenseOrError = License.create({
        licenseNumber: this.generateNumber(),
        name: application.name,
        email: application.email,
        birthDate: application.birthDate,
        address: application.address,
        expiryDate: expiryDate,
      });
      if (licenseOrError.isFailure) {
        return Result.fail<IApplicationDTO>(licenseOrError.errorValue());
      }
      const pass = this.generatePassword();
      const password = await UserPassword.create({ value: pass, hashed: false });
      const role = Role.create('Client').getValue();
      const phoneNumber = UserPhoneNumber.create('914573456').getValue();
      const userOrError = User.create({
        name: application.name,
        email: application.email,
        role: role,
        password: password.getValue(),
        phoneNumber: phoneNumber,
        birthDate: application.birthDate,
        morada: application.address,
        fingerPrints: [],
        twofaSecret: null,
      });

      if (userOrError.isFailure) {
        throw Result.fail<IApplicationDTO>(userOrError.errorValue());
      }

      const userResult = userOrError.getValue();

      await this.userRepo.save(userResult);

      const license = licenseOrError.getValue();
      await this.licenseRepo.save(license);
      await sendEmail(
        application.email.value,
        'License Feedback',
        { name: application.name, password: pass },
        'approvedLicenseEmail'
      );

      const applicationDTOResult = ApplicationMap.toDTO(
        application
      ) as IApplicationDTO;
      return Result.ok<IApplicationDTO>(applicationDTOResult);
    }
  }

  private generateNumber(): number {
    const timestamp = Math.floor(Date.now() / 1000);
    const randomPart = Math.floor(100 + Math.random() * 900);
    return Number(`${timestamp}${randomPart}`);
  }

  private generatePassword(): string {
    const length = Math.floor(Math.random() * 10) + 12;
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  }
}
