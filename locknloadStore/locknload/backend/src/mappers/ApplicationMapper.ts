import { Mapper } from '../core/infra/Mapper';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Application } from '../domain/license/application';
import { IApplicationDTO } from '../dto/IApplicationDTO';
import { IApplicationStatusDTO } from '../dto/IApplicationStatusDTO';
import { UserEmail } from '../domain/user/userEmail';
import { UserBirthDate } from '../domain/user/userBirthDate';
import { UserMorada } from '../domain/user/userMorada';

export class ApplicationMap extends Mapper<Application> {
  public static toDTO(application: Application): IApplicationDTO {
    const applicationDTO: IApplicationDTO = {
      name: application.name,
      email: application.email.value,
      birthDate: application.birthDate.value,
      address: application.address.value,
      medicalCertificate: application.medicalCertificate,
      documentId: application.documentId,
      date: application.date,
      status: application.status,
    };
    return applicationDTO;
  }

  public static statusToDTO(application: Application): IApplicationStatusDTO {
    const status : IApplicationStatusDTO= {
      status: application.status,
      date: application.date
    }
    return status;
  }

  public static async toDomain(raw: any): Promise<Application | null> {
    const applicationOrError = Application.create(
      {
        email: UserEmail.create(raw.email).getValue(),
        medicalCertificate: raw.medicalCertificate,
        name: raw.name,
        birthDate: UserBirthDate.create(raw.birthDate).getValue(),
        address: UserMorada.create(raw.address).getValue(),
        documentId: raw.documentId,
        status: raw.status,
        date: raw.date,
      },
      new UniqueEntityID(raw.domainId),
    );

    if (applicationOrError.isFailure) {
      console.log(applicationOrError.error);
      return null;
    }

    return applicationOrError.getValue();
  }

  public static toPersistence(application: Application): any {
    const persistenceData = {
      domainId: application.id.toString(),
      name: application.name,
      email: application.email.value,
      birthDate: application.birthDate.value,
      address: application.address.value,
      medicalCertificate: application.medicalCertificate,
      documentId: application.documentId,
      status: application.status,
      date: application.date,
    };
    return persistenceData;
  }
}
