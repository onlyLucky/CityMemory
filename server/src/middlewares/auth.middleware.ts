import { Context, Next } from 'koa';
import { verifyToken, getTokenFromHeader } from '../utils/jwt';
import { ERROR_CODES } from '../constants/error';
import { STATUS_CODES } from '../constants/status';

export interface UserContext extends Context {
  user?: {
    userId: string;
    openid?: string;
    type: 'user';
    iat: number;
    exp: number;
  };
}

export const authMiddleware = async (ctx: UserContext, next: Next): Promise<void> => {
  const authorization = ctx.get('Authorization');
  const token = getTokenFromHeader(authorization);

  if (!token) {
    ctx.status = STATUS_CODES.UNAUTHORIZED;
    ctx.body = {
      code: ERROR_CODES.UNAUTHORIZED,
      message: '请先登录',
      data: null,
      timestamp: Date.now(),
    };
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    ctx.status = STATUS_CODES.UNAUTHORIZED;
    ctx.body = {
      code: ERROR_CODES.UNAUTHORIZED,
      message: '登录已过期，请重新登录',
      data: null,
      timestamp: Date.now(),
    };
    return;
  }

  if (payload.type === 'user') {
    ctx.user = payload as { userId: string; openid?: string; type: 'user'; iat: number; exp: number };
  }

  await next();
};

export const optionalAuthMiddleware = async (ctx: UserContext, next: Next): Promise<void> => {
  const authorization = ctx.get('Authorization');
  const token = getTokenFromHeader(authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload && payload.type === 'user') {
      ctx.user = payload as { userId: string; openid?: string; type: 'user'; iat: number; exp: number };
    }
  }

  await next();
};
