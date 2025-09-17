export interface IApplicationPersistence {
  _id: string;
  name: string;
  email: string;
  birthDate: Date;
  address: string;
  medicalCertificate: Buffer;
  documentId: Buffer;
  date: Date;
}
