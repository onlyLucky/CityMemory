import winston from 'winston';
import { LOG_CONFIG } from '@/constants/config';
import path from 'path';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

if (LOG_CONFIG.filePath) {
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_CONFIG.filePath, 'error.log'),
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: path.join(LOG_CONFIG.filePath, 'combined.log'),
      format: logFormat,
    })
  );
}

export const logger = winston.createLogger({
  level: LOG_CONFIG.level,
  format: logFormat,
  transports,
  exitOnError: false,
});

export default logger;
