import { Context } from 'koa';
import AdminRegionService from '../../services/admin/region.service';
import { success } from '../../utils/response';

class AdminRegionController {
  async getRegionList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      regionName: query.regionName as string,
      regionType: query.regionType ? parseInt(query.regionType as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
    };
    const result = await AdminRegionService.getRegionList(params);
    success(ctx, result);
  }

  async getRegionDetail(ctx: Context) {
    const regionId = parseInt(ctx.params.regionId);
    const result = await AdminRegionService.getRegionDetail(regionId);
    success(ctx, result);
  }

  async createRegion(ctx: Context) {
    const data = ctx.validatedData;
    const result = await AdminRegionService.createRegion(data);
    success(ctx, result, '创建成功');
  }

  async updateRegion(ctx: Context) {
    const regionId = parseInt(ctx.params.regionId);
    const data = ctx.validatedData;
    const result = await AdminRegionService.updateRegion(regionId, data);
    success(ctx, result, '更新成功');
  }

  async deleteRegion(ctx: Context) {
    const regionId = parseInt(ctx.params.regionId);
    await AdminRegionService.deleteRegion(regionId);
    success(ctx, null, '删除成功');
  }

  async getAllRegions(ctx: Context) {
    const regionType = ctx.query.regionType ? parseInt(ctx.query.regionType as string) : undefined;
    const result = await AdminRegionService.getAllRegions(regionType);
    success(ctx, result);
  }
}

export default new AdminRegionController();
