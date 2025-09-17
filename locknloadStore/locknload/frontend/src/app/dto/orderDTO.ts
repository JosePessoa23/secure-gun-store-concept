export interface OrderDTO {
    orderNumber: number;
    paymentMethod: string;
    email: string;
    orderStatus: string;
    shippingMethod: string;
    date: Date;
    weapons:string[];
  }