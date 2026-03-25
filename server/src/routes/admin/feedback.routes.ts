import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminFeedbackController from '../../controllers/admin/feedback.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminFeedbackController.getFeedbackList);

router.get('/:feedbackId', adminAuthMiddleware, AdminFeedbackController.getFeedbackDetail);

router.post(
  '/:feedbackId/reply',
  adminAuthMiddleware,
  validate(
    Joi.object({
      reply: Joi.string().min(1).max(500).required(),
    }),
  ),
  AdminFeedbackController.replyFeedback,
);

router.delete('/:feedbackId', adminAuthMiddleware, AdminFeedbackController.deleteFeedback);

export default router;
