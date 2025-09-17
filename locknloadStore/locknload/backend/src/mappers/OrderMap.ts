import { Mapper } from '../core/infra/Mapper';

import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { UserEmail } from '../domain/user/userEmail';
import { Order } from '../domain/order/order';
import { IOrderDTO } from '../dto/IOrderDTO';
import { PaymentMethod } from '../domain/order/PaymentMethod';
import { Price } from '../domain/order/Price';
import { ShippingMethod } from '../domain/order/ShippingMethod';
import { ShippingAddress } from '../domain/order/ShippingAddress';
import { ReceiptName } from '../domain/order/ReceiptName';
import { UserNif } from '../domain/order/UserNif';
import { OrderStatus } from '../domain/order/OrderStatus';

export class OrderMap extends Mapper<Order> {
  public static toDTO(order: Order): IOrderDTO {
    const orderDTO: IOrderDTO = {
      date: order.date,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod.value,
      totalPrice: order.totalPrice.value,
      shippingMethod: order.shippingMethod.value,
      shippingAddress: order.shippingAddress.value,
      receiptName: order.receiptName.value,
      userNif: order.userNif.value,
      email: order.email.value,
      orderStatus: order.orderStatus.value,
      weapons: order.weapons,
    };
    return orderDTO;
  }

  public static async toDomain(raw: any): Promise<Order | null> {
    const paymentMethod = PaymentMethod.create(raw.paymentMethod).getValue();
    const totalPrice = Price.create(raw.totalPrice).getValue();
    const shippingMethod = ShippingMethod.create(raw.shippingMethod).getValue();
    const shippingAddress = ShippingAddress.create(raw.shippingAddress).getValue();
    const receiptName = ReceiptName.create(raw.receiptName).getValue();
    const userNif = UserNif.create(raw.userNif).getValue();
    const email = UserEmail.create(raw.email).getValue();
    const orderStatus = OrderStatus.create(raw.orderStatus).getValue();

    const orderOrError = Order.create(
      {
        date: raw.date,
        orderNumber: raw.orderNumber,
        paymentMethod: paymentMethod,
        totalPrice: totalPrice,
        shippingMethod: shippingMethod,
        shippingAddress: shippingAddress,
        receiptName: receiptName,
        userNif: userNif,
        email: email,
        orderStatus: orderStatus,
        weapons: raw.weapons,
      },
      new UniqueEntityID(raw.domainId),
    );

    if (orderOrError.isFailure) {
      console.log(orderOrError.error);
      return null;
    }

    return orderOrError.getValue();
  }

  public static toPersistence(order: Order): any {
    const persistenceData = {
      domainId: order.id.toString(),
      date: order.date,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod.value,
      totalPrice: order.totalPrice.value,
      shippingMethod: order.shippingMethod.value,
      shippingAddress: order.shippingAddress.value,
      receiptName: order.receiptName.value,
      userNif: order.userNif.value,
      email: order.email.value,
      orderStatus: order.orderStatus.value,
      weapons: order.weapons,
    };
    return persistenceData;
  }
}
