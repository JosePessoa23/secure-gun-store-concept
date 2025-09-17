import { Inject, Service } from 'typedi';
import IOrderController from './IControllers/IOrderController';
import config from '../../config';
import IOrderService from '../services/IServices/IOrderService';
import { NextFunction, Request, Response } from 'express';
import { Result } from '../core/logic/Result';
import { IOrderDTO } from '../dto/IOrderDTO';
import Logger from '../loaders/logger';

@Service()
export default class OrderController implements IOrderController {
  @Inject(config.services.order.name)
  private orderServiceInstance: IOrderService;

  public constructor() {
    //
  }

  public async postOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const orderOrError = (await this.orderServiceInstance.postOrder(
        req.body as IOrderDTO
      )) as Result<IOrderDTO>;
      if (orderOrError.isFailure) {
        Logger.error('Error creating order:', orderOrError.error);
        return res.status(400).send(orderOrError.error);
      }

      Logger.info('Order Created');
      const orderDTO = orderOrError.getValue();
      return res.status(201).json(orderDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      // get the bearer token from the request headers
      const token = (req.headers['authorization'] as string).split(' ')[1];

      const ordersOrError = (await this.orderServiceInstance.getOrders(
        token
      )) as Result<IOrderDTO[]>;

      if (ordersOrError.isFailure) {
        Logger.error('Error fetching orders:', ordersOrError.error);
        return res.status(400).send(ordersOrError.error);
      }

      const ordersDTO = ordersOrError.getValue();
      return res.status(200).json(ordersDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
