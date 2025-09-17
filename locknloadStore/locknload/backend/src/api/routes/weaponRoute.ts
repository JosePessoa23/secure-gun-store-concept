import { Router } from 'express';
import { Container } from 'typedi';

import { celebrate, Joi, Segments } from 'celebrate';
import config from '../../../config';
import IWeaponController from '../../controllers/IControllers/IWeaponController';
import { verifyToken } from '../middlewares/verifyToken';

const route = Router();

export default (app: Router, store: any, isAuthenticatedMiddleware) => {
  const ctrl = Container.get(
    config.controllers.weapon.name
  ) as IWeaponController;
  app.use('/weapon', route);

  const nameSchema = Joi.object({
    name: Joi.string().alphanum().min(1).max(30).required(),
  });

  route.post(
    '',
    verifyToken,
    isAuthenticatedMiddleware,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.postWeapon(req, res, next)
  );

  route.get('', verifyToken, isAuthenticatedMiddleware, (req, res, next) => {
    ctrl.getWeapons(req, res, next);
  });

  route.get(
    '/ByNameAsc',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      ctrl.getWeaponsByNameAsc(req, res, next);
    }
  );

  route.get(
    '/PriceDesc',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      ctrl.getWeaponsByPriceDesc(req, res, next);
    }
  );

  route.get(
    '/PriceAsc',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      ctrl.getWeaponsByPriceAsc(req, res, next);
    }
  );

  route.get(
    '/ByNameDesc',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      ctrl.getWeaponsByNameDesc(req, res, next);
    }
  );

  route.get(
    '/ByName/:name',
    verifyToken,
    celebrate({
      [Segments.PARAMS]: nameSchema,
    }),
    (req, res, next) => {
      ctrl.getWeaponsByName(req, res, next);
    }
  );
};
