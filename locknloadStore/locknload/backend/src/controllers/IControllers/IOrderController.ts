import { Request, Response, NextFunction } from 'express';

export default interface IOrderController {
  postOrder(req: Request, res: Response, next: NextFunction);
  getOrders(req: Request, res: Response, next: NextFunction);
}
