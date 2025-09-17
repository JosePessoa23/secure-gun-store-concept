import { IStatusTokenPersistence } from "backend/src/dataschema/IStatusTokenPersistance";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StatusToken = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    email: {
      type: String,
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

export default mongoose.model<IStatusTokenPersistence & mongoose.Document>(
  'StatusToken',
  StatusToken,
);
