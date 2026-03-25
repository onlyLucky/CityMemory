import Router from '@koa/router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import Joi from 'joi';
import LevelController from '../controllers/level/level.controller';

const router = new Router();

router.get('/regions', LevelController.getRegions);

router.get('/countries', LevelController.getCountries);

router.get('/provinces', LevelController.getProvinces);

router.get('/cities', LevelController.getCities);

router.get('/', authMiddleware, LevelController.getLevels);

router.get('/:levelId', authMiddleware, LevelController.getLevelDetail);

router.post('/:levelId/start', authMiddleware, LevelController.startLevel);

router.post(
  '/answer-fail',
  authMiddleware,
  validate(
    Joi.object({
      sessionId: Joi.string().required(),
      questionId: Joi.number().required(),
      userAnswer: Joi.string().required(),
      correctAnswer: Joi.string().required(),
      timeSpent: Joi.number().required(),
    }),
  ),
  LevelController.recordAnswerFail,
);

router.post(
  '/:levelId/end',
  authMiddleware,
  validate(
    Joi.object({
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
  ),
  LevelController.endLevel,
);

router.post('/:sessionId/abandon', authMiddleware, LevelController.abandonLevel);

export default router;
