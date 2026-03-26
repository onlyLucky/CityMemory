import { Context } from 'koa';
import AdminProvinceService from '../../services/admin/province.service';
import { success } from '../../utils/response';

class AdminProvinceController {
  async getProvinceList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminProvinceService.getProvinceList({
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      provinceName: query.provinceName as string,
      countryId: query.countryId ? parseInt(query.countryId as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
    });
    success(ctx, result);
  }

  async getProvinceDetail(ctx: Context) {
    const provinceId = parseInt(ctx.params.provinceId);
    const result = await AdminProvinceService.getProvinceDetail(provinceId);
    success(ctx, result);
  }

  async createProvince(ctx: Context) {
    const data = ctx.validatedData as {
      provinceName: string;
      provinceNameEn?: string;
      description?: string;
      countryId: number;
      sortOrder?: number;
    };
    const result = await AdminProvinceService.createProvince(data);
    success(ctx, result, '创建成功');
  }

  async updateProvince(ctx: Context) {
    const provinceId = parseInt(ctx.params.provinceId);
    const data = ctx.validatedData as {
      provinceName?: string;
      provinceNameEn?: string;
      description?: string;
      countryId?: number;
      sortOrder?: number;
      status?: number;
    };
    const result = await AdminProvinceService.updateProvince(provinceId, data);
    success(ctx, result, '更新成功');
  }

  async deleteProvince(ctx: Context) {
    const provinceId = parseInt(ctx.params.provinceId);
    await AdminProvinceService.deleteProvince(provinceId);
    success(ctx, null, '删除成功');
  }

  async getProvincesByCountry(ctx: Context) {
    const countryId = parseInt(ctx.params.countryId);
    const result = await AdminProvinceService.getProvincesByCountry(countryId);
    success(ctx, result);
  }
}

export default new AdminProvinceController();
