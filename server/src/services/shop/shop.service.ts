import ShopItem from '../../models/mysql/ShopItem';
import UserItem from '../../models/mysql/UserItem';
import UserInfo from '../../models/mysql/UserInfo';
import { ERROR_CODES, AppError } from '../../constants/error';
import { ITEM_STATUS } from '../../constants/status';
import { redisUtils } from '../../config/redis';
import { BuyItemResult } from '../../types/shop';

export class ShopService {
  async getItems() {
    const items = await ShopItem.findAll({
      where: { status: ITEM_STATUS.ON_SHELF },
      order: [['sortOrder', 'ASC']],
    });

    return items.map((item) => ({
      id: item.id,
      itemType: item.itemType,
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      effect: item.effect,
      stock: item.stock,
      dailyLimit: item.dailyLimit,
    }));
  }

  async getItemDetail(itemId: number) {
    const item = await ShopItem.findByPk(itemId);
    if (!item) {
      throw new AppError(ERROR_CODES.ITEM_NOT_FOUND, '商品不存在');
    }

    return {
      id: item.id,
      itemType: item.itemType,
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      effect: item.effect,
      stock: item.stock,
      dailyLimit: item.dailyLimit,
    };
  }

  async buyItem(userId: number, itemId: number, quantity: number = 1): Promise<BuyItemResult> {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const item = await ShopItem.findByPk(itemId);
    if (!item) {
      throw new AppError(ERROR_CODES.ITEM_NOT_FOUND, '商品不存在');
    }

    if (item.status !== ITEM_STATUS.ON_SHELF) {
      throw new AppError(ERROR_CODES.ITEM_SOLD_OUT, '商品已下架');
    }

    if (item.stock !== -1 && item.stock <= 0) {
      throw new AppError(ERROR_CODES.ITEM_SOLD_OUT, '商品已售罄');
    }

    const totalPrice = item.price * quantity;
    if (user.starCount < totalPrice) {
      throw new AppError(ERROR_CODES.INSUFFICIENT_STARS, '星星不足');
    }

    if (item.dailyLimit !== -1) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailyKey = `shop:daily:${userId}:${itemId}:${today.toISOString().split('T')[0]}`;
      const dailyCount = (await redisUtils.get<number>(dailyKey)) || 0;

      if (dailyCount + quantity > item.dailyLimit) {
        throw new AppError(ERROR_CODES.DAILY_LIMIT_EXCEEDED, '超过每日购买限制');
      }

      await redisUtils.set(dailyKey, dailyCount + quantity, 86400);
    }

    await user.update({ starCount: user.starCount - totalPrice });

    if (item.stock !== -1) {
      await item.update({ stock: item.stock - quantity });
    }

    let userItem = await UserItem.findOne({ where: { userId, itemId } });
    if (userItem) {
      await userItem.update({ quantity: userItem.quantity + quantity });
    } else {
      userItem = await UserItem.create({ userId, itemId, quantity });
    }

    const effectParts = item.effect.split(':');
    if (effectParts[0] === 'ticket') {
      const ticketCount = parseInt(effectParts[1]) || 0;
      await user.update({ ticketCount: user.ticketCount + ticketCount * quantity });
    }

    return {
      itemId: item.id,
      itemName: item.itemName,
      price: item.price,
      quantity,
      remainingStars: user.starCount - totalPrice,
    };
  }
}

export default new ShopService();
