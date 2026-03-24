import { User } from '@/models/mysql';
import { UserProgress } from '@/models/mongodb';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { IUserInfo, IPageResult } from '@/types/user';
import { Op } from 'sequelize';

export class AdminUserService {
  private userModel: typeof User;
  private userProgressModel: typeof UserProgress;

  constructor() {
    this.userModel = User;
    this.userProgressModel = UserProgress;
  }

  async getUserList(params: {
    page: number;
    pageSize: number;
    nickname?: string;
    province?: string;
  }): Promise<IPageResult<IUserInfo>> {
    const where: any = {};
    if (params.nickname) {
      where.nickname = { [Op.like]: `%${params.nickname}%` };
    }
    if (params.province) {
      where.province = params.province;
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize,
      order: [['createdAt', 'DESC']],
    });

    return {
      list: rows.map((user) => ({
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
      })),
      total: count,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  async getUserDetail(userId: string): Promise<any> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    const userProgress = await this.userProgressModel.findOne({ userId });

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
      progress: userProgress ? {
        unlockedLevels: userProgress.unlockedLevels,
        currentLevel: userProgress.currentLevel,
        levelStars: Object.fromEntries(userProgress.levelStars),
        completedLevels: userProgress.completedLevels,
      } : null,
    };
  }

  async createUser(params: {
    nickname: string;
    avatar: string;
    province: string;
  }): Promise<IUserInfo> {
    const user = await this.userModel.create({
      openid: `admin_${Date.now()}`,
      nickname: params.nickname,
      avatar: params.avatar,
      province: params.province,
      totalStars: 0,
      levelCount: 0,
      coins: 0,
    });

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

  async updateUser(userId: string, params: {
    nickname?: string;
    avatar?: string;
    province?: string;
  }): Promise<IUserInfo> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    await user.update(params);

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

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    await user.destroy();
    await this.userProgressModel.deleteOne({ userId });
  }

  async batchDeleteUsers(userIds: string[]): Promise<{ deletedCount: number }> {
    const deletedCount = await this.userModel.destroy({
      where: { id: userIds },
    });

    await this.userProgressModel.deleteMany({ userId: { $in: userIds } });

    return { deletedCount };
  }
}

export default AdminUserService;
