import { Request, Response, NextFunction } from 'express';

export default interface IUserController {
  signUp(req: Request, res: Response, next: NextFunction);
  signIn(req: Request, res: Response, next: NextFunction, store?: any);
  getUsers(req: Request, res: Response, next: NextFunction);
  updateUser(req: Request, res: Response, next: NextFunction);
  deleteUser(req: Request, res: Response, next: NextFunction);
  getUserByEmail(req: Request, res: Response, next: NextFunction);
  getCurrentUser(req: Request, res: Response, next: NextFunction);
  get2fa(req: Request, res: Response, next: NextFunction);
  has2fa(req: Request, res: Response, next: NextFunction);
  getUserFeatures(req: Request, res: Response, next: NextFunction);
}
