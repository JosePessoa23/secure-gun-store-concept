import { Inject, Service } from 'typedi';
import config from '../../config';
import { NextFunction, Request, Response } from 'express';
import { Result } from '../core/logic/Result';

import Logger from '../loaders/logger';
import IResetPasswordController from './IControllers/IResetPasswordController';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IResetPasswordEmailDTO } from '../dto/IResetPasswordEmailDTO';
import IResetPasswordService from '../services/IServices/IResetPasswordService';
import { IResetPasswordDTO } from '../dto/IResetPasswordDTO';
import { IChangePasswordDTO } from '../dto/IChangePasswordDTO';
import IUserController from './IControllers/IUserController';

@Service()
export default class ResetPasswordController
  implements IResetPasswordController
{
  @Inject(config.services.resetPassword.name)
  private resetPasswordServiceInstance: IResetPasswordService;

  public constructor() {
    //
  }

  public async resetPasswordEmail(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<Response> {
    try {
      const resetPasswordEmailDTO = req.body as IResetPasswordEmailDTO;
      const resetPasswordEmailOrError =
        (await this.resetPasswordServiceInstance.resetPasswordEmail(
          resetPasswordEmailDTO
        )) as Result<IResetPasswordEmailDTO>;

      if (resetPasswordEmailOrError.isFailure) {
        Logger.error(
          'Error sending reset password email:',
          resetPasswordEmailOrError.error
        );
        return res.status(400).json(resetPasswordEmailOrError.error);
      }

      Logger.info('Reset password email sent');
      return res.status(201).json('ok');
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async resetPassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<Response> {
    try {
      const resetPasswordDto = req.body as IResetPasswordDTO;
      Logger.info('Resetting password');
      const resetPasswordOrError =
        (await this.resetPasswordServiceInstance.resetPassword(
          resetPasswordDto
        )) as Result<IResetPasswordDTO>;

      if (resetPasswordOrError.isFailure) {
        Logger.error('Error resetting password:', resetPasswordOrError.error);
        return res.status(400).json(resetPasswordOrError.error);
      }

      Logger.info('Password reset successfully');
      return res.status(201).json('ok');
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async changePassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<Response> {
    try {
      const resetPasswordDto = req.body as IChangePasswordDTO;
      const resetPasswordOrError =
        (await this.resetPasswordServiceInstance.changePassword(
          resetPasswordDto
        )) as Result<IChangePasswordDTO>;

      if (resetPasswordOrError.isFailure) {
        Logger.error('Error changing password:', resetPasswordOrError.error);
        return res.status(400).json(resetPasswordOrError.error);
      }

      Logger.info('Password changed successfully');
      return res.status(201).json('ok');
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async addFingerPrint(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email, token, fingerprint } = req.body;
      const addFingerPrintOrError =
        (await this.resetPasswordServiceInstance.addFingerPrint({
          email,
          token,
          fingerprint,
        })) as Result<{ email: string; token: string; fingerprint: string }>;

      if (addFingerPrintOrError.isFailure) {
        Logger.error('Error adding fingerprint:', addFingerPrintOrError.error);
        return res.status(400).json(addFingerPrintOrError.error);
      }

      Logger.info('FingerPrint added successfully');
      return res.status(201).json('ok');
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
