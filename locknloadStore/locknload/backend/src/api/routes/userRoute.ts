import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import config from '../../../config';
import UserController from '../../controllers/IControllers/IUserController';
import ResetPasswordController from 'backend/src/controllers/resetPasswordController';
import rateLimitMiddleware from '../rateLimiter/rateLimiter';
import progressiveDelayMiddleware from '../middlewares/progressiveDelayMiddleware';
import { verifyToken } from '../middlewares/verifyToken';
import winston = require('winston');

const route = Router();

const antiCacheHeadersMiddleware = (req, res, next) => {
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

export default (app: Router, store: any, isAuthenticatedMiddleware) => {
  const ctrl = Container.get(config.controllers.user.name) as UserController;
  const resetPasswordCtrl = Container.get(
    config.controllers.resetPassword.name
  ) as ResetPasswordController;

  app.use('/auth', route);
  app.use(antiCacheHeadersMiddleware);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        birthDate: Joi.date().required(),
        role: Joi.string().required(),
        morada: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.signUp(req, res, next)
  );

  route.post(
    '/signin',
    rateLimitMiddleware,
    progressiveDelayMiddleware,
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        fingerprint: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.signIn(req, res, next, store)
  );

  route.get('/tfa', verifyToken, isAuthenticatedMiddleware, (req, res, next) =>
    ctrl.get2fa(req, res, next)
  );

  route.get('/has2fa', (req, res, next) => ctrl.has2fa(req, res, next));

  route.put(
    '/update',
    verifyToken,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        birthDate: Joi.date().required(),
        morada: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.updateUser(req, res, next)
  );

  route.get(
    '/currentUser',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => ctrl.getCurrentUser(req, res, next)
  );

  route.get(
    '/users/:email',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => ctrl.getUserByEmail(req, res, next)
  );

  route.post(
    '/itsme',
    //verifyToken,
    //isAuthenticatedMiddleware,
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        fingerprint: Joi.string().required(),
        token: Joi.string().required(),
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req, res, next) => resetPasswordCtrl.addFingerPrint(req, res, next)
  );

  route.delete(
    '/delete',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => ctrl.deleteUser(req, res, next)
  );

  // Route to get all active sessions for a user
  route.get(
    '/sessions',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      const username = req.session.user.email;

      store.get(username, (err, userSessions) => {
        if (err) {
          console.error(err);
          res.status(500).send({ msg: 'Internal server error' });
        } else {
          const filteredSessions = userSessions.filter((id) => id !== req.sessionID);
          res.send({ sessions: filteredSessions || [] });
        }
      });
    }
  );

  // Route to kill a specific session for a user
  route.post(
    '/killSession',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      const username = req.session.user.email;
      const { sessionID } = req.body;

      if (!sessionID) {
        return res.status(400).send({ msg: 'Session ID is required' });
      }

      store.get(username, (err, userSessions) => {
        if (err) {
          console.error(err);
          res.status(500).send({ msg: 'Internal server error' });
        } else {
          if (userSessions && userSessions.includes(sessionID)) {
            store.destroy(sessionID, (err) => {
              if (err) {
                console.error(err);
                res.status(500).send({ msg: 'Failed to destroy session' });
              } else {
                const updatedSessions = userSessions.filter(
                  (id) => id !== sessionID
                );
                store.set(username, updatedSessions, (err) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send({ msg: 'Failed to update sessions' });
                  } else {
                    res.send({ msg: 'Session terminated' });
                  }
                });
              }
            });
          } else {
            res.status(404).send({ msg: 'Session not found' });
          }
        }
      });
    }
  );

  // Route to kill all sessions for a user
  route.post(
    '/killAllSessions',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => {
      const username = req.session.user.email;

      store.get(username, (err, userSessions) => {
        if (err) {
          console.error(err);
          res.status(500).send({ msg: 'Internal server error' });
        } else {
          if (userSessions) {
            userSessions.forEach((sessionID) => {
              store.destroy(sessionID, (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send({ msg: 'Failed to destroy session' });
                }
              });
            });

            store.del(username, (err) => {
              if (err) {
                console.error(err);
                res.status(500).send({ msg: 'Failed to delete sessions' });
              } else {
                res.send({ msg: 'All sessions terminated' });
              }
            });
          } else {
            res.status(404).send({ msg: 'No sessions found' });
          }
        }
      });
    }
  );

  // Route to get features
  route.get(
    '/features',
    verifyToken,
    isAuthenticatedMiddleware,
    (req, res, next) => ctrl.getUserFeatures(req, res, next)
  );
};
