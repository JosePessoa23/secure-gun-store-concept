import winston from 'winston';
import config from '../../config';
import 'winston-mongodb';

const transports = [];

function sanitizeLogMessage(message: any) {
  return message.replace(/[\r\n]/g, ' ').replace(/[\\"']/g, '\\$&');
}

if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    }),
  );
}

// Adding MongoDB transport
transports.push(
  new winston.transports.MongoDB({
    db: config.mongoUri, // Your MongoDB connection URI
    collection: 'log_collection', // The name of the collection to store logs
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    level: 'info', // Logging level for MongoDB
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format(json => {
        // Sanitize log message before logging to MongoDB
        json.message = sanitizeLogMessage(json.message);
        return json;
      })(),
      winston.format.json(),
    ),
  }),
);

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format(json => {
      // Sanitize log message before logging
      json.message = sanitizeLogMessage(json.message);
      return json;
    })(),
    winston.format.json(),
  ),
  transports,
});

export default LoggerInstance;
