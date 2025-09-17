export interface IOrderPersistence {
  _id: string;
  date: Date;
  orderNumber: number;
  paymentMethod: string;
  totalPrice: number;
  shippingMethod: string;
  shippingAddress: string;
  receiptName: string;
  userNif: string;
  email: string;
  orderStatus: string;
}
