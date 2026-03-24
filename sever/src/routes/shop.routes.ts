import Router from '@koa/router';
import { ShopController } from '@/controllers/shop/shop.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/shop' });
const shopController = new ShopController();

router.get('/items', authMiddleware, shopController.getShopList);
router.post('/items/:id/buy', authMiddleware, shopController.buyItem);

export default router;
