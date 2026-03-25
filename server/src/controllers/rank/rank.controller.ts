import { Context } from 'koa';
import RankService from '../../services/rank/rank.service';
import { success } from '../../utils/response';

class RankController {
  async getRanking(ctx: Context) {
    const rankType = (ctx.query.type as string) || 'total';
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 50;

    const result = await RankService.getRanking(rankType, page, pageSize);
    success(ctx, result);
  }

  async getUserRank(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const result = await RankService.getUserRank(userId);
    success(ctx, result);
  }
}

export default new RankController();
