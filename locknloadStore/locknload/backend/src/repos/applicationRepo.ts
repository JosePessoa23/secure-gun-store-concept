import { Application } from '../domain/license/application';
import { ApplicationMap } from '../mappers/ApplicationMapper';
import IApplicationRepo from '../services/IRepos/IApplicationRepo';
import { ApplicationId } from '../domain/license/applicationId';
import { IApplicationPersistence } from '../dataschema/IApplicationPersistence';
import Container, { Service } from 'typedi';
import { Document, Model } from 'mongoose';

@Service()
export default class ApplicationRepo implements IApplicationRepo {
  private applicationSchema: Model<IApplicationPersistence & Document>;
  private logger: any;

  public constructor() {
    this.applicationSchema = Container.get('applicationSchema');
    this.logger = Container.get('logger');
  }

  private createBaseQuery(): any {
    return { where: {} };
  }

  public async exists(applicationId: ApplicationId | string): Promise<boolean> {
    const idX = applicationId instanceof ApplicationId ? (applicationId as ApplicationId).id.toValue() : applicationId;
    const query = { domainId: idX };
    const applicationDocument = await this.applicationSchema.findOne(query);
    return !!applicationDocument;
  }

  public async save(application: Application): Promise<Application> {
    const query = { domainId: application.id.toString() };
    const applicationDocument = await this.applicationSchema.findOne(query);

    try {
      if (!applicationDocument) {
        const rawApplication = ApplicationMap.toPersistence(application);
        const applicationCreated = await this.applicationSchema.create(rawApplication);
        return ApplicationMap.toDomain(applicationCreated);
      } else {
        const rawApplication = ApplicationMap.toPersistence(application);
        const updatedApplication = await this.applicationSchema.findByIdAndUpdate(
        applicationDocument._id,
        rawApplication,
      { new: true }
    );
        return ApplicationMap.toDomain(applicationDocument);
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async findByEmail(email: string): Promise<Application | null> {
    const query = { email: email };
    const applicationRecord = await this.applicationSchema.findOne(query);

    if (applicationRecord) {
      return ApplicationMap.toDomain(applicationRecord);
    } else {
      return null;
    }
  }

  public async getAllOrderedByDate(): Promise<Application[]> {
    const applicationRecord = await this.applicationSchema.find({ status: 'pending' }).sort({date:1});

    if (applicationRecord != null) {
      const applications: Application[] = [];
      for (const record of applicationRecord) {
        applications.push(await ApplicationMap.toDomain(record));
      }
      return applications;
    } else {
      return null;
    }
  }
}

