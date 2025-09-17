export class Order {
  orderNumber: number;
  paymentMethod: string;
  email: string;
  orderStatus: string;
  shippingMethod: string;
  date: Date;
  weapons: string[];

  constructor(
    orderNumber: number,
    paymentMethod: string,
    email: string,
    orderStatus: string,
    shippingMethod: string,
    date: Date,
    weapons: string[]
  ) {
    this.orderNumber = orderNumber;
    this.paymentMethod = paymentMethod;
    this.email = email;
    this.orderStatus = orderStatus;
    this.shippingMethod = shippingMethod;
    this.date = date;
    this.weapons = weapons;
  }
}
