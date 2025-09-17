import mongoose from 'mongoose';
import { IApplicationPersistence } from '../../dataschema/IApplicationPersistence';

const Application = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      index: true,
    },

    address: {
      type: String,
      index: true,
    },

    birthDate: {
      type: Date,
      index: true,
    },

    medicalCertificate: {
      type: Buffer,
      index: true,
    },

    documentId: {
      type: Buffer,
      index: true,
    },
    status: {
      type: String,
      index: true,
    },
    date: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IApplicationPersistence & mongoose.Document>('Application', Application);
