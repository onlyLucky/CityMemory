import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminLevelController from '../../controllers/admin/level.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminLevelController.getLevelList);

router.get('/:levelId', adminAuthMiddleware, AdminLevelController.getLevelDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      levelName: Joi.string().min(1).max(100).required(),
      levelType: Joi.number().valid(1, 2, 3).required(),
      regionId: Joi.number(),
      countryId: Joi.number(),
      provinceId: Joi.number(),
      cityId: Joi.number(),
      difficulty: Joi.number().min(1).max(5),
      questionCount: Joi.number().min(1).max(20),
      timeLimit: Joi.number().min(30),
      starReward: Joi.number().min(0),
      description: Joi.string().max(500),
      sortOrder: Joi.number(),
    }),
  ),
  AdminLevelController.createLevel,
);

router.put(
  '/:levelId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      levelName: Joi.string().min(1).max(100),
      levelType: Joi.number().valid(1, 2, 3),
      regionId: Joi.number(),
      countryId: Joi.number(),
      provinceId: Joi.number(),
      cityId: Joi.number(),
      difficulty: Joi.number().min(1).max(5),
      questionCount: Joi.number().min(1).max(20),
      timeLimit: Joi.number().min(30),
      starReward: Joi.number().min(0),
      description: Joi.string().max(500),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminLevelController.updateLevel,
);

router.delete('/:levelId', adminAuthMiddleware, AdminLevelController.deleteLevel);

router.post(
  '/batch-delete',
  adminAuthMiddleware,
  validate(
    Joi.object({
      levelIds: Joi.array().items(Joi.number()).min(1).required(),
    }),
  ),
  AdminLevelController.batchDeleteLevels,
);

router.put(
  '/:levelId/status',
  adminAuthMiddleware,
  validate(
    Joi.object({
      status: Joi.number().valid(0, 1).required(),
    }),
  ),
  AdminLevelController.updateLevelStatus,
);

router.get('/:levelId/answer-fail-stats', adminAuthMiddleware, AdminLevelController.getAnswerFailStats);

export default router;
