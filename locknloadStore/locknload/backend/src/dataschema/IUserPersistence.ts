export interface IUserPersistence {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: Date;
  role: string;
  morada: string;
  fingerPrints: string[];
  twofaSecret: string;
}
