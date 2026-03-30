import { Context } from 'koa';
import AdminLevelService from '../../services/admin/level.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 管理后台-关卡管理
 *   description: 关卡管理接口
 */
class AdminLevelController {
  /**
   * @swagger
   * /api/v1/admin/levels:
   *   get:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 获取关卡列表
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: page
   *         in: query
   *         schema:
   *           type: integer
   *           default: 1
   *       - name: pageSize
   *         in: query
   *         schema:
   *           type: integer
   *           default: 10
   *       - name: regionId
   *         in: query
   *         schema:
   *           type: integer
   *       - name: difficulty
   *         in: query
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功获取关卡列表
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
   *                             $ref: '#/components/schemas/Level'
   *                         total:
   *                           type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getLevelList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminLevelService.getList(
      parseInt(query.page as string) || 1,
      parseInt(query.pageSize as string) || 10,
      query.regionId ? parseInt(query.regionId as string) : undefined,
      query.difficulty ? parseInt(query.difficulty as string) : undefined,
    );
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/admin/levels/{levelId}:
   *   get:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 获取关卡详情
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功获取关卡详情
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Level'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getLevelDetail(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const result = await AdminLevelService.getDetail(levelId);
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/admin/levels:
   *   post:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 创建关卡
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Level'
   *     responses:
   *       200:
   *         description: 创建成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async createLevel(ctx: Context) {
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminLevelService.create(data);
    success(ctx, result, '创建成功');
  }

  /**
   * @swagger
   * /api/v1/admin/levels/{levelId}:
   *   put:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 更新关卡
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Level'
   *     responses:
   *       200:
   *         description: 更新成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async updateLevel(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminLevelService.update(levelId, data);
    success(ctx, result, '更新成功');
  }

  /**
   * @swagger
   * /api/v1/admin/levels/{levelId}:
   *   delete:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 删除关卡
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 删除成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async deleteLevel(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    await AdminLevelService.delete(levelId);
    success(ctx, null, '删除成功');
  }

  /**
   * @swagger
   * /api/v1/admin/levels/batch-delete:
   *   post:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 批量删除关卡
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - levelIds
   *             properties:
   *               levelIds:
   *                 type: array
   *                 items:
   *                   type: integer
   *     responses:
   *       200:
   *         description: 批量删除成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async batchDeleteLevels(ctx: Context) {
    const data = ctx.validatedData as { levelIds: number[] };
    for (const levelId of data.levelIds) {
      await AdminLevelService.delete(levelId);
    }
    success(ctx, null, '批量删除成功');
  }

  /**
   * @swagger
   * /api/v1/admin/levels/{levelId}/status:
   *   put:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 更新关卡状态
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: integer
   *     responses:
   *       200:
   *         description: 状态更新成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async updateLevelStatus(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData as { status: number };
    await AdminLevelService.update(levelId, { status: data.status });
    success(ctx, null, '状态更新成功');
  }

  /**
   * @swagger
   * /api/v1/admin/levels/{levelId}/answer-fail-stats:
   *   get:
   *     tags:
   *       - 管理后台-关卡管理
   *     summary: 获取关卡答题错误统计
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功获取统计
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getAnswerFailStats(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const result = await AdminLevelService.getDetail(levelId);
    success(ctx, result);
  }
}

export default new AdminLevelController();
