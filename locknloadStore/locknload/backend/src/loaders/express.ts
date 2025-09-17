import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import routes from '../api';
import config from '../../config';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  const corsOptions = {
    origin: config.frontEnd,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'email'], // Include your custom headers here
    credentials: true, // Allow credentials (cookies) to be included in requests
  };
  app.use(cors(corsOptions));

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('method-override')());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Session configuration
  const MemoryStore = require('memorystore')(session);
  const store = new MemoryStore({ checkPeriod: 86400000 }); // prune expired entries every 24h

  app.use(
    session({
      secret: 'locknload',
      cookie: {
        maxAge: 60000 * 30, // 30 minutes
        secure: false, // Set to true if your using https
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: 'Lax', // Strict prevents sending the cookie in cross-origin requests
        name: '__Host-session', // Ensures the cookie is only sent to the host that set it
      },
      saveUninitialized: false,
      resave: false,
      store,
    })
  );

  // Load API routes
  app.use(config.api.prefix, routes(store));

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    if (req.query.token || req.body.token) {
      res
        .status(400)
        .send('Session tokens should not be passed in URL or body');
    } else {
      next();
    }
  });

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: 'Unauthorized access' })
        .end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: 'An unexpected error occurred', // Generic message to avoid leaking information
      },
    });
  });
};
