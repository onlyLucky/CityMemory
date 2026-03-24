import { Context } from 'koa';
import { AdminLevelService } from '@/services/admin/admin-level.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class AdminLevelController {
  private adminLevelService: AdminLevelService;

  constructor() {
    this.adminLevelService = new AdminLevelService();
  }

  getLevelList = async (ctx: Context) => {
    try {
      const params = ctx.query;

      const result = await this.adminLevelService.getLevelList({
        page: parseInt(params.page as string) || 1,
        pageSize: parseInt(params.pageSize as string) || 20,
        province: params.province as string,
        status: params.status ? parseInt(params.status as string) : undefined,
      });

      success(ctx, result);
    } catch (err) {
      logger.error('获取关卡列表失败', err);
      error(ctx, err);
    }
  };

  getLevelDetail = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      const levelDetail = await this.adminLevelService.getLevelDetail(id);

      success(ctx, levelDetail);
    } catch (err) {
      logger.error('获取关卡详情失败', err);
      error(ctx, err);
    }
  };

  createLevel = async (ctx: Context) => {
    try {
      const params = ctx.request.body;

      const level = await this.adminLevelService.createLevel(params);

      success(ctx, level);
    } catch (err) {
      logger.error('创建关卡失败', err);
      error(ctx, err);
    }
  };

  updateLevel = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const params = ctx.request.body;

      const level = await this.adminLevelService.updateLevel(id, params);

      success(ctx, level);
    } catch (err) {
      logger.error('更新关卡失败', err);
      error(ctx, err);
    }
  };

  deleteLevel = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      await this.adminLevelService.deleteLevel(id);

      success(ctx, { message: '关卡删除成功' });
    } catch (err) {
      logger.error('删除关卡失败', err);
      error(ctx, err);
    }
  };

  batchDeleteLevels = async (ctx: Context) => {
    try {
      const { ids } = ctx.request.body;

      const result = await this.adminLevelService.batchDeleteLevels(ids);

      success(ctx, result);
    } catch (err) {
      logger.error('批量删除关卡失败', err);
      error(ctx, err);
    }
  };
}

export default AdminLevelController;
