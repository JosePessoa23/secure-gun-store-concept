import mongoose from 'mongoose';
import { IWeaponPersistence } from '../../dataschema/IWeaponPersistence';

const Weapon = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      index: true,
      unique: true,
    },

    price: {
      type: Number,
      index: true,
    },

    description: {
      type: String,
      index: true,
    },

    image: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IWeaponPersistence & mongoose.Document>('Weapon', Weapon);
