import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import UserInfo from '../../models/mysql/UserInfo';
import { UserProgress, GameRecord } from '../../models/mongodb';
import { ERROR_CODES, AppError } from '../../constants/error';
import { redis } from '../../config/redis';

export class AdminRankService {
  async getRankingList(params: {
    page?: number;
    pageSize?: number;
    rankType?: string;
    regionId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, pageSize = 50, rankType = 'total', regionId, startDate, endDate } = params;
    const offset = (page - 1) * pageSize;

    let rankingData: any[] = [];
    let total = 0;

    switch (rankType) {
      case 'total':
        const totalResult = await UserProgress.findAndCountAll({
          offset,
          limit: pageSize,
          order: [['totalStars', 'DESC']],
          include: [
            {
              model: UserInfo,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar'],
              where: regionId ? { province: { [Op.ne]: null } } : undefined,
              required: true,
            },
          ],
        });
        rankingData = totalResult.rows;
        total = totalResult.count;
        break;

      case 'accuracy':
        const accuracyResult = await UserProgress.findAndCountAll({
          offset,
          limit: pageSize,
          order: [['accuracy', 'DESC']],
          where: { totalCorrect: { [Op.gt]: 10 } },
          include: [
            {
              model: UserInfo,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar'],
              required: true,
            },
          ],
        });
        rankingData = accuracyResult.rows;
        total = accuracyResult.count;
        break;

      case 'weekly':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);

        const weeklyRecords = await GameRecord.aggregate([
          {
            $match: {
              createTime: { $gte: weekStart },
              ...(startDate && { createTime: { $gte: new Date(startDate) } }),
              ...(endDate && { createTime: { $lte: new Date(endDate) } }),
            },
          },
          {
            $group: {
              _id: '$userId',
              totalStars: { $sum: '$starsEarned' },
              totalGames: { $sum: 1 },
            },
          },
          { $sort: { totalStars: -1 } },
          { $skip: offset },
          { $limit: pageSize },
        ]);

        const userIds = weeklyRecords.map((r: any) => r._id);
        const users = await UserInfo.findAll({
          where: { id: userIds },
          attributes: ['id', 'nickname', 'avatar'],
        });
        const userMap = new Map(users.map((u) => [u.id, u]));

        rankingData = weeklyRecords.map((r: any) => ({
          userId: r._id,
          totalStars: r.totalStars,
          totalGames: r.totalGames,
          user: userMap.get(r._id),
        }));
        total = await GameRecord.distinct('userId', {
          createTime: { $gte: weekStart },
        }).then((ids) => ids.length);
        break;

      default:
        throw new AppError(ERROR_CODES.INVALID_PARAMS, '无效的排行榜类型');
    }

    return {
      total,
      page,
      pageSize,
      list: rankingData.map((item: any, index: number) => ({
        rank: offset + index + 1,
        userId: item.userId || item._id,
        nickname: item.user?.nickname || '未知用户',
        avatar: item.user?.avatar,
        totalStars: item.totalStars,
        accuracy: item.accuracy ? Math.round(item.accuracy * 100) / 100 : undefined,
        totalGames: item.totalGames,
        totalCorrect: item.totalCorrect,
        totalWrong: item.totalWrong,
      })),
    };
  }

  async getUserRankDetail(userId: number) {
    const user = await UserInfo.findByPk(userId, {
      attributes: ['id', 'nickname', 'avatar', 'starCount', 'currentLevel'],
    });

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const progress = await UserProgress.findOne({ where: { userId } });

    const totalStarsRank = await UserProgress.count({
      where: { totalStars: { [Op.gt]: progress?.totalStars || 0 } },
    });

    const accuracyRank = await UserProgress.count({
      where: {
        accuracy: { [Op.gt]: progress?.accuracy || 0 },
        totalCorrect: { [Op.gt]: 10 },
      },
    });

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyStars = await GameRecord.aggregate([
      {
        $match: {
          userId: userId,
          createTime: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: null,
          totalStars: { $sum: '$starsEarned' },
          totalGames: { $sum: 1 },
        },
      },
    ]);

    const weeklyData = weeklyStars[0] || { totalStars: 0, totalGames: 0 };

    const weeklyRankResult = await GameRecord.aggregate([
      {
        $match: {
          createTime: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalStars: { $sum: '$starsEarned' },
        },
      },
      {
        $match: {
          totalStars: { $gt: weeklyData.totalStars },
        },
      },
      {
        $count: 'count',
      },
    ]);

    const weeklyRank = weeklyRankResult[0]?.count || 0;

    return {
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        starCount: user.starCount,
        currentLevel: user.currentLevel,
      },
      progress: progress
        ? {
            totalStars: progress.totalStars,
            totalCorrect: progress.totalCorrect,
            totalWrong: progress.totalWrong,
            accuracy: Math.round(progress.accuracy * 100) / 100,
          }
        : null,
      ranks: {
        totalStars: totalStarsRank + 1,
        accuracy: accuracyRank + 1,
        weekly: weeklyRank + 1,
      },
      weekly: weeklyData,
    };
  }

  async exportRankingData(rankType: string) {
    const cacheKey = `ranking:export:${rankType}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    let data: any[] = [];

    switch (rankType) {
      case 'total':
        const totalData = await UserProgress.findAll({
          order: [['totalStars', 'DESC']],
          limit: 100,
          include: [
            {
              model: UserInfo,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar'],
            },
          ],
        });
        data = totalData.map((p: any, i: number) => ({
          rank: i + 1,
          userId: p.userId,
          nickname: p.user?.nickname,
          totalStars: p.totalStars,
          accuracy: Math.round(p.accuracy * 100) / 100,
        }));
        break;

      case 'accuracy':
        const accuracyData = await UserProgress.findAll({
          order: [['accuracy', 'DESC']],
          where: { totalCorrect: { [Op.gt]: 10 } },
          limit: 100,
          include: [
            {
              model: UserInfo,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar'],
            },
          ],
        });
        data = accuracyData.map((p: any, i: number) => ({
          rank: i + 1,
          userId: p.userId,
          nickname: p.user?.nickname,
          accuracy: Math.round(p.accuracy * 100) / 100,
          totalCorrect: p.totalCorrect,
          totalWrong: p.totalWrong,
        }));
        break;

      default:
        throw new AppError(ERROR_CODES.INVALID_PARAMS, '无效的排行榜类型');
    }

    await redis.setex(cacheKey, 300, JSON.stringify(data));

    return data;
  }
}

export default new AdminRankService();
