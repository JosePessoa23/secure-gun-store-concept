
import Container, { Service } from 'typedi';
import { Document, Model } from 'mongoose';
import ILicenseRepo from '../services/IRepos/ILicenseRepo';
import { ILicensePersistence } from '../dataschema/ILicensePersistence';
import { LicenseId } from '../domain/license/licenseId';
import { License } from '../domain/license/license';
import { LicenseMap } from '../mappers/LicenseMap';

@Service()
export default class LicenseRepo implements ILicenseRepo {
  private licenseSchema: Model<ILicensePersistence & Document>;
  private logger: any;

  public constructor() {
    this.licenseSchema = Container.get('licenseSchema');
    this.logger = Container.get('logger');
  }

  private createBaseQuery(): any {
    return { where: {} };
  }

  public async exists(licenseId: LicenseId | string): Promise<boolean> {
    const idX = licenseId instanceof LicenseId ? (licenseId as LicenseId).id.toValue() : licenseId;
    const query = { domainId: idX };
    const licenseDocument = await this.licenseSchema.findOne(query);
    return !!licenseDocument;
  }

  public async save(license: License): Promise<License> {
    const query = { domainId: license.id.toString() };
    const licenseDocument = await this.licenseSchema.findOne(query);

    try {
      if (!licenseDocument) {
        const rawLicense = LicenseMap.toPersistence(license);
        const licenseCreated = await this.licenseSchema.create(rawLicense);
        return LicenseMap.toDomain(licenseCreated);
      } else {
        // Optional: Implement update logic if needed
        return LicenseMap.toDomain(licenseDocument);
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

