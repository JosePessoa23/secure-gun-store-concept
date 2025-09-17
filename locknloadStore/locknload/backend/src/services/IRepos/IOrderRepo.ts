import { UserEmail } from 'backend/src/domain/user/userEmail';
import { Repo } from '../../core/infra/Repo';
import { Order } from '../../domain/order/order';

export default interface IOrderRepo extends Repo<Order> {
  save(order: Order): Promise<Order>;
  findOrders(email: string): Promise<Order[]>;
}
