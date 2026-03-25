import { Context } from 'koa';
import { ApiResponse, PaginatedData } from '../types';
import { ErrorCode, ErrorMessage } from '../types/enums';

export const success = <T = unknown>(ctx: Context, data: T, message = '操作成功'): void => {
  ctx.body = {
    code: ErrorCode.SUCCESS,
    message,
    data,
    timestamp: Date.now(),
  } as ApiResponse<T>;
};

export const error = (
  ctx: Context,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  message?: string,
  data: unknown = null,
): void => {
  ctx.body = {
    code,
    message: message || ErrorMessage[code] || '操作失败',
    data,
    timestamp: Date.now(),
  } as ApiResponse;
};

export const paginated = <T>(
  ctx: Context,
  list: T[],
  total: number,
  page: number,
  pageSize: number,
  message = '操作成功',
): void => {
  ctx.body = {
    code: ErrorCode.SUCCESS,
    message,
    data: {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    } as PaginatedData<T>,
    timestamp: Date.now(),
  } as ApiResponse<PaginatedData<T>>;
};

export const created = <T = unknown>(ctx: Context, data: T, message = '创建成功'): void => {
  ctx.status = 201;
  ctx.body = {
    code: ErrorCode.SUCCESS,
    message,
    data,
    timestamp: Date.now(),
  } as ApiResponse<T>;
};

export const noContent = (ctx: Context): void => {
  ctx.status = 204;
};

export const badRequest = (ctx: Context, message = '参数错误'): void => {
  ctx.status = 400;
  error(ctx, ErrorCode.PARAM_ERROR, message);
};

export const unauthorized = (ctx: Context, message = '未授权'): void => {
  ctx.status = 401;
  error(ctx, ErrorCode.UNAUTHORIZED, message);
};

export const forbidden = (ctx: Context, message = '禁止访问'): void => {
  ctx.status = 403;
  error(ctx, ErrorCode.FORBIDDEN, message);
};

export const notFound = (ctx: Context, message = '资源不存在'): void => {
  ctx.status = 404;
  error(ctx, ErrorCode.NOT_FOUND, message);
};

export const internalError = (ctx: Context, message = '服务器内部错误'): void => {
  ctx.status = 500;
  error(ctx, ErrorCode.INTERNAL_ERROR, message);
};
