export interface IPasswordPersistence {
  _id: string;
  userId: string;
  password: string;
  deletedAt: Date;
}
