import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { StatusToken } from "../domain/token/statusToken";


export class StatusTokenMap extends Mapper<StatusToken> {
  public static async toDomain(raw: any): Promise<StatusToken> {
    const statusTokenOrError = StatusToken.create(
      {
        email: raw.email,
        token: raw.token,
        expiresAt: raw.expiresAt,
      },
      new UniqueEntityID(raw.domainId),
    );

    statusTokenOrError.isFailure ? console.log(statusTokenOrError.error) : '';

    return statusTokenOrError.isSuccess ? statusTokenOrError.getValue() : null;
  }

  public static toPersistence(statusToken: StatusToken): any {
    const a = {
      domainId: statusToken.id.toString(),
      email: statusToken.email,
      token: statusToken.token,
      expiresAt: statusToken.expiresAt,
    };
    return a;
  }
}