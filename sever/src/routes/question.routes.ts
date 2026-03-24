import Router from '@koa/router';
import { QuestionController } from '@/controllers/question/question.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/question' });
const questionController = new QuestionController();

router.get('/random', authMiddleware, questionController.getRandomQuestions);
router.post('/random/answer', authMiddleware, questionController.validateAnswer);

export default router;
