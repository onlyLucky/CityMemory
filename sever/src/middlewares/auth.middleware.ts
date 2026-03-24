import { Context, Next } from 'koa';
import { jwtUtil } from '@/config/jwt';
import { error, throwErr } from '@/utils/response';
import { ERROR_CODE } from '@/constants/error';
import { logger } from '@/utils/logger';

export const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throwErr(ERROR_CODE.UNAUTHORIZED);
      return;
    }

    const decoded = jwtUtil.verify(token);
    ctx.state.user = decoded;

    await next();
  } catch (err) {
    logger.error('认证失败', err);
    error(ctx, err);
  }
};

export const adminAuthMiddleware = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throwErr(ERROR_CODE.UNAUTHORIZED);
      return;
    }

    const decoded = jwtUtil.verify(token);
    if (decoded.role !== 'admin') {
      throwErr(ERROR_CODE.FORBIDDEN);
      return;
    }

    ctx.state.admin = decoded;

    await next();
  } catch (err) {
    logger.error('管理员认证失败', err);
    error(ctx, err);
  }
};
