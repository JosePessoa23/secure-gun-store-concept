import { Router } from 'express';
import user from './routes/userRoute';
import license from './routes/licenseRoute';
import order from './routes/orderRoute';
import weapon from './routes/weaponRoute';
import resetPassword from './routes/resetPasswordRoute';

export default (store: any) => {
  const app = Router();

  const isAuthenticatedMiddleware = (req, res, next) => {
    if (req.session.authenticated) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  }

  user(app, store, isAuthenticatedMiddleware);
  license(app, store, isAuthenticatedMiddleware);
  order(app, store, isAuthenticatedMiddleware);
  weapon(app, store, isAuthenticatedMiddleware);
  resetPassword(app, store, isAuthenticatedMiddleware);

  return app;
};
