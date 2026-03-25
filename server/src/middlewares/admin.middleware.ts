import { Context, Next } from 'koa';
import { verifyToken, getTokenFromHeader } from '../utils/jwt';
import { ERROR_CODES, AppError } from '../constants/error';
import { STATUS_CODES } from '../constants/status';

export interface AdminContext extends Context {
  admin?: {
    userId: string;
    type: 'admin';
    iat: number;
    exp: number;
  };
}

export const adminAuthMiddleware = async (ctx: AdminContext, next: Next): Promise<void> => {
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

  if (payload.type !== 'admin') {
    ctx.status = STATUS_CODES.FORBIDDEN;
    ctx.body = {
      code: ERROR_CODES.FORBIDDEN,
      message: '无权访问',
      data: null,
      timestamp: Date.now(),
    };
    return;
  }

  ctx.admin = payload as { userId: string; type: 'admin'; iat: number; exp: number };
  await next();
};

export const adminMiddleware = adminAuthMiddleware;

export const optionalAdminMiddleware = async (ctx: AdminContext, next: Next): Promise<void> => {
  const authorization = ctx.get('Authorization');
  const token = getTokenFromHeader(authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload && payload.type === 'admin') {
      ctx.admin = payload as { userId: string; type: 'admin'; iat: number; exp: number };
    }
  }

  await next();
};

export const superAdminMiddleware = async (ctx: AdminContext, next: Next): Promise<void> => {
  if (!ctx.admin) {
    ctx.status = STATUS_CODES.UNAUTHORIZED;
    ctx.body = {
      code: ERROR_CODES.UNAUTHORIZED,
      message: '请先登录',
      data: null,
      timestamp: Date.now(),
    };
    return;
  }

  const adminId = parseInt(ctx.admin.userId, 10);
  const superAdminIds = [1];

  if (!superAdminIds.includes(adminId)) {
    ctx.status = STATUS_CODES.FORBIDDEN;
    ctx.body = {
      code: ERROR_CODES.FORBIDDEN,
      message: '需要超级管理员权限',
      data: null,
      timestamp: Date.now(),
    };
    return;
  }

  await next();
};
