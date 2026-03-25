import Router from '@koa/router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import Joi from 'joi';
import ShopController from '../controllers/shop/shop.controller';

const router = new Router();

router.get('/', ShopController.getShopItems);

router.post(
  '/purchase',
  authMiddleware,
  validate(
    Joi.object({
      itemId: Joi.number().required(),
      quantity: Joi.number().min(1).default(1),
    }),
  ),
  ShopController.purchaseItem,
);

router.post(
  '/exchange-stars',
  authMiddleware,
  validate(
    Joi.object({
      stars: Joi.number().min(1).required(),
    }),
  ),
  ShopController.exchangeStars,
);

export default router;
