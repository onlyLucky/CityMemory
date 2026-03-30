import { Context } from 'koa';
import UserService from '../../services/user/user.service';
import { success, error } from '../../utils/response';
import { ErrorCode } from '../../types/enums';

/**
 * @swagger
 * tags:
 *   name: 用户模块
 *   description: 用户相关接口
 */
class UserController {
  /**
   * @swagger
   * /api/v1/user/login:
   *   post:
   *     tags:
   *       - 用户模块
   *     summary: 用户登录
   *     description: 通过微信登录凭证进行用户登录，首次登录会自动注册
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *             properties:
   *               code:
   *                 type: string
   *                 description: 微信登录凭证
   *                 example: '081xxx'
   *               nickname:
   *                 type: string
   *                 description: 用户昵称
   *                 example: '旅行者'
   *               avatar:
   *                 type: string
   *                 description: 用户头像URL
   *                 example: 'https://example.com/avatar.png'
   *               gender:
   *                 type: integer
   *                 enum: [0, 1, 2]
   *                 description: 性别：0-未知，1-男，2-女
   *                 example: 1
   *               province:
   *                 type: string
   *                 description: 省份
   *                 example: '北京'
   *               city:
   *                 type: string
   *                 description: 城市
   *                 example: '北京'
   *               country:
   *                 type: string
   *                 description: 国家
   *                 example: '中国'
   *     responses:
   *       200:
   *         description: 登录成功
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
   *                         token:
   *                           type: string
   *                           description: JWT令牌
   *                         user:
   *                           $ref: '#/components/schemas/User'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   */
  async login(ctx: Context) {
    const data = ctx.validatedData as {
      code: string;
      nickname?: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
    };

    const result = await UserService.login(
      {
        code: data.code,
        nickname: data.nickname,
        avatar: data.avatar,
        gender: data.gender,
        province: data.province,
        city: data.city,
        country: data.country,
      },
      ctx.ip,
    );

    success(ctx, result, '登录成功');
  }

  /**
   * @swagger
   * /api/v1/user/profile:
   *   get:
   *     tags:
   *       - 用户模块
   *     summary: 获取用户信息
   *     description: 获取当前登录用户的详细信息
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取用户信息
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
  async getProfile(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const profile = await UserService.getProfile(userId);
    success(ctx, profile);
  }

  /**
   * @swagger
   * /api/v1/user/profile:
   *   put:
   *     tags:
   *       - 用户模块
   *     summary: 更新用户信息
   *     description: 更新当前登录用户的个人信息
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nickname:
   *                 type: string
   *                 description: 用户昵称
   *                 example: '旅行者'
   *               avatar:
   *                 type: string
   *                 description: 用户头像URL
   *                 example: 'https://example.com/avatar.png'
   *               gender:
   *                 type: integer
   *                 enum: [0, 1, 2]
   *                 description: 性别：0-未知，1-男，2-女
   *                 example: 1
   *               province:
   *                 type: string
   *                 description: 省份
   *                 example: '北京'
   *               city:
   *                 type: string
   *                 description: 城市
   *                 example: '北京'
   *               country:
   *                 type: string
   *                 description: 国家
   *                 example: '中国'
   *     responses:
   *       200:
   *         description: 更新成功
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
  async updateProfile(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      nickname?: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
    };

    const profile = await UserService.updateProfile(userId, data);
    success(ctx, profile, '更新成功');
  }

  /**
   * @swagger
   * /api/v1/user/init-province:
   *   post:
   *     tags:
   *       - 用户模块
   *     summary: 初始化省份
   *     description: 为新用户初始化起始省份
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - province
   *             properties:
   *               province:
   *                 type: string
   *                 description: 省份名称
   *                 example: '北京'
   *     responses:
   *       200:
   *         description: 初始化成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async initProvince(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as { province: string };

    const result = await UserService.initProvince(userId, data.province);
    success(ctx, result, '初始化成功');
  }

  /**
   * @swagger
   * /api/v1/user/tickets:
   *   get:
   *     tags:
   *       - 用户模块
   *     summary: 获取门票信息
   *     description: 获取当前用户的门票数量和恢复时间
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取门票信息
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
   *                         ticketCount:
   *                           type: integer
   *                           description: 当前门票数量
   *                           example: 5
   *                         maxTickets:
   *                           type: integer
   *                           description: 最大门票数量
   *                           example: 10
   *                         nextRecoverTime:
   *                           type: integer
   *                           description: 下次恢复时间（时间戳）
   *                           example: 1703145600000
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getTickets(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const tickets = await UserService.getTickets(userId);
    success(ctx, tickets);
  }

  /**
   * @swagger
   * /api/v1/user/tickets/recover:
   *   post:
   *     tags:
   *       - 用户模块
   *     summary: 恢复门票
   *     description: 手动恢复一张门票
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 恢复成功
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
   *                         ticketCount:
   *                           type: integer
   *                           description: 当前门票数量
   *                           example: 6
   *                         recovered:
   *                           type: boolean
   *                           description: 是否成功恢复
   *                           example: true
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async recoverTicket(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const result = await UserService.recoverTicket(userId);
    success(ctx, result);
  }

  /**
   * @swagger
   * /api/v1/user/items:
   *   get:
   *     tags:
   *       - 用户模块
   *     summary: 获取用户道具
   *     description: 获取当前用户拥有的所有道具
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取道具列表
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
   *                         $ref: '#/components/schemas/ShopItem'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getUserItems(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const items = await UserService.getUserItems(userId);
    success(ctx, items);
  }

  /**
   * @swagger
   * /api/v1/user/progress:
   *   get:
   *     tags:
   *       - 用户模块
   *     summary: 获取用户进度
   *     description: 获取当前用户的游戏进度统计
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取进度信息
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
   *                         levelProgress:
   *                           type: object
   *                           description: 各关卡进度
   *                         totalStars:
   *                           type: integer
   *                           description: 总星星数
   *                           example: 100
   *                         totalCorrect:
   *                           type: integer
   *                           description: 总正确数
   *                           example: 500
   *                         totalWrong:
   *                           type: integer
   *                           description: 总错误数
   *                           example: 100
   *                         accuracy:
   *                           type: number
   *                           description: 正确率
   *                           example: 0.83
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getProgress(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const progress = await UserService.getProgress(userId);
    success(ctx, progress);
  }
}

export default new UserController();
