import Router from '@koa/router';
import userRoutes from './user.routes';
import levelRoutes from './level.routes';
import questionRoutes from './question.routes';
import shopRoutes from './shop.routes';
import rankRoutes from './rank.routes';
import feedbackRoutes from './feedback.routes';
import adminRoutes from './admin.routes';

const router = new Router({ prefix: '/api/v1' });

router.use(userRoutes.routes());
router.use(levelRoutes.routes());
router.use(questionRoutes.routes());
router.use(shopRoutes.routes());
router.use(rankRoutes.routes());
router.use(feedbackRoutes.routes());
router.use(adminRoutes.routes());

export default router;
