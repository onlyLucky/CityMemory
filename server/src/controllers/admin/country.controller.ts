import { Context } from 'koa';
import AdminCountryService from '../../services/admin/country.service';
import { success } from '../../utils/response';

class AdminCountryController {
  async getCountryList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminCountryService.getCountryList({
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      countryName: query.countryName as string,
      regionId: query.regionId ? parseInt(query.regionId as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
    });
    success(ctx, result);
  }

  async getCountryDetail(ctx: Context) {
    const countryId = parseInt(ctx.params.countryId);
    const result = await AdminCountryService.getCountryDetail(countryId);
    success(ctx, result);
  }

  async createCountry(ctx: Context) {
    const data = ctx.validatedData as {
      countryName: string;
      countryNameEn?: string;
      countryCode?: string;
      flagImage?: string;
      description?: string;
      regionId: number;
      sortOrder?: number;
    };
    const result = await AdminCountryService.createCountry(data);
    success(ctx, result, '创建成功');
  }

  async updateCountry(ctx: Context) {
    const countryId = parseInt(ctx.params.countryId);
    const data = ctx.validatedData as {
      countryName?: string;
      countryNameEn?: string;
      countryCode?: string;
      flagImage?: string;
      description?: string;
      regionId?: number;
      sortOrder?: number;
      status?: number;
    };
    const result = await AdminCountryService.updateCountry(countryId, data);
    success(ctx, result, '更新成功');
  }

  async deleteCountry(ctx: Context) {
    const countryId = parseInt(ctx.params.countryId);
    await AdminCountryService.deleteCountry(countryId);
    success(ctx, null, '删除成功');
  }

  async getCountriesByRegion(ctx: Context) {
    const regionId = parseInt(ctx.params.regionId);
    const result = await AdminCountryService.getCountriesByRegion(regionId);
    success(ctx, result);
  }
}

export default new AdminCountryController();
