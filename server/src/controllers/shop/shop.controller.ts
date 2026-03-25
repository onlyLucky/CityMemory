import { Context } from 'koa';
import ShopService from '../../services/shop/shop.service';
import { success } from '../../utils/response';

class ShopController {
  async getShopItems(ctx: Context) {
    const items = await ShopService.getShopItems();
    success(ctx, items);
  }

  async purchaseItem(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      itemId: number;
      quantity: number;
    };
    const result = await ShopService.purchaseItem(userId, data.itemId, data.quantity);
    success(ctx, result, '购买成功');
  }

  async exchangeStars(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      stars: number;
    };
    const result = await ShopService.exchangeStars(userId, data.stars);
    success(ctx, result, '兑换成功');
  }
}

export default new ShopController();
