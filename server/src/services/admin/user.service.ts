import UserInfo from '../../models/mysql/UserInfo';
import UserTicket from '../../models/mysql/UserTicket';
import { ERROR_CODES, AppError } from '../../constants/error';
import { USER_STATUS } from '../../constants/status';
import { UserProgress } from '../../models/mongodb';
import { Op } from 'sequelize';

export class AdminUserService {
  async getList(
    page: number = 1,
    pageSize: number = 20,
    keyword?: string,
    status?: number,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = { status: { [Op.ne]: USER_STATUS.DELETED } };

    if (keyword) {
      where[Op.or] = [
        { nickname: { [Op.like]: `%${keyword}%` } },
        { openid: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createTime = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const { count, rows } = await UserInfo.findAndCountAll({
      where,
      order: [['createTime', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const list = rows.map((user) => ({
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      province: user.province,
      city: user.city,
      country: user.country,
      ticketCount: user.ticketCount,
      starCount: user.starCount,
      currentLevel: user.currentLevel,
      status: user.status,
      lastLoginTime: user.lastLoginTime,
      createTime: user.createTime,
    }));

    return { list, total: count };
  }

  async getDetail(userId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const progress = await UserProgress.findOne({ userId }).exec();

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      province: user.province,
      city: user.city,
      country: user.country,
      ticketCount: user.ticketCount,
      starCount: user.starCount,
      currentLevel: user.currentLevel,
      status: user.status,
      lastLoginTime: user.lastLoginTime,
      lastLoginIp: user.lastLoginIp,
      createTime: user.createTime,
      progress: progress
        ? {
            totalStars: progress.totalStars,
            totalCorrect: progress.totalCorrect,
            totalWrong: progress.totalWrong,
            accuracy: progress.accuracy,
          }
        : null,
    };
  }

  async updateStatus(userId: number, status: number, adminId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    await user.update({ status });
  }

  async delete(userId: number, adminId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    await user.update({ status: USER_STATUS.DELETED });
  }

  async create(data: {
    nickname: string;
    avatar?: string;
    gender?: number;
    province?: string;
    city?: string;
    country?: string;
  }) {
    const existingUser = await UserInfo.findOne({
      where: { nickname: data.nickname },
    });

    if (existingUser) {
      throw new AppError(ERROR_CODES.USER_EXISTS, '用户昵称已存在');
    }

    const user = await UserInfo.create({
      openid: `admin_${Date.now()}`,
      nickname: data.nickname,
      avatar: data.avatar || '',
      gender: data.gender || 0,
      province: data.province || '',
      city: data.city || '',
      country: data.country || '',
      ticketCount: 0,
      starCount: 0,
      currentLevel: 1,
      status: USER_STATUS.NORMAL,
    });

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      province: user.province,
      city: user.city,
      country: user.country,
      status: user.status,
      createTime: user.createTime,
    };
  }

  async update(
    userId: number,
    data: {
      nickname?: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
      status?: number;
    },
  ) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    if (data.nickname && data.nickname !== user.nickname) {
      const existingUser = await UserInfo.findOne({
        where: { nickname: data.nickname },
      });
      if (existingUser) {
        throw new AppError(ERROR_CODES.USER_EXISTS, '用户昵称已存在');
      }
    }

    await user.update({
      nickname: data.nickname ?? user.nickname,
      avatar: data.avatar ?? user.avatar,
      gender: data.gender ?? user.gender,
      province: data.province ?? user.province,
      city: data.city ?? user.city,
      country: data.country ?? user.country,
      status: data.status ?? user.status,
    });

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      province: user.province,
      city: user.city,
      country: user.country,
      status: user.status,
      updateTime: user.updateTime,
    };
  }
}

export default new AdminUserService();
