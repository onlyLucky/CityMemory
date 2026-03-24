import { User } from '@/models/mysql';
import { UserProgress } from '@/models/mongodb';
import { Ticket } from '@/models/mongodb';
import { jwtUtil } from '@/config/jwt';
import { getRedisClient } from '@/config/redis';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { ILoginResult, IUserInfo, IUpdateUserParams, IInitProvinceParams, ITicketStatus } from '@/types/user';

export class UserService {
  private userModel: typeof User;
  private userProgressModel: typeof UserProgress;
  private ticketModel: typeof Ticket;

  constructor() {
    this.userModel = User;
    this.userProgressModel = UserProgress;
    this.ticketModel = Ticket;
  }

  async login(code: string): Promise<ILoginResult> {
    const openid = await this.getOpenidFromWechat(code);
    if (!openid) {
      throwErr(ERROR_CODE.UNAUTHORIZED, '微信登录失败');
    }

    let user = await this.userModel.findOne({ where: { openid } });
    if (!user) {
      user = await this.userModel.create({
        openid,
        nickname: '微信用户',
        avatar: '',
        province: '',
        totalStars: 0,
        levelCount: 0,
        coins: 0,
      });
    }

    const token = jwtUtil.sign({ id: user.id, openid: user.openid });

    return {
      token,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        province: user.province,
        totalStars: Number(user.totalStars),
        levelCount: user.levelCount,
        coins: user.coins,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async getUserInfo(userId: string): Promise<IUserInfo> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      province: user.province,
      totalStars: Number(user.totalStars),
      levelCount: user.levelCount,
      coins: user.coins,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUser(userId: string, updateData: IUpdateUserParams): Promise<IUserInfo> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    await user.update(updateData);

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      province: user.province,
      totalStars: Number(user.totalStars),
      levelCount: user.levelCount,
      coins: user.coins,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async initProvince(userId: string, params: IInitProvinceParams): Promise<any> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    if (user.province) {
      throwErr(ERROR_CODE.USER_ALREADY_EXISTS, '用户已初始化省份');
    }

    await user.update({ province: params.province });

    const userProgress = await this.userProgressModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          province: params.province,
          currentLevel: `${params.province}-1`,
        },
        $push: {
          unlockedLevels: `${params.province}-1`,
        },
      },
      { upsert: true, new: true }
    );

    return {
      province: params.province,
      unlockedLevel: `${params.province}-1`,
    };
  }

  async getTicketStatus(userId: string): Promise<ITicketStatus> {
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

    await this.checkAndRecoverTickets(ticket);

    return {
      adventureTickets: {
        current: ticket.adventureTickets.current,
        max: ticket.adventureTickets.max,
        nextRecoverIn: await this.getNextRecoverTime(ticket.adventureTickets.lastRecoverTime),
      },
      randomTickets: {
        current: ticket.randomTickets.current,
        max: ticket.randomTickets.max,
      },
    };
  }

  async useTicket(userId: string, type: 'adventure' | 'random'): Promise<void> {
    const ticket = await this.ticketModel.findOne({ userId });
    if (!ticket) {
      throwErr(ERROR_CODE.TICKET_INSUFFICIENT);
    }

    await this.checkAndRecoverTickets(ticket);

    if (type === 'adventure') {
      if (ticket.adventureTickets.current <= 0) {
        throwErr(ERROR_CODE.TICKET_INSUFFICIENT);
      }
      ticket.adventureTickets.current -= 1;
    } else {
      if (ticket.randomTickets.current <= 0) {
        throwErr(ERROR_CODE.TICKET_INSUFFICIENT);
      }
      ticket.randomTickets.current -= 1;
    }

    await ticket.save();
  }

  private async getOpenidFromWechat(code: string): Promise<string | null> {
    try {
      const redis = getRedisClient();
      const cacheKey = `wechat:code:${code}`;
      const cachedOpenid = await redis.get(cacheKey);

      if (cachedOpenid) {
        return cachedOpenid;
      }

      const openid = `mock_openid_${code}`;

      await redis.set(cacheKey, openid, { EX: 7200 });

      return openid;
    } catch (error) {
      logger.error('获取微信openid失败', error);
      return null;
    }
  }

  private async checkAndRecoverTickets(ticket: any): Promise<void> {
    const now = new Date();
    const adventureInterval = 600;

    const timeDiff = Math.floor((now.getTime() - ticket.adventureTickets.lastRecoverTime.getTime()) / 1000);
    const recoverCount = Math.floor(timeDiff / adventureInterval);

    if (recoverCount > 0 && ticket.adventureTickets.current < ticket.adventureTickets.max) {
      const newCount = Math.min(ticket.adventureTickets.current + recoverCount, ticket.adventureTickets.max);
      ticket.adventureTickets.current = newCount;
      ticket.adventureTickets.lastRecoverTime = new Date(now.getTime() - (timeDiff % adventureInterval) * 1000);
      await ticket.save();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (ticket.randomTickets.dailyResetTime < today) {
      ticket.randomTickets.current = ticket.randomTickets.max;
      ticket.randomTickets.dailyResetTime = today;
      await ticket.save();
    }
  }

  private async getNextRecoverTime(lastRecoverTime: Date): Promise<number> {
    const now = Date.now();
    const lastRecover = lastRecoverTime.getTime();
    const interval = 600 * 1000;

    const nextRecover = lastRecover + interval;
    const remaining = Math.max(0, nextRecover - now);

    return Math.floor(remaining / 1000);
  }
}

export default UserService;
