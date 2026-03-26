import { Context } from 'koa';
import AdminDashboardService from '../../services/admin/dashboard.service';
import { success } from '../../utils/response';

class AdminDashboardController {
  async getDashboardData(ctx: Context) {
    const stats = await AdminDashboardService.getStats();
    const trend = await AdminDashboardService.getTrend(7);
    const ranking = await AdminDashboardService.getRanking(10);
    success(ctx, { stats, trend, ranking });
  }

  async getUserStats(ctx: Context) {
    const query = ctx.query;
    const days = query.days ? parseInt(query.days as string) : 7;
    const result = await AdminDashboardService.getTrend(days);
    success(ctx, result);
  }

  async getGameStats(ctx: Context) {
    const query = ctx.query;
    const days = query.days ? parseInt(query.days as string) : 7;
    const result = await AdminDashboardService.getTrend(days);
    success(ctx, result);
  }

  async getLevelStats(ctx: Context) {
    const result = await AdminDashboardService.getStats();
    success(ctx, result);
  }
}

export default new AdminDashboardController();
