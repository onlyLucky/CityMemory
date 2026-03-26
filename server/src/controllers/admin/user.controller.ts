import { Context } from 'koa';
import AdminUserService from '../../services/admin/user.service';
import { success } from '../../utils/response';

class AdminUserController {
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

  async getUserDetail(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const result = await AdminUserService.getDetail(userId);
    success(ctx, result);
  }

  async createUser(ctx: Context) {
    const data = ctx.validatedData;
    success(ctx, data, '创建成功');
  }

  async updateUser(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const data = ctx.validatedData as Record<string, unknown>;
    success(ctx, { userId, ...data }, '更新成功');
  }

  async deleteUser(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const adminId = parseInt(ctx.admin!.userId);
    await AdminUserService.delete(userId, adminId);
    success(ctx, null, '删除成功');
  }

  async batchDeleteUsers(ctx: Context) {
    const data = ctx.validatedData as { userIds: number[] };
    const adminId = parseInt(ctx.admin!.userId);
    for (const userId of data.userIds) {
      await AdminUserService.delete(userId, adminId);
    }
    success(ctx, null, '批量删除成功');
  }

  async updateUserStatus(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const data = ctx.validatedData as { status: number };
    const adminId = parseInt(ctx.admin!.userId);
    await AdminUserService.updateStatus(userId, data.status, adminId);
    success(ctx, null, '状态更新成功');
  }
}

export default new AdminUserController();
