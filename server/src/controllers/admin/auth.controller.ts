import { Context } from 'koa';
import AdminAuthService from '../../services/admin/auth.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 管理后台-认证
 *   description: 管理员认证接口
 */
class AdminAuthController {
  /**
   * @swagger
   * /api/v1/admin/auth/login:
   *   post:
   *     tags:
   *       - 管理后台-认证
   *     summary: 管理员登录
   *     description: 管理员使用用户名密码登录
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *               - captchaId
   *               - captchaCode
   *             properties:
   *               username:
   *                 type: string
   *                 description: 用户名
   *                 example: admin
   *               password:
   *                 type: string
   *                 description: 密码
   *                 example: '123456'
   *               captchaId:
   *                 type: string
   *                 description: 验证码ID
   *               captchaCode:
   *                 type: string
   *                 description: 验证码
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
   *                         admin:
   *                           $ref: '#/components/schemas/AdminUser'
   *       400:
   *         description: 验证码错误或账号密码错误
   */
  async login(ctx: Context) {
    const data = ctx.validatedData as {
      username: string;
      password: string;
      captchaId: string;
      captchaCode: string;
    };
    const result = await AdminAuthService.login(
      data.username,
      data.password,
      data.captchaId,
      data.captchaCode,
      ctx.ip,
    );
    success(ctx, result, '登录成功');
  }

  /**
   * @swagger
   * /api/v1/admin/auth/captcha:
   *   get:
   *     tags:
   *       - 管理后台-认证
   *     summary: 获取验证码
   *     description: 获取登录验证码图片
   *     responses:
   *       200:
   *         description: 成功获取验证码
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
   *                         captchaId:
   *                           type: string
   *                           description: 验证码ID
   *                         captchaImage:
   *                           type: string
   *                           description: Base64验证码图片
   */
  async getCaptcha(ctx: Context) {
    const captcha = await AdminAuthService.getCaptcha();
    success(ctx, captcha);
  }

  /**
   * @swagger
   * /api/v1/admin/auth/profile:
   *   get:
   *     tags:
   *       - 管理后台-认证
   *     summary: 获取管理员信息
   *     description: 获取当前登录管理员的详细信息
   *     security:
   *       - AdminAuth: []
   *     responses:
   *       200:
   *         description: 成功获取管理员信息
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/AdminUser'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getProfile(ctx: Context) {
    const adminId = parseInt(ctx.admin!.userId);
    const profile = await AdminAuthService.getProfile(adminId);
    success(ctx, profile);
  }

  /**
   * @swagger
   * /api/v1/admin/auth/password:
   *   put:
   *     tags:
   *       - 管理后台-认证
   *     summary: 修改密码
   *     description: 修改当前管理员密码
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - oldPassword
   *               - newPassword
   *             properties:
   *               oldPassword:
   *                 type: string
   *                 description: 原密码
   *               newPassword:
   *                 type: string
   *                 description: 新密码
   *     responses:
   *       200:
   *         description: 密码修改成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       400:
   *         description: 原密码错误
   */
  async changePassword(ctx: Context) {
    const adminId = parseInt(ctx.admin!.userId);
    const data = ctx.validatedData as {
      oldPassword: string;
      newPassword: string;
    };
    await AdminAuthService.changePassword(adminId, data.oldPassword, data.newPassword);
    success(ctx, null, '密码修改成功');
  }

  /**
   * @swagger
   * /api/v1/admin/auth/logout:
   *   post:
   *     tags:
   *       - 管理后台-认证
   *     summary: 退出登录
   *     description: 管理员退出登录
   *     security:
   *       - AdminAuth: []
   *     responses:
   *       200:
   *         description: 退出成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async logout(ctx: Context) {
    const adminId = parseInt(ctx.admin!.userId);
    await AdminAuthService.logout(adminId);
    success(ctx, null, '退出成功');
  }
}

export default new AdminAuthController();
