import winston from 'winston';
import fs from 'fs';

// Create 'logs' directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info', // You can change this to 'error' if you only want error logs
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // Only log errors and above (e.g., 'warn', 'error')
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log', // This is for general logs (info, warn, error)
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Use the logger to log errors
const logError = (error: Error) => {
  logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
};

export default logger;
