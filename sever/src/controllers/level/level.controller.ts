import { Context } from 'koa';
import { LevelService } from '@/services/level/level.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class LevelController {
  private levelService: LevelService;

  constructor() {
    this.levelService = new LevelService();
  }

  getLevelList = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { province } = ctx.query;

      const levels = await this.levelService.getLevelList(userId, province as string);

      success(ctx, levels);
    } catch (err) {
      logger.error('获取关卡列表失败', err);
      error(ctx, err);
    }
  };

  getLevelDetail = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;

      const level = await this.levelService.getLevelDetail(userId, id);

      success(ctx, level);
    } catch (err) {
      logger.error('获取关卡详情失败', err);
      error(ctx, err);
    }
  };

  startLevel = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;

      const result = await this.levelService.startLevel(userId, id);

      success(ctx, result);
    } catch (err) {
      logger.error('开始关卡失败', err);
      error(ctx, err);
    }
  };

  submitAnswer = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;
      const { questionId, answer } = ctx.request.body;

      const result = await this.levelService.submitAnswer(userId, id, questionId, answer);

      success(ctx, result);
    } catch (err) {
      logger.error('提交答案失败', err);
      error(ctx, err);
    }
  };

  completeLevel = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;
      const params = ctx.request.body;

      const result = await this.levelService.completeLevel(userId, id, params);

      success(ctx, result);
    } catch (err) {
      logger.error('完成关卡失败', err);
      error(ctx, err);
    }
  };
}

export default LevelController;
