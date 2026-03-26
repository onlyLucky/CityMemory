import { Context } from 'koa';
import RankService from '../../services/rank/rank.service';
import { success } from '../../utils/response';

class RankController {
  async getRanking(ctx: Context) {
    const rankType = (ctx.query.type as string) || 'global';
    const levelId = parseInt(ctx.query.levelId as string) || 0;
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 50;

    let result;
    if (rankType === 'level' && levelId > 0) {
      result = await RankService.getLevelRanking(levelId, page, pageSize);
    } else {
      result = await RankService.getGlobalRanking(page, pageSize);
    }
    success(ctx, result);
  }

  async getUserRank(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const result = await RankService.getUserRanking(userId);
    success(ctx, result);
  }
}

export default new RankController();
