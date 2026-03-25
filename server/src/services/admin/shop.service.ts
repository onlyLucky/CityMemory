import ShopItem from '../../models/mysql/ShopItem';
import { ERROR_CODES, AppError } from '../../constants/error';
import { ITEM_STATUS } from '../../constants/status';
import { Op } from 'sequelize';

export class AdminShopService {
  async getList(
    page: number = 1,
    pageSize: number = 20,
    itemType?: number,
    status?: number,
  ) {
    const where: any = {};

    if (itemType) {
      where.itemType = itemType;
    }

    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await ShopItem.findAndCountAll({
      where,
      order: [['sortOrder', 'ASC'], ['createTime', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const list = rows.map((item) => ({
      id: item.id,
      itemType: item.itemType,
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      stock: item.stock,
      dailyLimit: item.dailyLimit,
      status: item.status,
      createTime: item.createTime,
    }));

    return { list, total: count };
  }

  async create(data: Partial<ShopItem>) {
    const item = await ShopItem.create(data);
    return item;
  }

  async update(itemId: number, data: Partial<ShopItem>) {
    const item = await ShopItem.findByPk(itemId);
    if (!item) {
      throw new AppError(ERROR_CODES.ITEM_NOT_FOUND, '商品不存在');
    }

    await item.update(data);
    return item;
  }

  async delete(itemId: number) {
    const item = await ShopItem.findByPk(itemId);
    if (!item) {
      throw new AppError(ERROR_CODES.ITEM_NOT_FOUND, '商品不存在');
    }

    await item.destroy();
  }
}

export default new AdminShopService();
