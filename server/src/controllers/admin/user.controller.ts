import { Context } from 'koa';
import AdminUserService from '../../services/admin/user.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 管理后台-用户管理
 *   description: 用户管理接口
 */
class AdminUserController {
  /**
   * @swagger
   * /api/v1/admin/users:
   *   get:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 获取用户列表
   *     description: 分页获取用户列表
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
   *       - name: keyword
   *         in: query
   *         schema:
   *           type: string
   *         description: 搜索关键词
   *       - name: status
   *         in: query
   *         schema:
   *           type: integer
   *         description: 用户状态
   *       - name: startDate
   *         in: query
   *         schema:
   *           type: string
   *         description: 开始日期
   *       - name: endDate
   *         in: query
   *         schema:
   *           type: string
   *         description: 结束日期
   *     responses:
   *       200:
   *         description: 成功获取用户列表
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
   *                             $ref: '#/components/schemas/User'
   *                         total:
   *                           type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getUserList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminUserService.getList(
      parseInt(query.page as string) || 1,
      parseInt(query.pageSize as string) || 10,
      query.keyword as string,
      query.status ? parseInt(query.status as string) : undefined,
      query.startDate as string,
      query.endDate as string,
    );
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/admin/users/{userId}:
   *   get:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 获取用户详情
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功获取用户详情
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  async getUserDetail(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const result = await AdminUserService.getDetail(userId);
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/admin/users:
   *   post:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 创建用户
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nickname
   *             properties:
   *               nickname:
   *                 type: string
   *               avatar:
   *                 type: string
   *               gender:
   *                 type: integer
   *               province:
   *                 type: string
   *               city:
   *                 type: string
   *               country:
   *                 type: string
   *     responses:
   *       200:
   *         description: 创建成功
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async createUser(ctx: Context) {
    const data = ctx.validatedData as {
      nickname: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
    };
    const result = await AdminUserService.create(data);
    success(ctx, result, '创建成功');
  }

  /**
   * @swagger
   * /api/v1/admin/users/{userId}:
   *   put:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 更新用户
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: userId
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
   *             properties:
   *               nickname:
   *                 type: string
   *               avatar:
   *                 type: string
   *               gender:
   *                 type: integer
   *               province:
   *                 type: string
   *               city:
   *                 type: string
   *               country:
   *                 type: string
   *               status:
   *                 type: integer
   *     responses:
   *       200:
   *         description: 更新成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async updateUser(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const data = ctx.validatedData as {
      nickname?: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
      status?: number;
    };
    const result = await AdminUserService.update(userId, data);
    success(ctx, result, '更新成功');
  }

  /**
   * @swagger
   * /api/v1/admin/users/{userId}:
   *   delete:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 删除用户
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: userId
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
  async deleteUser(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const adminId = parseInt(ctx.admin!.userId);
    await AdminUserService.delete(userId, adminId);
    success(ctx, null, '删除成功');
  }

  /**
   * @swagger
   * /api/v1/admin/users/batch-delete:
   *   post:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 批量删除用户
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userIds
   *             properties:
   *               userIds:
   *                 type: array
   *                 items:
   *                   type: integer
   *     responses:
   *       200:
   *         description: 批量删除成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async batchDeleteUsers(ctx: Context) {
    const data = ctx.validatedData as { userIds: number[] };
    const adminId = parseInt(ctx.admin!.userId);
    for (const userId of data.userIds) {
      await AdminUserService.delete(userId, adminId);
    }
    success(ctx, null, '批量删除成功');
  }

  /**
   * @swagger
   * /api/v1/admin/users/{userId}/status:
   *   put:
   *     tags:
   *       - 管理后台-用户管理
   *     summary: 更新用户状态
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - name: userId
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
   *                 enum: [0, 1, 2]
   *                 description: '状态：0-正常，1-封禁，2-删除'
   *     responses:
   *       200:
   *         description: 状态更新成功
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async updateUserStatus(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const data = ctx.validatedData as { status: number };
    const adminId = parseInt(ctx.admin!.userId);
    await AdminUserService.updateStatus(userId, data.status, adminId);
    success(ctx, null, '状态更新成功');
  }
}

export default new AdminUserController();
