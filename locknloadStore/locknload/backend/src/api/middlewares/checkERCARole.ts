import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import Logger from '../../loaders/logger';


const checkERCARole = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
  }

  if (typeof token === 'string') {
      jwt.verify(token, config.jwtSecret, (err, user) => {
          if (err) {
              return res.status(401).send('Invalid token');
          }

          const userDecoded = user as JwtPayload;

          if (req.method === 'POST') {
              Logger.info(`License of user: ${req.params.email} ${req.params.approve} by: ${userDecoded.email}`);
          }

          if (userDecoded.role !== 'ERCA') {
              return res.status(403).send('Forbidden: insufficient privileges');
          }

          next();
      });
  } else {
      return res.status(401).json({ error: 'Invalid authorization token format' });
  }
};

export default checkERCARole;