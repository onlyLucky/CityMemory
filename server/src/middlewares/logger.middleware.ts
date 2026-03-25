import { Context, Next } from 'koa';
import { logger } from '../config/logger';

export const loggerMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const startTime = Date.now();

  const requestInfo = {
    method: ctx.method,
    url: ctx.url,
    ip: ctx.ip,
    userAgent: ctx.get('user-agent'),
    body: ctx.method !== 'GET' ? ctx.request.body : undefined,
  };

  logger.info('请求开始:', requestInfo);

  await next();

  const responseTime = Date.now() - startTime;

  logger.info('请求完成:', {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    responseTime: `${responseTime}ms`,
  });
};
