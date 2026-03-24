import Router from '@koa/router';
import { FeedbackController } from '@/controllers/feedback/feedback.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/feedback' });
const feedbackController = new FeedbackController();

router.post('/submit', authMiddleware, feedbackController.submitFeedback);
router.get('/list', authMiddleware, feedbackController.getFeedbackList);
router.put('/:id/status', authMiddleware, feedbackController.updateFeedbackStatus);

export default router;
