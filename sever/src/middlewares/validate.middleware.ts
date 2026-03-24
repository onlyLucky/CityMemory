import { Context, Next } from 'koa';
import { validator } from '@/utils/validator';
import { error } from '@/utils/response';
import { logger } from '@/utils/logger';

export const validateMiddleware = (schema: any) => {
  return async (ctx: Context, next: Next) => {
    try {
      const data = {
        ...ctx.params,
        ...ctx.query,
        ...ctx.request.body,
      };

      validator.validate(schema, data);

      await next();
    } catch (err) {
      logger.error('参数验证失败', err);
      error(ctx, err);
    }
  };
};
