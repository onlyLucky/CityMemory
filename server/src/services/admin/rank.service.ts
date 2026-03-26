import UserInfo from '../../models/mysql/UserInfo';
import { UserProgress, GameRecord } from '../../models/mongodb';
import { ERROR_CODES, AppError } from '../../constants/error';
import { redisUtils } from '../../config/redis';

export class AdminRankService {
  async getRankingList(params: {
    page?: number;
    pageSize?: number;
    rankType?: string;
    regionId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, pageSize = 50, rankType = 'total', startDate, endDate } = params;
    const offset = (page - 1) * pageSize;

    let rankingData: any[] = [];
    let total = 0;

    switch (rankType) {
      case 'total':
        const totalResult = await UserProgress.find()
          .sort({ totalStars: -1 })
          .skip(offset)
          .limit(pageSize)
          .exec();
        
        total = await UserProgress.countDocuments().exec();
        
        const userIds = totalResult.map((p) => p.userId);
        const users = await UserInfo.findAll({
          where: { id: userIds },
          attributes: ['id', 'nickname', 'avatar'],
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        
        rankingData = totalResult.map((p) => ({
          userId: p.userId,
          user: userMap.get(p.userId),
          totalStars: p.totalStars,
          accuracy: p.accuracy,
          totalCorrect: p.totalCorrect,
          totalWrong: p.totalWrong,
        }));
        break;

      case 'accuracy':
        const accuracyResult = await UserProgress.find({ totalCorrect: { $gt: 10 } })
          .sort({ accuracy: -1 })
          .skip(offset)
          .limit(pageSize)
          .exec();
        
        total = await UserProgress.countDocuments({ totalCorrect: { $gt: 10 } }).exec();
        
        const accuracyUserIds = accuracyResult.map((p) => p.userId);
        const accuracyUsers = await UserInfo.findAll({
          where: { id: accuracyUserIds },
          attributes: ['id', 'nickname', 'avatar'],
        });
        const accuracyUserMap = new Map(accuracyUsers.map((u) => [u.id, u]));
        
        rankingData = accuracyResult.map((p) => ({
          userId: p.userId,
          user: accuracyUserMap.get(p.userId),
          totalStars: p.totalStars,
          accuracy: p.accuracy,
          totalCorrect: p.totalCorrect,
          totalWrong: p.totalWrong,
        }));
        break;

      case 'weekly':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);

        const matchCondition: any = {
          createTime: { $gte: weekStart },
        };
        if (startDate) {
          matchCondition.createTime = { $gte: new Date(startDate) };
        }
        if (endDate) {
          matchCondition.createTime = { ...matchCondition.createTime, $lte: new Date(endDate) };
        }

        const weeklyRecords = await GameRecord.aggregate([
          { $match: matchCondition },
          {
            $group: {
              _id: '$userId',
              totalStars: { $sum: '$stars' },
              totalGames: { $sum: 1 },
            },
          },
          { $sort: { totalStars: -1 } },
          { $skip: offset },
          { $limit: pageSize },
        ]);

        const weeklyUserIds = weeklyRecords.map((r: any) => r._id);
        const weeklyUsers = await UserInfo.findAll({
          where: { id: weeklyUserIds },
          attributes: ['id', 'nickname', 'avatar'],
        });
        const weeklyUserMap = new Map(weeklyUsers.map((u) => [u.id, u]));

        rankingData = weeklyRecords.map((r: any) => ({
          userId: r._id,
          user: weeklyUserMap.get(r._id),
          totalStars: r.totalStars,
          totalGames: r.totalGames,
        }));
        
        const distinctUserIds = await GameRecord.distinct('userId', matchCondition);
        total = distinctUserIds.length;
        break;

      default:
        throw new AppError(ERROR_CODES.PARAM_ERROR, '无效的排行榜类型');
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

    const progress = await UserProgress.findOne({ userId }).exec();

    const totalStarsRank = await UserProgress.countDocuments({
      totalStars: { $gt: progress?.totalStars || 0 },
    }).exec();

    const accuracyRank = await UserProgress.countDocuments({
      accuracy: { $gt: progress?.accuracy || 0 },
      totalCorrect: { $gt: 10 },
    }).exec();

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
          totalStars: { $sum: '$stars' },
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
          totalStars: { $sum: '$stars' },
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
    const cached = await redisUtils.get<string>(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    let data: any[] = [];

    switch (rankType) {
      case 'total':
        const totalData = await UserProgress.find()
          .sort({ totalStars: -1 })
          .limit(100)
          .exec();
        
        const totalUserIds = totalData.map((p) => p.userId);
        const totalUsers = await UserInfo.findAll({
          where: { id: totalUserIds },
          attributes: ['id', 'nickname', 'avatar'],
        });
        const totalUserMap = new Map(totalUsers.map((u) => [u.id, u]));
        
        data = totalData.map((p, i) => ({
          rank: i + 1,
          userId: p.userId,
          nickname: totalUserMap.get(p.userId)?.nickname,
          totalStars: p.totalStars,
          accuracy: Math.round(p.accuracy * 100) / 100,
        }));
        break;

      case 'accuracy':
        const accuracyData = await UserProgress.find({ totalCorrect: { $gt: 10 } })
          .sort({ accuracy: -1 })
          .limit(100)
          .exec();
        
        const accuracyUserIds = accuracyData.map((p) => p.userId);
        const accuracyUsers = await UserInfo.findAll({
          where: { id: accuracyUserIds },
          attributes: ['id', 'nickname', 'avatar'],
        });
        const accuracyUserMap = new Map(accuracyUsers.map((u) => [u.id, u]));
        
        data = accuracyData.map((p, i) => ({
          rank: i + 1,
          userId: p.userId,
          nickname: accuracyUserMap.get(p.userId)?.nickname,
          accuracy: Math.round(p.accuracy * 100) / 100,
          totalCorrect: p.totalCorrect,
          totalWrong: p.totalWrong,
        }));
        break;

      default:
        throw new AppError(ERROR_CODES.PARAM_ERROR, '无效的排行榜类型');
    }

    await redisUtils.set(cacheKey, JSON.stringify(data), 300);

    return data;
  }
}

export default new AdminRankService();
