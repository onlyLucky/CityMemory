import Router from '@koa/router';
import { UserController } from '@/controllers/user/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/user' });
const userController = new UserController();

router.post('/login', userController.login);
router.get('/info', authMiddleware, userController.getUserInfo);
router.put('/info', authMiddleware, userController.updateUser);
router.post('/init-province', authMiddleware, userController.initProvince);
router.get('/tickets', authMiddleware, userController.getTicketStatus);
router.post('/tickets/use', authMiddleware, userController.useTicket);

export default router;
