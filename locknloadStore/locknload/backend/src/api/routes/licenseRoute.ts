import { Router, Request, Response } from 'express';
import upload from '../middlewares/file';
import config from '../../../config';
import LicenseController from '../../controllers/IControllers/ILicenseConroller';
import { Container } from 'typedi';
import { Joi, celebrate, Segments } from 'celebrate';
import { verifyToken } from '../middlewares/verifyToken';

const route = Router();

export default (app: Router, store: any, isAuthenticatedMiddleware) => {
  const ctrl = Container.get(
    config.controllers.license.name
  ) as LicenseController;
  app.use('/license', route);

  const nameSchema = Joi.object({
    name: Joi.string().alphanum().min(1).max(30).required(),
  });

  route.post(
    '/upload',
    upload.fields([{ name: 'medicalCertificate' }, { name: 'documentId' }]),
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        birthDate: Joi.date().required(),
        address: Joi.string().required(),
        dataConsent: Joi.boolean().valid(true).required(),
      }),
    }),
    (
      req: Request & { files: Record<string, Express.Multer.File[]> },
      res: Response,
      next
    ) => {
      ctrl.submitApplication(req, res, next);
    }
  );

  route.get(
    '/application/:email',
    //verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      ctrl.getApplicationByEmail(req, res, next);
    }
  );

  route.get('/applicationStatus/:email/:token', (req, res, next) => {
    ctrl.getApplicationStatusByEmail(req, res, next);
  });

  route.get(
    '/application/ordered/date',
    //verifyToken,
    isAuthenticatedMiddleware,
    //checkERCARole,
    (req, res, next) => {
      ctrl.getApplicationsOrderedByDate(req, res, next);
    }
  );

  route.post(
    '/application/approve/:email/:approve',
    //verifyToken,
    isAuthenticatedMiddleware,
    //checkERCARole,
    (req, res, next) => {
      ctrl.approveApplication(req, res, next);
    }
  );
};
