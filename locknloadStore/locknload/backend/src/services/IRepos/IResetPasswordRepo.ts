import { Password } from '../../domain/password/password';
import { ResetToken } from '../../domain/token/resetTokens';

export default interface IResetPasswordRepo {
  createResetToken(resetToken: ResetToken): Promise<ResetToken>;
  getMostRecentNotExpiredTokenByUserId(userId: string): Promise<ResetToken>;
  createPassword(password: Password): Promise<Password>;
}
