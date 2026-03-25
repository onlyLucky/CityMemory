import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import AdminDashboardController from '../../controllers/admin/dashboard.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminDashboardController.getDashboardData);

router.get('/user-stats', adminAuthMiddleware, AdminDashboardController.getUserStats);

router.get('/game-stats', adminAuthMiddleware, AdminDashboardController.getGameStats);

router.get('/level-stats', adminAuthMiddleware, AdminDashboardController.getLevelStats);

export default router;
