import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminUserController from '../../controllers/admin/user.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminUserController.getUserList);

router.get('/:userId', adminAuthMiddleware, AdminUserController.getUserDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      nickname: Joi.string().min(1).max(50).required(),
      avatar: Joi.string().allow(''),
      gender: Joi.number().valid(0, 1, 2),
      province: Joi.string().max(50),
      city: Joi.string().max(50),
      country: Joi.string().max(50),
      ticketCount: Joi.number().min(0),
      starCount: Joi.number().min(0),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminUserController.createUser,
);

router.put(
  '/:userId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      nickname: Joi.string().min(1).max(50),
      avatar: Joi.string().allow(''),
      gender: Joi.number().valid(0, 1, 2),
      province: Joi.string().max(50),
      city: Joi.string().max(50),
      country: Joi.string().max(50),
      ticketCount: Joi.number().min(0),
      starCount: Joi.number().min(0),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminUserController.updateUser,
);

router.delete('/:userId', adminAuthMiddleware, AdminUserController.deleteUser);

router.post(
  '/batch-delete',
  adminAuthMiddleware,
  validate(
    Joi.object({
      userIds: Joi.array().items(Joi.number()).min(1).required(),
    }),
  ),
  AdminUserController.batchDeleteUsers,
);

router.put(
  '/:userId/status',
  adminAuthMiddleware,
  validate(
    Joi.object({
      status: Joi.number().valid(0, 1).required(),
    }),
  ),
  AdminUserController.updateUserStatus,
);

export default router;
