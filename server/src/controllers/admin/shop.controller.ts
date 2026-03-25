import { Context } from 'koa';
import AdminShopService from '../../services/admin/shop.service';
import { success } from '../../utils/response';

class AdminShopController {
  async getShopItemList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      itemType: query.itemType ? parseInt(query.itemType as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
    };
    const result = await AdminShopService.getShopItemList(params);
    success(ctx, result);
  }

  async createShopItem(ctx: Context) {
    const data = ctx.validatedData;
    const result = await AdminShopService.createShopItem(data);
    success(ctx, result, '创建成功');
  }

  async updateShopItem(ctx: Context) {
    const itemId = parseInt(ctx.params.itemId);
    const data = ctx.validatedData;
    const result = await AdminShopService.updateShopItem(itemId, data);
    success(ctx, result, '更新成功');
  }

  async deleteShopItem(ctx: Context) {
    const itemId = parseInt(ctx.params.itemId);
    await AdminShopService.deleteShopItem(itemId);
    success(ctx, null, '删除成功');
  }
}

export default new AdminShopController();
