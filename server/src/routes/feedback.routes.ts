import Router from '@koa/router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import Joi from 'joi';
import FeedbackController from '../controllers/feedback/feedback.controller';

const router = new Router();

router.post(
  '/',
  authMiddleware,
  validate(
    Joi.object({
      feedbackType: Joi.number().valid(1, 2, 3, 4).required(),
      content: Joi.string().min(10).max(500).required(),
      images: Joi.array().items(Joi.string()),
      contact: Joi.string().max(100),
    }),
  ),
  FeedbackController.submitFeedback,
);

router.get('/', authMiddleware, FeedbackController.getFeedbackList);

router.get('/:feedbackId', authMiddleware, FeedbackController.getFeedbackDetail);

export default router;
