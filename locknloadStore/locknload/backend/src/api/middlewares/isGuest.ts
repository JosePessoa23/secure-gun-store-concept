// isGuest.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import getTokenFromHeader from '../../utils/TokenHelper';

const isGuest = (req: Request, res: Response, next: NextFunction): void => {
  const token = getTokenFromHeader(req);
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        // Token is invalid, proceed as guest
        return next();
      }
      // Token is valid, user is authenticated
      return res.status(403).json({ message: 'Access denied. Only guests allowed.' });
    });
  } else {
    // No token, proceed as guest
    return next();
  }
};

export default isGuest;
