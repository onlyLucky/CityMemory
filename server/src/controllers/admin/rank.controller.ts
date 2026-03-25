import { Context } from 'koa';
import AdminRankService from '../../services/admin/rank.service';
import { success } from '../../utils/response';

class AdminRankController {
  async getRankingList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 50,
      rankType: (query.type as string) || 'total',
      regionId: query.regionId ? parseInt(query.regionId as string) : undefined,
      startDate: query.startDate as string,
      endDate: query.endDate as string,
    };
    const result = await AdminRankService.getRankingList(params);
    success(ctx, result);
  }

  async getUserRankDetail(ctx: Context) {
    const userId = parseInt(ctx.params.userId);
    const result = await AdminRankService.getUserRankDetail(userId);
    success(ctx, result);
  }

  async exportRankingData(ctx: Context) {
    const rankType = (ctx.query.type as string) || 'total';
    const result = await AdminRankService.exportRankingData(rankType);
    success(ctx, result);
  }
}

export default new AdminRankController();
