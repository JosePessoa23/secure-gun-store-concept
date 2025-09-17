import { Router } from 'express';
import { Container } from 'typedi';

import { celebrate, Joi } from 'celebrate';
import config from '../../../config';
import OrderController from '../../controllers/IControllers/IOrderController';
import winston = require('winston');
import { verifyToken } from '../middlewares/verifyToken';

const route = Router();

export default (app: Router, store: any, isAuthenticatedMiddleware) => {
  const ctrl = Container.get(config.controllers.order.name) as OrderController;
  app.use('/order', route);

  route.post(
    '',
    verifyToken,
    isAuthenticatedMiddleware,
    celebrate({
      body: Joi.object({
        paymentMethod: Joi.string().required(),
        totalPrice: Joi.number().required(),
        shippingMethod: Joi.string().required(),
        shippingAddress: Joi.string().required(),
        receiptName: Joi.string().required(),
        userNif: Joi.string().required(),
        email: Joi.string().required(),
        orderStatus: Joi.string().required(),
        weapons: Joi.array()
          .items(Joi.string())
          .required(),
        dataConsent: Joi.boolean().valid(true).required()
      }),
    }),
    (req, res, next) => ctrl.postOrder(req, res, next)
  );

  route.get('', verifyToken, isAuthenticatedMiddleware, (req, res, next) =>
    ctrl.getOrders(req, res, next)
  );
};
