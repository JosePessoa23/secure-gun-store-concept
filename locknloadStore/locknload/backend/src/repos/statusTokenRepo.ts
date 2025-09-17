import Container, { Service } from "typedi";
import IStatusTokenRepo from "../services/IRepos/IStatusTokenRepo";
import { IStatusTokenPersistence } from "../dataschema/IStatusTokenPersistance";
import { Model } from "mongoose";
import { StatusToken } from "../domain/token/statusToken";
import { StatusTokenMap } from "../mappers/StatusTokenMap";


@Service()
export default class StatusTokenRepo implements IStatusTokenRepo {
  private statusTokenSchema: Model<
    IStatusTokenPersistence & Document
  >;

  public constructor() {
    this.statusTokenSchema = Container.get('statusTokenSchema');
  }

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async createStatusToken(statusToken: StatusToken): Promise<StatusToken> {
    const query = { domainId: statusToken.id.toString() };
    const statusTokenDocument = await this.statusTokenSchema.findOne(
      query
    );
    if (statusTokenDocument === null) {
      const rawStatusToken: any = StatusTokenMap.toPersistence(statusToken);
      const statusTokenCreated = await this.statusTokenSchema.create(
        rawStatusToken
      );
      return StatusTokenMap.toDomain(statusTokenCreated);
    }
  }

  public async getMostRecentNotExpiredTokenByUserId(
    email: string
  ): Promise<StatusToken | null> {
    const currentDate = new Date();

    // Query Improvement:
    const query = {
      email: email,
      expiresAt: { $gt: currentDate }, // Ensure expiresAt is strictly greater than now
    };

    // Find and Sort:
    const statusTokenDocument = await this.statusTokenSchema
      .findOne(query)
      .sort({ createdAt: -1 }); // Get most recent first

    // Explicit Check for Expiration:
    if (statusTokenDocument && statusTokenDocument.expiresAt > currentDate) {
      return StatusTokenMap.toDomain(statusTokenDocument);
    } else {
      return null; // No valid token found
    }
  }
}
