import { Context } from 'koa';
import AdminCityService from '../../services/admin/city.service';
import { success } from '../../utils/response';
import { v4 as uuidv4 } from 'uuid';

class AdminCityController {
  async getCityList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      cityName: query.cityName as string,
      provinceId: query.provinceId ? parseInt(query.provinceId as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
    };
    const result = await AdminCityService.getCityList(params);
    success(ctx, result);
  }

  async getCityDetail(ctx: Context) {
    const cityId = parseInt(ctx.params.cityId);
    const result = await AdminCityService.getCityDetail(cityId);
    success(ctx, result);
  }

  async createCity(ctx: Context) {
    const data = ctx.validatedData;
    const result = await AdminCityService.createCity(data);
    success(ctx, result, '创建成功');
  }

  async updateCity(ctx: Context) {
    const cityId = parseInt(ctx.params.cityId);
    const data = ctx.validatedData;
    const result = await AdminCityService.updateCity(cityId, data);
    success(ctx, result, '更新成功');
  }

  async deleteCity(ctx: Context) {
    const cityId = parseInt(ctx.params.cityId);
    await AdminCityService.deleteCity(cityId);
    success(ctx, null, '删除成功');
  }

  async batchImportCities(ctx: Context) {
    const data = ctx.validatedData as { cities: any[] };
    const importId = uuidv4();
    const result = await AdminCityService.batchImportCities(importId, data.cities);
    success(ctx, { importId, ...result }, '导入完成');
  }

  async getImportProgress(ctx: Context) {
    const importId = ctx.params.importId;
    const result = AdminCityService.getImportProgress(importId);
    success(ctx, result);
  }

  async getCitiesByProvince(ctx: Context) {
    const provinceId = parseInt(ctx.params.provinceId);
    const result = await AdminCityService.getCitiesByProvince(provinceId);
    success(ctx, result);
  }
}

export default new AdminCityController();
