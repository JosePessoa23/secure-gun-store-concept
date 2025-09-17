import mongoose from 'mongoose';
import { ILicensePersistence } from '../../dataschema/ILicensePersistence';

const License = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    licenseNumber: {
        type: Number,
        index: true,
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

    expiryDate: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILicensePersistence & mongoose.Document>('License', License);
