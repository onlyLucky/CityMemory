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
}

export default new AdminUserService();
