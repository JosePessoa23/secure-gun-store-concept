import mongoose from 'mongoose';
import { IOrderPersistence } from '../../dataschema/IOrderPersistence';

const Order = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    date: {
      type: Date,
      index: true,
    },

    orderNumber: {
      type: Number,
      index: true,
    },

    paymentMethod: {
      type: String,
      index: true,
    },

    totalPrice: {
      type: Number,
      index: true,
    },

    shippingMethod: {
      type: String,
      index: true,
    },

    shippingAddress: {
      type: String,
      index: true,
    },

    receiptName: {
      type: String,
      index: true,
    },

    userNif: {
      type: String,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    orderStatus: {
      type: String,
      index: true,
    },

    weapons: {
      type: [String],
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IOrderPersistence & mongoose.Document>('Order', Order);
