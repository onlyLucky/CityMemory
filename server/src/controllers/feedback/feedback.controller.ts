import { Context } from 'koa';
import FeedbackService from '../../services/feedback/feedback.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 反馈模块
 *   description: 反馈相关接口
 */
class FeedbackController {
  /**
   * @swagger
   * /api/v1/feedback:
   *   post:
   *     tags:
   *       - 反馈模块
   *     summary: 提交反馈
   *     description: 用户提交问题反馈或建议
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - feedbackType
   *               - title
   *               - content
   *             properties:
   *               feedbackType:
   *                 type: integer
   *                 enum: [1, 2, 3, 4]
   *                 description: '反馈类型：1-Bug反馈，2-建议，3-投诉，4-其他'
   *                 example: 1
   *               title:
   *                 type: string
   *                 description: 反馈标题
   *                 example: '登录问题'
   *               content:
   *                 type: string
   *                 description: 反馈内容
   *                 example: '无法正常登录'
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: 图片URL列表
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
   *                       $ref: '#/components/schemas/Feedback'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async submitFeedback(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      feedbackType: number;
      title: string;
      content: string;
      images?: string[];
    };
    const result = await FeedbackService.submit(userId, {
      feedbackType: data.feedbackType,
      title: data.title,
      content: data.content,
      images: data.images,
    });
    success(ctx, result, '提交成功');
  }

  /**
   * @swagger
   * /api/v1/feedback/list:
   *   get:
   *     tags:
   *       - 反馈模块
   *     summary: 获取反馈列表
   *     description: 获取当前用户的反馈列表
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: page
   *         in: query
   *         schema:
   *           type: integer
   *           default: 1
   *         description: 页码
   *       - name: pageSize
   *         in: query
   *         schema:
   *           type: integer
   *           default: 10
   *         description: 每页数量
   *     responses:
   *       200:
   *         description: 成功获取反馈列表
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
   *                         list:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Feedback'
   *                         total:
   *                           type: integer
   *                         page:
   *                           type: integer
   *                         pageSize:
   *                           type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getFeedbackList(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 10;

    const result = await FeedbackService.getList(userId, page, pageSize);
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/feedback/{feedbackId}:
   *   get:
   *     tags:
   *       - 反馈模块
   *     summary: 获取反馈详情
   *     description: 获取指定反馈的详细信息
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: feedbackId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: 反馈ID
   *     responses:
   *       200:
   *         description: 成功获取反馈详情
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Feedback'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  async getFeedbackDetail(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const feedbackId = parseInt(ctx.params.feedbackId);
    const result = await FeedbackService.getDetail(userId, feedbackId);
    success(ctx, result);
  }
}

export default new FeedbackController();
