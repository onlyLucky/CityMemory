import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminQuestionController from '../../controllers/admin/question.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminQuestionController.getQuestionList);

router.get('/:questionId', adminAuthMiddleware, AdminQuestionController.getQuestionDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      questionType: Joi.number().valid(1, 2, 3, 4).required(),
      levelId: Joi.number().required(),
      questionText: Joi.string().min(1).max(500).required(),
      questionImage: Joi.string(),
      optionA: Joi.string().max(200),
      optionB: Joi.string().max(200),
      optionC: Joi.string().max(200),
      optionD: Joi.string().max(200),
      correctAnswer: Joi.string().max(200).required(),
      explanation: Joi.string().max(500),
      difficulty: Joi.number().min(1).max(5),
      sortOrder: Joi.number(),
    }),
  ),
  AdminQuestionController.createQuestion,
);

router.put(
  '/:questionId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      questionType: Joi.number().valid(1, 2, 3, 4),
      levelId: Joi.number(),
      questionText: Joi.string().min(1).max(500),
      questionImage: Joi.string(),
      optionA: Joi.string().max(200),
      optionB: Joi.string().max(200),
      optionC: Joi.string().max(200),
      optionD: Joi.string().max(200),
      correctAnswer: Joi.string().max(200),
      explanation: Joi.string().max(500),
      difficulty: Joi.number().min(1).max(5),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminQuestionController.updateQuestion,
);

router.delete('/:questionId', adminAuthMiddleware, AdminQuestionController.deleteQuestion);

router.post(
  '/batch-delete',
  adminAuthMiddleware,
  validate(
    Joi.object({
      questionIds: Joi.array().items(Joi.number()).min(1).required(),
    }),
  ),
  AdminQuestionController.batchDeleteQuestions,
);

router.post(
  '/batch-import',
  adminAuthMiddleware,
  validate(
    Joi.object({
      questions: Joi.array()
        .items(
          Joi.object({
            questionType: Joi.number().valid(1, 2, 3, 4).required(),
            levelId: Joi.number().required(),
            questionText: Joi.string().min(1).max(500).required(),
            questionImage: Joi.string(),
            optionA: Joi.string().max(200),
            optionB: Joi.string().max(200),
            optionC: Joi.string().max(200),
            optionD: Joi.string().max(200),
            correctAnswer: Joi.string().max(200).required(),
            explanation: Joi.string().max(500),
            difficulty: Joi.number().min(1).max(5),
            sortOrder: Joi.number(),
          }),
        )
        .min(1)
        .required(),
    }),
  ),
  AdminQuestionController.batchImportQuestions,
);

router.get('/export', adminAuthMiddleware, AdminQuestionController.batchExportQuestions);

export default router;
