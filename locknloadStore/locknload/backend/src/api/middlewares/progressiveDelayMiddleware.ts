import { Request, Response, NextFunction } from 'express';

const attempts: { [key: string]: { count: number, lastAttempt: number } } = {};

const progressiveDelayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const currentTime = Date.now();
  if (!attempts[email]) {
    attempts[email] = { count: 0, lastAttempt: currentTime };
  }

  const attemptData = attempts[email];
  const delay = Math.min(2 ** attemptData.count, 3600);

  if (currentTime - attemptData.lastAttempt < delay * 1000 && (currentTime - attemptData.lastAttempt) !== 0) {
    const waitTime = delay - (currentTime - attemptData.lastAttempt) / 1000;
    return res.status(429).json({ error: `Too many attempts. Please wait ${waitTime.toFixed(2)} seconds before trying again.` });
  }

  attemptData.count++;
  attemptData.lastAttempt = currentTime;

  // Add a response end hook to reset the count on successful login
  res.on('finish', () => {
    if (res.statusCode === 201) {
      attemptData.count = 0; // Reset on success
    }
  });

  next();
};

export default progressiveDelayMiddleware;
