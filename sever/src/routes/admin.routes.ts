import Router from '@koa/router';
import { AdminController } from '@/controllers/admin/admin.controller';
import { AdminUserController } from '@/controllers/admin/admin-user.controller';
import { AdminLevelController } from '@/controllers/admin/admin-level.controller';
import { AdminQuestionController } from '@/controllers/admin/admin-question.controller';
import { adminAuthMiddleware } from '@/middlewares/auth.middleware';

const router = new Router({ prefix: '/admin' });
const adminController = new AdminController();
const adminUserController = new AdminUserController();
const adminLevelController = new AdminLevelController();
const adminQuestionController = new AdminQuestionController();

router.post('/auth/login', adminController.login);
router.get('/auth/info', adminAuthMiddleware, adminController.getAdminInfo);

router.get('/user/list', adminAuthMiddleware, adminUserController.getUserList);
router.get('/user/:id', adminAuthMiddleware, adminUserController.getUserDetail);
router.post('/user', adminAuthMiddleware, adminUserController.createUser);
router.put('/user/:id', adminAuthMiddleware, adminUserController.updateUser);
router.delete('/user/:id', adminAuthMiddleware, adminUserController.deleteUser);
router.post('/user/batch-delete', adminAuthMiddleware, adminUserController.batchDeleteUsers);

router.get('/level/list', adminAuthMiddleware, adminLevelController.getLevelList);
router.get('/level/:id', adminAuthMiddleware, adminLevelController.getLevelDetail);
router.post('/level', adminAuthMiddleware, adminLevelController.createLevel);
router.put('/level/:id', adminAuthMiddleware, adminLevelController.updateLevel);
router.delete('/level/:id', adminAuthMiddleware, adminLevelController.deleteLevel);
router.post('/level/batch-delete', adminAuthMiddleware, adminLevelController.batchDeleteLevels);

router.get('/question/list', adminAuthMiddleware, adminQuestionController.getQuestionList);
router.get('/question/:id', adminAuthMiddleware, adminQuestionController.getQuestionDetail);
router.post('/question', adminAuthMiddleware, adminQuestionController.createQuestion);
router.put('/question/:id', adminAuthMiddleware, adminQuestionController.updateQuestion);
router.delete('/question/:id', adminAuthMiddleware, adminQuestionController.deleteQuestion);
router.post('/question/batch-delete', adminAuthMiddleware, adminQuestionController.batchDeleteQuestions);

export default router;
