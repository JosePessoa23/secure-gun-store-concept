import { StatusToken } from "backend/src/domain/token/statusToken";


export default interface IStatusTokenRepo {
  createStatusToken(statusToken: StatusToken): Promise<StatusToken>;
  getMostRecentNotExpiredTokenByUserId(userId: string): Promise<StatusToken>;
}