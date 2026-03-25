import { Context } from 'koa';
import AdminDashboardService from '../../services/admin/dashboard.service';
import { success } from '../../utils/response';

class AdminDashboardController {
  async getDashboardData(ctx: Context) {
    const result = await AdminDashboardService.getDashboardData();
    success(ctx, result);
  }

  async getUserStats(ctx: Context) {
    const query = ctx.query;
    const params = {
      startDate: query.startDate as string,
      endDate: query.endDate as string,
    };
    const result = await AdminDashboardService.getUserStats(params);
    success(ctx, result);
  }

  async getGameStats(ctx: Context) {
    const query = ctx.query;
    const params = {
      startDate: query.startDate as string,
      endDate: query.endDate as string,
    };
    const result = await AdminDashboardService.getGameStats(params);
    success(ctx, result);
  }

  async getLevelStats(ctx: Context) {
    const result = await AdminDashboardService.getLevelStats();
    success(ctx, result);
  }
}

export default new AdminDashboardController();
