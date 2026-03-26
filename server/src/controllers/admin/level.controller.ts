import { Context } from 'koa';
import AdminLevelService from '../../services/admin/level.service';
import { success } from '../../utils/response';

class AdminLevelController {
  async getLevelList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminLevelService.getList(
      parseInt(query.page as string) || 1,
      parseInt(query.pageSize as string) || 10,
      query.regionId ? parseInt(query.regionId as string) : undefined,
      query.difficulty ? parseInt(query.difficulty as string) : undefined,
    );
    success(ctx, result);
  }

  async getLevelDetail(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const result = await AdminLevelService.getDetail(levelId);
    success(ctx, result);
  }

  async createLevel(ctx: Context) {
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminLevelService.create(data);
    success(ctx, result, '创建成功');
  }

  async updateLevel(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminLevelService.update(levelId, data);
    success(ctx, result, '更新成功');
  }

  async deleteLevel(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    await AdminLevelService.delete(levelId);
    success(ctx, null, '删除成功');
  }

  async batchDeleteLevels(ctx: Context) {
    const data = ctx.validatedData as { levelIds: number[] };
    for (const levelId of data.levelIds) {
      await AdminLevelService.delete(levelId);
    }
    success(ctx, null, '批量删除成功');
  }

  async updateLevelStatus(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData as { status: number };
    await AdminLevelService.update(levelId, { status: data.status });
    success(ctx, null, '状态更新成功');
  }

  async getAnswerFailStats(ctx: Context) {
    const levelId = parseInt(ctx.params.levelId);
    const result = await AdminLevelService.getDetail(levelId);
    success(ctx, result);
  }
}

export default new AdminLevelController();
