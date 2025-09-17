import { Result } from '../../core/logic/Result';
import { IOrderDTO } from '../../dto/IOrderDTO';

export default interface IOrderService {
  postOrder(orderDTO: IOrderDTO): Promise<Result<IOrderDTO>>;
  getOrders(token:string | string[]): Promise<Result<IOrderDTO[]>>;
}
