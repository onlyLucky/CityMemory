import { Context } from 'koa';
import AdminAuthService from '../../services/admin/auth.service';
import { success } from '../../utils/response';

class AdminAuthController {
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

  async getCaptcha(ctx: Context) {
    const captcha = await AdminAuthService.getCaptcha();
    success(ctx, captcha);
  }

  async getProfile(ctx: Context) {
    const adminId = parseInt(ctx.admin!.userId);
    const profile = await AdminAuthService.getProfile(adminId);
    success(ctx, profile);
  }

  async changePassword(ctx: Context) {
    const adminId = parseInt(ctx.admin!.userId);
    const data = ctx.validatedData as {
      oldPassword: string;
      newPassword: string;
    };
    await AdminAuthService.changePassword(adminId, data.oldPassword, data.newPassword);
    success(ctx, null, '密码修改成功');
  }

  async logout(ctx: Context) {
    const adminId = parseInt(ctx.admin!.userId);
    await AdminAuthService.logout(adminId);
    success(ctx, null, '退出成功');
  }
}

export default new AdminAuthController();
