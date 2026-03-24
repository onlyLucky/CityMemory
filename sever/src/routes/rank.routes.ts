import Router from '@koa/router';
import { RankController } from '@/controllers/rank/rank.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/rank' });
const rankController = new RankController();

router.get('/list', authMiddleware, rankController.getRankList);

export default router;
