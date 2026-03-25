import Joi from 'joi';

export const userValidator = {
  login: Joi.object({
    code: Joi.string().required(),
    nickname: Joi.string().max(50),
    avatar: Joi.string().uri().allow(''),
    gender: Joi.number().valid(0, 1, 2),
    province: Joi.string().max(50),
    city: Joi.string().max(50),
    country: Joi.string().max(50),
  }),

  updateProfile: Joi.object({
    nickname: Joi.string().max(50),
    avatar: Joi.string().uri().allow(''),
    gender: Joi.number().valid(0, 1, 2),
    province: Joi.string().max(50),
    city: Joi.string().max(50),
    country: Joi.string().max(50),
  }),

  initProvince: Joi.object({
    province: Joi.string().max(50).required(),
  }),
};
