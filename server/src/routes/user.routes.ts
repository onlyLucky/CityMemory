import Router from '@koa/router';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validate.middleware';
import Joi from 'joi';
import UserController from '../controllers/user/user.controller';

const router = new Router();

router.post(
  '/login',
  validate(
    Joi.object({
      code: Joi.string().required(),
      nickname: commonSchemas.nickname,
      avatar: commonSchemas.avatar,
      gender: commonSchemas.gender,
      province: commonSchemas.province,
      city: commonSchemas.city,
      country: commonSchemas.country,
    }),
  ),
  UserController.login,
);

router.get('/profile', authMiddleware, UserController.getProfile);

router.put(
  '/profile',
  authMiddleware,
  validate(
    Joi.object({
      nickname: commonSchemas.nickname,
      avatar: commonSchemas.avatar,
      gender: commonSchemas.gender,
      province: commonSchemas.province,
      city: commonSchemas.city,
      country: commonSchemas.country,
    }),
  ),
  UserController.updateProfile,
);

router.post(
  '/init-province',
  authMiddleware,
  validate(
    Joi.object({
      province: Joi.string().required(),
    }),
  ),
  UserController.initProvince,
);

router.get('/tickets', authMiddleware, UserController.getTickets);

router.post('/tickets/recover', authMiddleware, UserController.recoverTicket);

router.get('/items', authMiddleware, UserController.getUserItems);

router.get('/progress', authMiddleware, UserController.getProgress);

export default router;
