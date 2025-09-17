import { expressjwt as jwt } from 'express-jwt';
import { Request } from 'express';
import config from '../../../config';
import getTokenFromHeader from '../../utils/TokenHelper';

const isAuth = jwt({
  secret: config.jwtSecret,
  requestProperty: 'token', // Use 'requestProperty' instead of 'userProperty'
  getToken: (req: Request) => getTokenFromHeader(req),
} as any);

export default isAuth;
