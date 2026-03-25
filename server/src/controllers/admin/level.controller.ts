import { Context } from 'koa';
import AdminLevelService from '../../services/admin/level.service';
import { success } from '../../utils/response';

class AdminLevelController {
  async getLevelList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      levelName: query.levelName as string,
      levelType: query.levelType ? parseInt(query.levelType as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
    };
    const result = await AdminLevelService.getLevelList(params);
    success(ctx, result);
  }

  async getLevelDetail(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const result = await AdminLevelService.getLevelDetail(levelId);
    success(ctx, result);
  }

  async createLevel(ctx: Context) {
    const data = ctx.validatedData;
    const result = await AdminLevelService.createLevel(data);
    success(ctx, result, '创建成功');
  }

  async updateLevel(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData;
    const result = await AdminLevelService.updateLevel(levelId, data);
    success(ctx, result, '更新成功');
  }

  async deleteLevel(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    await AdminLevelService.deleteLevel(levelId);
    success(ctx, null, '删除成功');
  }

  async batchDeleteLevels(ctx: Context) {
    const data = ctx.validatedData as { levelIds: number[] };
    await AdminLevelService.batchDeleteLevels(data.levelIds);
    success(ctx, null, '批量删除成功');
  }

  async updateLevelStatus(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData as { status: number };
    await AdminLevelService.updateLevelStatus(levelId, data.status);
    success(ctx, null, '状态更新成功');
  }

  async getAnswerFailStats(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const result = await AdminLevelService.getAnswerFailStats(levelId);
    success(ctx, result);
  }
}

export default new AdminLevelController();
