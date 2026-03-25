import Joi from 'joi';

export const levelValidator = {
  getLevels: Joi.object({
    regionId: Joi.number().integer().positive(),
    countryId: Joi.number().integer().positive(),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(20),
  }),

  getLevelDetail: Joi.object({
    levelId: Joi.number().integer().positive().required(),
  }),

  startLevel: Joi.object({
    levelId: Joi.number().integer().positive().required(),
  }),

  endLevel: Joi.object({
    sessionId: Joi.string().required(),
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.number().required(),
          answer: Joi.string().required(),
          timeSpent: Joi.number().required(),
        }),
      )
      .required(),
  }),

  answerFail: Joi.object({
    sessionId: Joi.string().required(),
    questionId: Joi.number().required(),
    questionType: Joi.number().required(),
    questionContent: Joi.string().required(),
    cityId: Joi.string().required(),
    cityName: Joi.string().required(),
    provinceId: Joi.string(),
    provinceName: Joi.string(),
    userAnswer: Joi.string().required(),
    correctAnswer: Joi.string().required(),
    options: Joi.array()
      .items(
        Joi.object({
          key: Joi.string().required(),
          value: Joi.string().required(),
        }),
      )
      .required(),
    timeSpent: Joi.number().required(),
  }),

  giveUp: Joi.object({
    sessionId: Joi.string().required(),
  }),
};
