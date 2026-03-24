import Joi from 'joi';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from './response';

export const validator = {
  validate: (schema: Joi.ObjectSchema, data: any) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message).join('; ');
      throwErr(ERROR_CODE.PARAM_ERROR, messages);
    }
    return value;
  },

  string: () => Joi.string(),
  number: () => Joi.number(),
  boolean: () => Joi.boolean(),
  array: () => Joi.array(),
  object: () => Joi.object(),
  date: () => Joi.date(),
  email: () => Joi.string().email(),
  uuid: () => Joi.string().uuid(),
  required: () => Joi.required(),
  optional: () => Joi.optional(),
};
