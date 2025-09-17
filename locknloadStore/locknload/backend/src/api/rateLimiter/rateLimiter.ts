import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const MAX_REQUESTS = 100;

// Rate limit middleware
const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000 * 60, // 1 hour window
  max: MAX_REQUESTS, // limit each IP to 100 requests per windowMs
  keyGenerator: (req: Request) => {
    return req.body.email;
  },
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({ error: `You have exceeded your ${MAX_REQUESTS} attempts, please try again later.` });
  }
});


export default rateLimitMiddleware;
