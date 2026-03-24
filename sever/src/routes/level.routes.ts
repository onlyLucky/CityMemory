import Router from '@koa/router';
import { LevelController } from '@/controllers/level/level.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/level' });
const levelController = new LevelController();

router.get('/list', authMiddleware, levelController.getLevelList);
router.get('/:id', authMiddleware, levelController.getLevelDetail);
router.post('/:id/start', authMiddleware, levelController.startLevel);
router.post('/:id/answer', authMiddleware, levelController.submitAnswer);
router.post('/:id/complete', authMiddleware, levelController.completeLevel);

export default router;
