import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminShopController from '../../controllers/admin/shop.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminShopController.getShopItemList);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      itemName: Joi.string().min(1).max(100).required(),
      itemType: Joi.number().valid(1, 2, 3).required(),
      description: Joi.string().max(500),
      price: Joi.number().min(0).required(),
      originalPrice: Joi.number().min(0),
      icon: Joi.string(),
      effect: Joi.string().max(100),
      sortOrder: Joi.number(),
    }),
  ),
  AdminShopController.createShopItem,
);

router.put(
  '/:itemId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      itemName: Joi.string().min(1).max(100),
      itemType: Joi.number().valid(1, 2, 3),
      description: Joi.string().max(500),
      price: Joi.number().min(0),
      originalPrice: Joi.number().min(0),
      icon: Joi.string(),
      effect: Joi.string().max(100),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminShopController.updateShopItem,
);

router.delete('/:itemId', adminAuthMiddleware, AdminShopController.deleteShopItem);

export default router;
