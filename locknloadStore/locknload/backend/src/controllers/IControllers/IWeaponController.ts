import { Request, Response, NextFunction } from 'express';

export default interface IWeaponController {
  postWeapon(req: Request, res: Response, next: NextFunction);
  getWeapons(req: Request, res: Response, next: NextFunction);
  getWeaponsByNameAsc(req: Request, res: Response, next: NextFunction);
  getWeaponsByNameDesc(req: Request, res: Response, next: NextFunction);
  getWeaponsByPriceAsc(req: Request, res: Response, next: NextFunction);
  getWeaponsByPriceDesc(req: Request, res: Response, next: NextFunction);
  getWeaponsByName(req: Request, res: Response, next: NextFunction);
}
