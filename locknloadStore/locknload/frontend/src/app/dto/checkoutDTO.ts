export interface CheckoutDTO {
  paymentMethod: string;
  totalPrice: number;
  shippingMethod: string;
  shippingAddress: string;
  email: string;
  orderStatus: string;
  receiptName: string;
  userNif: string;
  weapons: string[];
  dataConsent: boolean;
}
