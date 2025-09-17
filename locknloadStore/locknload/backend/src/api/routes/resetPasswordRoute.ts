import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import { celebrate, Joi } from 'celebrate';
import config from '../../../config';
import ResetPasswordController from '../../controllers/IControllers/IResetPasswordController';
import winston = require('winston');
import { verifyToken } from '../middlewares/verifyToken';

const route = Router();

export default (app: Router, store: any, isAuthenticatedMiddleware) => {
  const ctrl = Container.get(
    config.controllers.resetPassword.name
  ) as ResetPasswordController;
  app.use('/reset-password', route);

  route.post(
    '/email',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction): void =>
      ctrl.resetPasswordEmail(req, res, next)
  );

  route.post(
    '/',
    celebrate({
      body: Joi.object({
        token: Joi.string().required(),
        email: Joi.string().required(),
        new_password: Joi.string().required(),
        new_password_confirmation: Joi.string().required(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction): void =>
      ctrl.resetPassword(req, res, next)
  );

  route.put(
    '/',
    verifyToken,
    isAuthenticatedMiddleware,
    celebrate({
      body: Joi.object({
        token: Joi.string().required(),
        email: Joi.string().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        newPasswordConfirmation: Joi.string().required(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction): void =>
      ctrl.changePassword(req, res, next)
  );
};
