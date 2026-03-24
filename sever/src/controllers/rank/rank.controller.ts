import { Context } from 'koa';
import { RankService } from '@/services/rank/rank.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class RankController {
  private rankService: RankService;

  constructor() {
    this.rankService = new RankService();
  }

  getRankList = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { type, province, page, pageSize } = ctx.query;

      const result = await this.rankService.getRankList(
        userId,
        type as string,
        province as string,
        page ? parseInt(page as string) : 1,
        pageSize ? parseInt(pageSize as string) : 20
      );

      success(ctx, result);
    } catch (err) {
      logger.error('获取排行榜失败', err);
      error(ctx, err);
    }
  };
}

export default RankController;
