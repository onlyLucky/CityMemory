import UserInfo from '../../models/mysql/UserInfo';
import { UserProgress, GameRecord } from '../../models/mongodb';
import { RankingItem, RankingList } from '../../types/rank';
import { redisUtils } from '../../config/redis';

export class RankService {
  async getGlobalRanking(page: number = 1, pageSize: number = 20): Promise<RankingList> {
    const cacheKey = `ranking:global:${page}:${pageSize}`;
    const cached = await redisUtils.get<RankingList>(cacheKey);
    if (cached) {
      return cached;
    }

    const skip = (page - 1) * pageSize;
    const userProgressList = await UserProgress.find()
      .sort({ totalStars: -1, accuracy: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const total = await UserProgress.countDocuments().exec();

    const userIds = userProgressList.map((up) => up.userId);
    const users = await UserInfo.findAll({ where: { id: userIds } });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const list: RankingItem[] = userProgressList.map((up, index) => {
      const user = userMap.get(up.userId);
      return {
        rank: skip + index + 1,
        userId: up.userId,
        nickname: user?.nickname || '未知用户',
        avatar: user?.avatar || '',
        score: up.accuracy,
        stars: up.totalStars,
      };
    });

    const result: RankingList = { list, total, page, pageSize };

    await redisUtils.set(cacheKey, result, 300);

    return result;
  }

  async getLevelRanking(
    levelId: number,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<RankingList> {
    const cacheKey = `ranking:level:${levelId}:${page}:${pageSize}`;
    const cached = await redisUtils.get<RankingList>(cacheKey);
    if (cached) {
      return cached;
    }

    const skip = (page - 1) * pageSize;
    const gameRecords = await GameRecord.find({ levelId, isCompleted: true })
      .sort({ stars: -1, duration: 1, correctCount: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const total = await GameRecord.countDocuments({ levelId, isCompleted: true }).exec();

    const userIds = [...new Set(gameRecords.map((gr) => gr.userId))];
    const users = await UserInfo.findAll({ where: { id: userIds } });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const list: RankingItem[] = gameRecords.map((gr, index) => {
      const user = userMap.get(gr.userId);
      return {
        rank: skip + index + 1,
        userId: gr.userId,
        nickname: user?.nickname || '未知用户',
        avatar: user?.avatar || '',
        score: gr.accuracy,
        stars: gr.stars,
      };
    });

    const result: RankingList = { list, total, page, pageSize };

    await redisUtils.set(cacheKey, result, 300);

    return result;
  }

  async getUserRanking(userId: number) {
    const userProgress = await UserProgress.findOne({ userId }).exec();
    const user = await UserInfo.findByPk(userId);

    if (!userProgress || !user) {
      return {
        globalRank: 0,
        totalStars: 0,
        accuracy: 0,
      };
    }

    const rank = await UserProgress.countDocuments({
      $or: [
        { totalStars: { $gt: userProgress.totalStars } },
        { totalStars: userProgress.totalStars, accuracy: { $gt: userProgress.accuracy } },
      ],
    }).exec();

    return {
      globalRank: rank + 1,
      userId,
      nickname: user.nickname,
      avatar: user.avatar,
      totalStars: userProgress.totalStars,
      accuracy: userProgress.accuracy,
    };
  }
}

export default new RankService();
