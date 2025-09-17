export interface IResetPasswordTokenPersistence {
  _id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}
