import { Context } from 'koa';
import { AdminUserService } from '@/services/admin/admin-user.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class AdminUserController {
  private adminUserService: AdminUserService;

  constructor() {
    this.adminUserService = new AdminUserService();
  }

  getUserList = async (ctx: Context) => {
    try {
      const params = ctx.query;

      const result = await this.adminUserService.getUserList({
        page: parseInt(params.page as string) || 1,
        pageSize: parseInt(params.pageSize as string) || 20,
        nickname: params.nickname as string,
        province: params.province as string,
      });

      success(ctx, result);
    } catch (err) {
      logger.error('获取用户列表失败', err);
      error(ctx, err);
    }
  };

  getUserDetail = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      const userDetail = await this.adminUserService.getUserDetail(id);

      success(ctx, userDetail);
    } catch (err) {
      logger.error('获取用户详情失败', err);
      error(ctx, err);
    }
  };

  createUser = async (ctx: Context) => {
    try {
      const params = ctx.request.body;

      const user = await this.adminUserService.createUser(params);

      success(ctx, user);
    } catch (err) {
      logger.error('创建用户失败', err);
      error(ctx, err);
    }
  };

  updateUser = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const params = ctx.request.body;

      const user = await this.adminUserService.updateUser(id, params);

      success(ctx, user);
    } catch (err) {
      logger.error('更新用户失败', err);
      error(ctx, err);
    }
  };

  deleteUser = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      await this.adminUserService.deleteUser(id);

      success(ctx, { message: '用户删除成功' });
    } catch (err) {
      logger.error('删除用户失败', err);
      error(ctx, err);
    }
  };

  batchDeleteUsers = async (ctx: Context) => {
    try {
      const { ids } = ctx.request.body;

      const result = await this.adminUserService.batchDeleteUsers(ids);

      success(ctx, result);
    } catch (err) {
      logger.error('批量删除用户失败', err);
      error(ctx, err);
    }
  };
}

export default AdminUserController;
