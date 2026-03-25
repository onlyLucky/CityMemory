import { Context } from 'koa';
import AdminUserService from '../../services/admin/user.service';
import { success } from '../../utils/response';

class AdminUserController {
  async getUserList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      nickname: query.nickname as string,
      status: query.status ? parseInt(query.status as string) : undefined,
      startDate: query.startDate as string,
      endDate: query.endDate as string,
    };
    const result = await AdminUserService.getUserList(params);
    success(ctx, result);
  }

  async getUserDetail(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const result = await AdminUserService.getUserDetail(userId);
    success(ctx, result);
  }

  async createUser(ctx: Context) {
    const data = ctx.validatedData;
    const result = await AdminUserService.createUser(data);
    success(ctx, result, '创建成功');
  }

  async updateUser(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const data = ctx.validatedData;
    const result = await AdminUserService.updateUser(userId, data);
    success(ctx, result, '更新成功');
  }

  async deleteUser(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    await AdminUserService.deleteUser(userId);
    success(ctx, null, '删除成功');
  }

  async batchDeleteUsers(ctx: Context) {
    const data = ctx.validatedData as { userIds: number[] };
    await AdminUserService.batchDeleteUsers(data.userIds);
    success(ctx, null, '批量删除成功');
  }

  async updateUserStatus(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const data = ctx.validatedData as { status: number };
    await AdminUserService.updateUserStatus(userId, data.status);
    success(ctx, null, '状态更新成功');
  }
}

export default new AdminUserController();
