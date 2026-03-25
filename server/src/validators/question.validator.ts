import Joi from 'joi';

export const questionValidator = {
  random: Joi.object({
    count: Joi.number().integer().min(1).max(10).default(5),
    region: Joi.string(),
    difficulty: Joi.number().valid(1, 2, 3, 4),
  }),

  answer: Joi.object({
    questionId: Joi.string().required(),
    userAnswer: Joi.string().required(),
    timeSpent: Joi.number().required(),
  }),
};
