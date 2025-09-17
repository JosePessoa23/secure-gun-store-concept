import Container, { Service } from 'typedi';

import { Document, Model } from 'mongoose';

import IOrderRepo from '../services/IRepos/IOrderRepo';
import { Order } from '../domain/order/order';
import { OrderId } from '../domain/order/orderId';
import { IOrderPersistence } from '../dataschema/IOrderPersistence';
import { OrderMap } from '../mappers/OrderMap';
import { UserEmail } from '../domain/user/userEmail';

@Service()
export default class OrderRepo implements IOrderRepo {
  private orderSchema: Model<IOrderPersistence & Document>;

  public constructor() {
    this.orderSchema = Container.get('orderSchema');
  }

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(orderId: OrderId | string): Promise<boolean> {
    const idX =
      orderId instanceof OrderId ? (orderId as OrderId).id.toValue() : orderId;

    const query = { domainId: idX };
    const orderDocument = await this.orderSchema.findOne(query);

    return !!orderDocument === true;
  }

  public async save(order: Order): Promise<Order> {
    const query = { domainId: order.id.toString() };

    const orderDocument = await this.orderSchema.findOne(query);

    if (orderDocument === null) {
      const rawOrder: any = OrderMap.toPersistence(order);

      const orderCreated = await this.orderSchema.create(rawOrder);

      return OrderMap.toDomain(orderCreated);
    }
  }

  public async findOrders(email: string): Promise<Order[]> {
    const query = { email: email };
    const orderRecord = await this.orderSchema.find(query);
    
    if (orderRecord != null) {
      const orders: Order[] = [];
      for (const record of orderRecord) {
        orders.push(await OrderMap.toDomain(record));
      }
      return orders;
    } else {
      return null;
    }
  }
}
