import { Context, Next } from 'koa';
import { logger } from '../config/logger';

export const errorMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (err: unknown) {
    const error = err as Error & { code?: number; status?: number };

    logger.error('请求错误:', {
      url: ctx.url,
      method: ctx.method,
      status: ctx.status,
      message: error.message,
      stack: error.stack,
    });

    const status = error.status || 500;
    const code = error.code || 1006;
    const message = error.message || '服务器内部错误';

    ctx.status = status;
    ctx.body = {
      code,
      message,
      data: null,
      timestamp: Date.now(),
    };

    if (status === 500) {
      logger.error('服务器内部错误:', error);
    }
  }
};

export class HttpError extends Error {
  public code: number;
  public status: number;

  constructor(code: number, message?: string, status = 400) {
    super(message || '请求错误');
    this.code = code;
    this.status = status;
    this.name = 'HttpError';
  }
}

export const throwHttpError = (code: number, message?: string, status = 400): never => {
  throw new HttpError(code, message, status);
};
