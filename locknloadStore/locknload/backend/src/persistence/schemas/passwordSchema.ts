import mongoose from 'mongoose';
import { IResetPasswordTokenPersistence } from '../../dataschema/IResetPasswordTokenPersistence';
import { IPasswordPersistence } from '../../dataschema/IPasswordPersistence';
const { Schema, model } = mongoose;

const Password = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    userId: {
      type: String,
      ref: 'User',
    },

    password: {
      type: String,
      index: true,
    },

    deletedAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IPasswordPersistence & mongoose.Document>('Password', Password);
