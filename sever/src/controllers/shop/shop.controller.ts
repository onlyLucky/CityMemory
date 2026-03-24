import { Context } from 'koa';
import { ShopService } from '@/services/shop/shop.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class ShopController {
  private shopService: ShopService;

  constructor() {
    this.shopService = new ShopService();
  }

  getShopList = async (ctx: Context) => {
    try {
      const items = await this.shopService.getShopList();

      success(ctx, items);
    } catch (err) {
      logger.error('获取商品列表失败', err);
      error(ctx, err);
    }
  };

  buyItem = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;

      const result = await this.shopService.buyItem(userId, id);

      success(ctx, result);
    } catch (err) {
      logger.error('购买商品失败', err);
      error(ctx, err);
    }
  };
}

export default ShopController;
