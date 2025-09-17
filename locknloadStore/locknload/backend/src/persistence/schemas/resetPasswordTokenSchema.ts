import mongoose from 'mongoose';
import { IResetPasswordTokenPersistence } from '../../dataschema/IResetPasswordTokenPersistence';
const { Schema, model } = mongoose;

const ResetPasswordToken = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    userId: {
      type: String,
      ref: 'User',
    },

    token: {
      type: String,
      index: true,
    },

    expiresAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IResetPasswordTokenPersistence & mongoose.Document>(
  'ResetPasswordToken',
  ResetPasswordToken,
);
