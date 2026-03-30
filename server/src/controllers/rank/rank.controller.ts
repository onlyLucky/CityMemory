import { Context } from 'koa';
import RankService from '../../services/rank/rank.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 排行榜模块
 *   description: 排行榜相关接口
 */
class RankController {
  /**
   * @swagger
   * /api/v1/rank/list:
   *   get:
   *     tags:
   *       - 排行榜模块
   *     summary: 获取排行榜
   *     description: 获取全球或关卡排行榜
   *     parameters:
   *       - name: type
   *         in: query
   *         schema:
   *           type: string
   *           enum: [global, level]
   *           default: global
   *         description: 排行榜类型
   *       - name: levelId
   *         in: query
   *         schema:
   *           type: integer
   *         description: 关卡ID（type为level时必填）
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
   *           default: 50
   *         description: 每页数量
   *     responses:
   *       200:
   *         description: 成功获取排行榜
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
   *                             type: object
   *                             properties:
   *                               rank:
   *                                 type: integer
   *                               userId:
   *                                 type: integer
   *                               nickname:
   *                                 type: string
   *                               avatar:
   *                                 type: string
   *                               totalStars:
   *                                 type: integer
   *                         total:
   *                           type: integer
   *                         page:
   *                           type: integer
   *                         pageSize:
   *                           type: integer
   */
  async getRanking(ctx: Context) {
    const rankType = (ctx.query.type as string) || 'global';
    const levelId = parseInt(ctx.query.levelId as string) || 0;
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 50;

    let result;
    if (rankType === 'level' && levelId > 0) {
      result = await RankService.getLevelRanking(levelId, page, pageSize);
    } else {
      result = await RankService.getGlobalRanking(page, pageSize);
    }
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/rank/user:
   *   get:
   *     tags:
   *       - 排行榜模块
   *     summary: 获取用户排名
   *     description: 获取当前用户在各排行榜中的排名
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取用户排名
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
   *                         globalRank:
   *                           type: integer
   *                           description: 全球排名
   *                         levelRanks:
   *                           type: object
   *                           description: 各关卡排名
   *                         totalStars:
   *                           type: integer
   *                           description: 总星星数
   *                         accuracy:
   *                           type: number
   *                           description: 正确率
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getUserRank(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const result = await RankService.getUserRanking(userId);
    success(ctx, result);
  }
}

export default new RankController();
