import { Service } from 'typedi';

import config from '../../config';

import IOrderService from './IServices/IOrderService';
import { IOrderDTO } from '../dto/IOrderDTO';
import { Result } from '../core/logic/Result';
import IOrderRepo from './IRepos/IOrderRepo';
import { Order } from '../domain/order/order';
import { PaymentMethod } from '../domain/order/PaymentMethod';
import { Price } from '../domain/order/Price';
import { ShippingMethod } from '../domain/order/ShippingMethod';
import { ShippingAddress } from '../domain/order/ShippingAddress';
import { ReceiptName } from '../domain/order/ReceiptName';
import { UserNif } from '../domain/order/UserNif';
import { UserEmail } from '../domain/user/userEmail';
import { OrderStatus } from '../domain/order/OrderStatus';
import { OrderMap } from '../mappers/OrderMap';
import sendEmail from '../utils/email/sendEmail';
import { Container } from 'typedi';
import jwt from 'jsonwebtoken'; // Use import for jsonwebtoken



@Service()
export default class OrderService implements IOrderService {
  private orderRepo: IOrderRepo;
  private logger: any;

  public constructor() {
    this.orderRepo = Container.get('OrderRepo');
    this.logger = Container.get('logger');
  }

  public async postOrder(orderDTO: IOrderDTO): Promise<Result<IOrderDTO>> {
    try {
      /*
      const userDocument = await this.userRepo.findByEmail( userDTO.email );
      const found = !!userDocument;
      if (found) {
        return Result.fail<IUserDTO>("User already exists with email=" + userDTO.email);
      }
    */

      const date = new Date();
      const orderNumber = this.generateOrderNumber();
      const paymentMethod = PaymentMethod.create(
        orderDTO.paymentMethod
      ).getValue();
      const totalPrice = Price.create(orderDTO.totalPrice).getValue();
      const shippingMethod = ShippingMethod.create(
        orderDTO.shippingMethod
      ).getValue();
      const shippingAddress = ShippingAddress.create(
        orderDTO.shippingAddress
      ).getValue();
      const receiptName = ReceiptName.create(orderDTO.receiptName).getValue();
      const userNif = UserNif.create(orderDTO.userNif).getValue();
      const email = UserEmail.create(orderDTO.email).getValue();
      const orderStatus = OrderStatus.create(orderDTO.orderStatus).getValue();

      const orderOrError = Order.create({
        date: date,
        orderNumber: orderNumber,
        paymentMethod: paymentMethod,
        totalPrice: totalPrice,
        shippingMethod: shippingMethod,
        shippingAddress: shippingAddress,
        receiptName: receiptName,
        userNif: userNif,
        email: email,
        orderStatus: orderStatus,
        weapons: orderDTO.weapons,
      });

      await sendEmail(
        email.value,
        'Order Confirmation',
        {
          name: receiptName.value,
          orderNumber: orderNumber,
          orderDate: date,
          items: orderDTO.weapons,
          totalAmount: totalPrice.value,
          orderDetailsLink: config.frontEnd.url + '/order/' + orderNumber,
        },
        'orderConfirmation'
      );

      const orderResult = orderOrError.getValue();

      await this.orderRepo.save(orderResult);

      const orderDTOResult = OrderMap.toDTO(orderResult) as IOrderDTO;
      return Result.ok<IOrderDTO>(orderDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private generateOrderNumber(): number {
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const randomPart = Math.floor(100 + Math.random() * 900); // Random 3-digit number
    return Number(`${timestamp}${randomPart}`);
  }

  public async getOrders(token:string): Promise<Result<IOrderDTO[]>> {

    let email;
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { email: string };
        email = decoded.email;
      } catch (err) {
        this.logger.error('Token verification failed:', err);
        throw new Error('Invalid token');
      }


    const orders = await this.orderRepo.findOrders(email);

    if (orders === null) {
      return Result.fail<IOrderDTO[]>('order não encontrado');
    } else {
      const ordersResult: IOrderDTO[] = [];
      orders.forEach(function (order) {
        ordersResult.push(OrderMap.toDTO(order) as IOrderDTO);
      });
      return Result.ok<IOrderDTO[]>(ordersResult);
    }
  }
}
