import { User } from '@/models/mysql';
import { getRedisClient } from '@/config/redis';
import { RANK_TYPE } from '@/constants/status';
import { logger } from '@/utils/logger';
import type { IRankItem, IRankResult } from '@/types/rank';

export class RankService {
  private userModel: typeof User;

  constructor() {
    this.userModel = User;
  }

  async getRankList(userId: string, type: string, province?: string, page = 1, pageSize = 20): Promise<IRankResult> {
    const redis = getRedisClient();
    const rankKey = `rank:${type}:${province || 'all'}`;

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let rankedUsers: string[];
    if (province) {
      const provinceUsers = await this.userModel.findAll({
        where: { province },
        attributes: ['id'],
      });
      const userIds = provinceUsers.map((u) => u.id);
      rankedUsers = await redis.zRevRange(rankKey, start, end);
      rankedUsers = rankedUsers.filter((id) => userIds.includes(id));
    } else {
      rankedUsers = await redis.zRevRange(rankKey, start, end);
    }

    const users = await this.userModel.findAll({
      where: { id: rankedUsers },
    });

    const list: IRankItem[] = users.map((user, index) => ({
      rank: start + index + 1,
      userId: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      province: user.province,
      value: type === RANK_TYPE.STAR ? Number(user.totalStars) : user.levelCount,
      levelCount: user.levelCount,
    }));

    const total = await redis.zCard(rankKey);

    let myRank: { rank: number; value: number } | undefined;
    const myScore = await redis.zScore(rankKey, userId);
    if (myScore !== null) {
      const myRankIndex = await redis.zRevRank(rankKey, userId);
      myRank = {
        rank: myRankIndex + 1,
        value: Number(myScore),
      };
    }

    return {
      list,
      total,
      page,
      pageSize,
      myRank,
    };
  }

  async updateRank(userId: string, type: string, value: number, province?: string): Promise<void> {
    const redis = getRedisClient();
    const rankKey = `rank:${type}:${province || 'all'}`;

    await redis.zAdd(rankKey, { score: value, value: userId });
  }
}

export default RankService;
