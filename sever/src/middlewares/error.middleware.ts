import { Context, Next } from 'koa';
import { error } from '@/utils/response';
import { logger } from '@/utils/logger';

export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    logger.error('请求错误', err);
    error(ctx, err);
  }
};
