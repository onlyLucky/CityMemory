import Router from '@koa/router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import Joi from 'joi';
import QuestionController from '../controllers/question/question.controller';

const router = new Router();

router.post(
  '/random',
  authMiddleware,
  validate(
    Joi.object({
      levelId: Joi.number().required(),
      count: Joi.number().min(1).max(20),
    }),
  ),
  QuestionController.getRandomQuestions,
);

router.post(
  '/submit',
  authMiddleware,
  validate(
    Joi.object({
      sessionId: Joi.string().required(),
      questionId: Joi.number().required(),
      answer: Joi.string().required(),
      timeSpent: Joi.number().required(),
    }),
  ),
  QuestionController.submitAnswer,
);

export default router;
