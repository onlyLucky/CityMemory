import { Context } from 'koa';
import AdminShopService from '../../services/admin/shop.service';
import { success } from '../../utils/response';

class AdminShopController {
  async getShopItemList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminShopService.getList(
      parseInt(query.page as string) || 1,
      parseInt(query.pageSize as string) || 10,
      query.itemType ? parseInt(query.itemType as string) : undefined,
      query.status ? parseInt(query.status as string) : undefined,
    );
    success(ctx, result);
  }

  async createShopItem(ctx: Context) {
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminShopService.create(data);
    success(ctx, result, '创建成功');
  }

  async updateShopItem(ctx: Context) {
    const itemId = parseInt(ctx.params.itemId);
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminShopService.update(itemId, data);
    success(ctx, result, '更新成功');
  }

  async deleteShopItem(ctx: Context) {
    const itemId = parseInt(ctx.params.itemId);
    await AdminShopService.delete(itemId);
    success(ctx, null, '删除成功');
  }
}

export default new AdminShopController();
