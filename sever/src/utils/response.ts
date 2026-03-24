import { Context } from 'koa';
import { ERROR_CODE, ERROR_MESSAGE } from '@/constants/error';
import { IApiResponse } from '@/types/common';

export const success = <T = any>(ctx: Context, data: T, message: string = 'success') => {
  ctx.body = {
    code: ERROR_CODE.SUCCESS,
    message,
    data,
  } as IApiResponse<T>;
};

export const error = (ctx: Context, err: any) => {
  const code = err.code || ERROR_CODE.INTERNAL_ERROR;
  const message = err.message || ERROR_MESSAGE[code] || '服务器内部错误';

  ctx.status = code >= 500 ? 500 : code >= 400 ? 400 : 200;
  ctx.body = {
    code,
    message,
    data: null,
  } as IApiResponse;
};

export const throwErr = (code: number, message?: string) => {
  const error = new Error(message || ERROR_MESSAGE[code]);
  (error as any).code = code;
  throw error;
};
