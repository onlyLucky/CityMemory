import { Context } from 'koa';
import { AdminService } from '@/services/admin/admin.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  login = async (ctx: Context) => {
    try {
      const { username, password } = ctx.request.body;

      const result = await this.adminService.login(username, password);

      success(ctx, result);
    } catch (err) {
      logger.error('管理员登录失败', err);
      error(ctx, err);
    }
  };

  getAdminInfo = async (ctx: Context) => {
    try {
      const adminId = ctx.state.admin.id;

      const adminInfo = await this.adminService.getAdminInfo(adminId);

      success(ctx, adminInfo);
    } catch (err) {
      logger.error('获取管理员信息失败', err);
      error(ctx, err);
    }
  };
}

export default AdminController;
