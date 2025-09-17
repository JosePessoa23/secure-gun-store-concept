import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { License } from "../domain/license/license";
import { UserBirthDate } from "../domain/user/userBirthDate";
import { UserEmail } from "../domain/user/userEmail";
import { UserMorada } from "../domain/user/userMorada";
import { ILicenseDTO } from "../dto/ILicenseDTO";

export class LicenseMap extends Mapper<License> {
    public static toDTO(license: License): ILicenseDTO {
      const licenseDTO: ILicenseDTO = {
        licenseNumber: license.licenseNumber,
        name: license.name,
        email: license.email.value,
        birthDate: license.birthDate.value,
        address: license.address.value,
        expiryDate: license.expiryDate
      };
      return licenseDTO;
    }
  
    public static async toDomain(raw: any): Promise<License | null> {
      const licenseOrError = License.create(
        {
            licenseNumber: raw.licenseNumber,
            name: raw.name,
            email: UserEmail.create(raw.email).getValue(),
            birthDate: UserBirthDate.create(raw.birthDate).getValue(),
            address: UserMorada.create(raw.address).getValue(),
            expiryDate: raw.expiryDate
        },
        new UniqueEntityID(raw.domainId),
      );
  
      if (licenseOrError.isFailure) {
        return null;
      }
  
      return licenseOrError.getValue();
    }
  
    public static toPersistence(license: License): any {
      const persistenceData = {
        domainId: license.id.toString(),
        licenseNumber: license.licenseNumber,
        name: license.name,
        email: license.email.value,
        birthDate: license.birthDate.value,
        address: license.address.value,
        expiryDate: license.expiryDate
      };
      return persistenceData;
    }
  }