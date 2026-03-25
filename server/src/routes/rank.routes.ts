import Router from '@koa/router';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import RankController from '../controllers/rank/rank.controller';

const router = new Router();

router.get('/', RankController.getRanking);

router.get('/me', authMiddleware, RankController.getUserRank);

export default router;
