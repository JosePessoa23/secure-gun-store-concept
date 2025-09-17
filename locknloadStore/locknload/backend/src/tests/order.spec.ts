import { OrderStatus } from '../domain/order/OrderStatus';
import { PaymentMethod } from '../domain/order/PaymentMethod';
import { Price } from '../domain/order/Price';
import { ReceiptName } from '../domain/order/ReceiptName';
import { ShippingAddress } from '../domain/order/ShippingAddress';
import { ShippingMethod } from '../domain/order/ShippingMethod';
import { UserNif } from '../domain/order/UserNif';
import { Order } from '../domain/order/order';
import { UserEmail } from '../domain/user/userEmail';

describe('Create a valid order', (): void => {
  const date = new Date();
  const orderNumber = 12345;
  const paymentMethod = PaymentMethod.create('CreditCard').getValue();
  const totalPrice = Price.create(150.75).getValue();
  const shippingMethod = ShippingMethod.create('Express').getValue();
  const shippingAddress = ShippingAddress.create('123 Main St').getValue();
  const receiptName = ReceiptName.create('John Doe').getValue();
  const userNif = UserNif.create('123456789').getValue();
  const email = UserEmail.create('john.doe@example.com').getValue();
  const orderStatus = OrderStatus.create('Processing').getValue();
  const weapons = ['M4A4', 'AK-47'];

  const orderResult = Order.create({
    date,
    orderNumber,
    paymentMethod,
    totalPrice,
    shippingMethod,
    shippingAddress,
    receiptName,
    userNif,
    email,
    orderStatus,
    weapons,
  });

  test('should create a valid order and ensure all properties are correctly set', (): void => {
    expect(orderResult.isSuccess).toBe(true);

    const order = orderResult.getValue();
    expect(order.orderNumber).toEqual(orderNumber);
    expect(order.paymentMethod).toEqual(paymentMethod);
    expect(order.totalPrice).toEqual(totalPrice);
    expect(order.shippingMethod).toEqual(shippingMethod);
    expect(order.shippingAddress).toEqual(shippingAddress);
    expect(order.receiptName).toEqual(receiptName);
    expect(order.userNif).toEqual(userNif);
    expect(order.email).toEqual(email);
    expect(order.orderStatus).toEqual(orderStatus);
    expect(order.weapons).toEqual(weapons);
  });

  test('ensure cannot create an order without an orderNumber', (): void => {
    const order = Order.create({
      date,
      paymentMethod,
      totalPrice,
      shippingMethod,
      shippingAddress,
      receiptName,
      userNif,
      email,
      orderStatus,
      weapons,
    } as any);

    expect(order.isFailure).toBe(true);
  });

  test('ensure cannot create an order without the nif', (): void => {
    const order = Order.create({
      date,
      orderNumber,
      paymentMethod,
      totalPrice,
      shippingMethod,
      shippingAddress,
      receiptName,
      email,
      orderStatus,
      weapons,
    } as any);

    expect(order.isFailure).toBe(true);
  });

  test('ensure cannot create an order without the shippingAddress', (): void => {
    const order = Order.create({
      date,
      orderNumber,
      paymentMethod,
      totalPrice,
      shippingMethod,
      receiptName,
      userNif,
      email,
      orderStatus,
      weapons,
    } as any);

    expect(order.isFailure).toBe(true);
  });
});
