import { Request, Response, NextFunction } from 'express';

export default interface ILicenseController {
  submitApplication(req: Request, res: Response, next: NextFunction);
  getApplicationByEmail(req: Request, res: Response, next: NextFunction);
  getApplicationStatusByEmail(req: Request, res: Response, next: NextFunction);
  getApplicationsOrderedByDate(req: Request, res: Response, next: NextFunction) ;
  approveApplication(req: Request, res: Response, next: NextFunction): Promise<Response>;
}
