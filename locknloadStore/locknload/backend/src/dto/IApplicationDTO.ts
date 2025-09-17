export interface IApplicationDTO {
  name: string;
  email: string;
  birthDate: Date;
  address: string;
  medicalCertificate: Buffer;
  documentId: Buffer;
  status?: string;
  date?: Date;
}
