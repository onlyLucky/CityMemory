import { Context } from 'koa';
import AdminDashboardService from '../../services/admin/dashboard.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 管理后台-仪表盘
 *   description: 仪表盘统计接口
 */
class AdminDashboardController {
  /**
   * @swagger
   * /api/v1/admin/dashboard:
   *   get:
   *     tags:
   *       - 管理后台-仪表盘
   *     summary: 获取仪表盘数据
   *     description: 获取仪表盘统计数据，包括用户统计、趋势、排行榜
   *     security:
   *       - AdminAuth: []
   *     responses:
   *       200:
   *         description: 成功获取仪表盘数据
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
   *                         stats:
   *                           type: object
   *                           properties:
   *                             totalUsers:
   *                               type: integer
   *                             activeUsers:
   *                               type: integer
   *                             totalGames:
   *                               type: integer
   *                             totalStars:
   *                               type: integer
   *                         trend:
   *                           type: array
   *                           items:
   *                             type: object
   *                         ranking:
   *                           type: array
   *                           items:
   *                             type: object
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getDashboardData(ctx: Context) {
    const stats = await AdminDashboardService.getStats();
    const trend = await AdminDashboardService.getTrend(7);
    const ranking = await AdminDashboardService.getRanking(10);
    success(ctx, { stats, trend, ranking });
  }

  /**
   * @swagger
   * /api/v1/admin/dashboard/user-stats:
   *   get:
   *     tags:
   *       - 管理后台-仪表盘
   *     summary: 获取用户统计趋势
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: days
   *         in: query
   *         schema:
   *           type: integer
   *           default: 7
   *         description: 统计天数
   *     responses:
   *       200:
   *         description: 成功获取用户统计趋势
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
   *                         type: object
   *                         properties:
   *                           date:
   *                             type: string
   *                           count:
   *                             type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getUserStats(ctx: Context) {
    const query = ctx.query;
    const days = query.days ? parseInt(query.days as string) : 7;
    const result = await AdminDashboardService.getTrend(days);
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/admin/dashboard/game-stats:
   *   get:
   *     tags:
   *       - 管理后台-仪表盘
   *     summary: 获取游戏统计趋势
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: days
   *         in: query
   *         schema:
   *           type: integer
   *           default: 7
   *         description: 统计天数
   *     responses:
   *       200:
   *         description: 成功获取游戏统计趋势
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
   *                         type: object
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getGameStats(ctx: Context) {
    const query = ctx.query;
    const days = query.days ? parseInt(query.days as string) : 7;
    const result = await AdminDashboardService.getTrend(days);
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/admin/dashboard/level-stats:
   *   get:
   *     tags:
   *       - 管理后台-仪表盘
   *     summary: 获取关卡统计
   *     security:
   *       - AdminAuth: []
   *     responses:
   *       200:
   *         description: 成功获取关卡统计
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
   *                         totalLevels:
   *                           type: integer
   *                         activeLevels:
   *                           type: integer
   *                         totalQuestions:
   *                           type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getLevelStats(ctx: Context) {
    const result = await AdminDashboardService.getStats();
    success(ctx, result);
  }
}

export default new AdminDashboardController();
