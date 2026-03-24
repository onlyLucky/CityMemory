import { ShopItem } from '@/models/mysql';
import { User } from '@/models/mysql';
import { Ticket } from '@/models/mongodb';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { IShopItem, IBuyItemResult } from '@/types/shop';

export class ShopService {
  private shopItemModel: typeof ShopItem;
  private userModel: typeof User;
  private ticketModel: typeof Ticket;

  constructor() {
    this.shopItemModel = ShopItem;
    this.userModel = User;
    this.ticketModel = Ticket;
  }

  async getShopList(): Promise<IShopItem[]> {
    const items = await this.shopItemModel.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']],
    });

    return items.map((item) => ({
      id: item.id,
      itemName: item.itemName,
      itemType: item.itemType,
      price: item.starPrice || item.coinPrice,
      quantity: item.quantity,
      icon: item.icon || undefined,
      description: item.description || undefined,
    }));
  }

  async buyItem(userId: string, itemId: string): Promise<IBuyItemResult> {
    const item = await this.shopItemModel.findByPk(itemId);
    if (!item || item.status !== 1) {
      throwErr(ERROR_CODE.ITEM_NOT_FOUND);
    }

    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    if (item.starPrice > 0 && Number(user.totalStars) < item.starPrice) {
      throwErr(ERROR_CODE.ITEM_INSUFFICIENT_STARS);
    }

    if (item.coinPrice > 0 && user.coins < item.coinPrice) {
      throwErr(ERROR_CODE.ITEM_INSUFFICIENT_COINS);
    }

    const remainingStars = item.starPrice > 0 ? Number(user.totalStars) - item.starPrice : Number(user.totalStars);

    await user.update({
      totalStars: remainingStars,
    });

    let ticket = await this.ticketModel.findOne({ userId });
    if (!ticket) {
      ticket = await this.ticketModel.create({
        userId,
        adventureTickets: {
          current: 30,
          max: 30,
          lastRecoverTime: new Date(),
        },
        randomTickets: {
          current: 3,
          max: 3,
          dailyResetTime: new Date(),
        },
      });
    }

    if (item.itemType === 'ticket') {
      if (item.itemName.includes('闯关')) {
        ticket.adventureTickets.current = Math.min(
          ticket.adventureTickets.current + item.quantity,
          ticket.adventureTickets.max
        );
      } else if (item.itemName.includes('随机')) {
        ticket.randomTickets.current = Math.min(
          ticket.randomTickets.current + item.quantity,
          ticket.randomTickets.max
        );
      }
      await ticket.save();
    }

    return {
      itemId: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      remainingStars,
      tickets: {
        adventureTickets: ticket.adventureTickets.current,
        randomTickets: ticket.randomTickets.current,
      },
    };
  }
}

export default ShopService;
