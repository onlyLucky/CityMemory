import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import AdminRankController from '../../controllers/admin/rank.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminRankController.getRankingList);

router.get('/user/:userId', adminAuthMiddleware, AdminRankController.getUserRankDetail);

router.get('/export', adminAuthMiddleware, AdminRankController.exportRankingData);

export default router;
