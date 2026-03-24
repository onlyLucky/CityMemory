import { Context, Next } from 'koa';
import { logger } from '@/utils/logger';

export const loggerMiddleware = async (ctx: Context, next: Next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  const logData = {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    duration: `${duration}ms`,
    ip: ctx.ip,
    userAgent: ctx.headers['user-agent'],
  };

  logger.info('HTTP请求', logData);
};
