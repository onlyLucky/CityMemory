import { Context } from 'koa';
import QuestionService from '../../services/question/question.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 题目模块
 *   description: 题目相关接口
 */
class QuestionController {
  /**
   * @swagger
   * /api/v1/question/random:
   *   get:
   *     tags:
   *       - 题目模块
   *     summary: 获取随机题目
   *     description: 获取随机题目用于练习
   *     parameters:
   *       - name: levelId
   *         in: query
   *         schema:
   *           type: integer
   *         description: 关卡ID
   *       - name: count
   *         in: query
   *         schema:
   *           type: integer
   *           default: 5
   *         description: 题目数量
   *       - name: difficulty
   *         in: query
   *         schema:
   *           type: integer
   *           enum: [1, 2, 3, 4]
   *         description: 难度等级
   *     responses:
   *       200:
   *         description: 成功获取题目列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Question'
   */
  async getRandomQuestions(ctx: Context) {
    const data = ctx.validatedData as {
      levelId?: number;
      count?: number;
      difficulty?: number;
    };
    const questions = await QuestionService.getRandomQuestions(
      data.count || 5,
      undefined,
      data.difficulty,
    );
    success(ctx, questions);
  }

  /**
   * @swagger
   * /api/v1/question/answer:
   *   post:
   *     tags:
   *       - 题目模块
   *     summary: 提交答案
   *     description: 提交随机题目的答案
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - questionId
   *               - answer
   *               - timeSpent
   *             properties:
   *               questionId:
   *                 type: string
   *                 description: 题目ID
   *               answer:
   *                 type: string
   *                 description: 用户答案
   *               timeSpent:
   *                 type: integer
   *                 description: 答题用时（秒）
   *     responses:
   *       200:
   *         description: 提交成功
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         correct:
   *                           type: boolean
   *                           description: 是否正确
   *                         correctAnswer:
   *                           type: string
   *                           description: 正确答案
   *                         explanation:
   *                           type: string
   *                           description: 答案解析
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async submitAnswer(ctx: Context) {
    const data = ctx.validatedData as {
      questionId: string;
      answer: string;
      timeSpent: number;
    };
    const result = await QuestionService.submitRandomAnswer(
      data.questionId,
      data.answer,
      data.timeSpent,
    );
    success(ctx, result);
  }
}

export default new QuestionController();
