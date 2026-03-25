import { Context, Next } from 'koa';
import Joi from 'joi';
import { ERROR_CODES } from '../constants/error';
import { STATUS_CODES } from '../constants/status';
import { HttpError } from './error.middleware';

export const validateMiddleware = (
  schema: Joi.Schema,
  source: 'body' | 'query' | 'params' = 'body',
) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    let data: unknown;

    switch (source) {
      case 'body':
        data = ctx.request.body;
        break;
      case 'query':
        data = ctx.query;
        break;
      case 'params':
        data = ctx.params;
        break;
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join('; ');
      ctx.status = STATUS_CODES.BAD_REQUEST;
      ctx.body = {
        code: ERROR_CODES.PARAM_ERROR,
        message: messages,
        data: null,
        timestamp: Date.now(),
      };
      return;
    }

    ctx.validatedData = value;
    await next();
  };
};

export const validate = validateMiddleware;

export const commonSchemas = {
  id: Joi.number().integer().positive().required(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  openid: Joi.string().required(),
  nickname: Joi.string().max(50),
  avatar: Joi.string().uri().allow(''),
  gender: Joi.number().valid(0, 1, 2),
  province: Joi.string().max(50),
  city: Joi.string().max(50),
  country: Joi.string().max(50),
  levelId: Joi.number().integer().positive().required(),
  questionId: Joi.number().integer().positive().required(),
  itemId: Joi.number().integer().positive().required(),
  answer: Joi.string().required(),
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().min(6).max(50).required(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/),
  captchaId: Joi.string().required(),
  captchaCode: Joi.string().length(4).required(),
};

declare module 'koa' {
  interface Context {
    validatedData?: unknown;
  }
}
