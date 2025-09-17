import { Request, Response, NextFunction } from 'express';

export default interface IResetPasswordController {
  //Send reset password email
  resetPasswordEmail(req: Request, res: Response, next: NextFunction);

  //Reset password
  resetPassword(req: Request, res: Response, next: NextFunction);

  //Change password
  changePassword(req: Request, res: Response, next: NextFunction);

  //Add fingerprint
  addFingerPrint(req: Request, res: Response, next: NextFunction);
}
