export interface ILicensePersistence {
    _id: string;
    licenseNumber: number;
    name: string;
    email: string;
    birthDate: Date;
    address: string;
    expiryDate: Date;
  }