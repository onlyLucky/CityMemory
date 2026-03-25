import Router from '@koa/router';
import { adminAuthMiddleware } from '../middlewares/admin.middleware';
import { validate, commonSchemas } from '../middlewares/validate.middleware';
import Joi from 'joi';
import AdminAuthController from '../controllers/admin/auth.controller';

const router = new Router();

router.post(
  '/login',
  validate(
    Joi.object({
      username: commonSchemas.username,
      password: commonSchemas.password,
      captchaId: commonSchemas.captchaId,
      captchaCode: commonSchemas.captchaCode,
    }),
  ),
  AdminAuthController.login,
);

router.get('/captcha', AdminAuthController.getCaptcha);

router.get('/profile', adminAuthMiddleware, AdminAuthController.getProfile);

router.put(
  '/password',
  adminAuthMiddleware,
  validate(
    Joi.object({
      oldPassword: commonSchemas.password,
      newPassword: commonSchemas.password,
    }),
  ),
  AdminAuthController.changePassword,
);

router.post('/logout', adminAuthMiddleware, AdminAuthController.logout);

export default router;
