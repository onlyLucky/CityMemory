import UserInfo from '../../models/mysql/UserInfo';
import LevelInfo from '../../models/mysql/LevelInfo';
import QuestionBank from '../../models/mysql/QuestionBank';
import { UserProgress, GameRecord } from '../../models/mongodb';
import { Op } from 'sequelize';

export class DashboardService {
  async getStats() {
    const totalUsers = await UserInfo.count({ where: { status: { [Op.ne]: 2 } } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNewUsers = await UserInfo.count({
      where: {
        createTime: { [Op.gte]: today },
        status: { [Op.ne]: 2 },
      },
    });

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await UserProgress.countDocuments({
      updateTime: { $gte: sevenDaysAgo },
    }).exec();

    const totalGames = await GameRecord.countDocuments().exec();

    const todayGames = await GameRecord.countDocuments({
      createTime: { $gte: today },
    }).exec();

    const progressList = await UserProgress.find().exec();
    let totalCorrect = 0;
    let totalWrong = 0;
    progressList.forEach((p) => {
      totalCorrect += p.totalCorrect;
      totalWrong += p.totalWrong;
    });
    const avgAccuracy =
      totalCorrect + totalWrong > 0
        ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
        : 0;

    const totalQuestions = await QuestionBank.count({ where: { status: 1 } });
    const totalLevels = await LevelInfo.count({ where: { status: 1 } });

    return {
      totalUsers,
      todayNewUsers,
      activeUsers,
      totalGames,
      todayGames,
      avgAccuracy,
      totalQuestions,
      totalLevels,
    };
  }

  async getTrend(days: number = 7) {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const newUsers = await UserInfo.count({
        where: {
          createTime: { [Op.gte]: date, [Op.lt]: nextDate },
          status: { [Op.ne]: 2 },
        },
      });

      const games = await GameRecord.countDocuments({
        createTime: { $gte: date, $lt: nextDate },
      }).exec();

      result.push({
        date: date.toISOString().split('T')[0],
        newUsers,
        games,
      });
    }

    return result;
  }

  async getRanking(limit: number = 10) {
    const topUsers = await UserProgress.find()
      .sort({ totalStars: -1 })
      .limit(limit)
      .exec();

    const userIds = topUsers.map((u) => u.userId);
    const users = await UserInfo.findAll({ where: { id: userIds } });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return topUsers.map((up, index) => {
      const user = userMap.get(up.userId);
      return {
        rank: index + 1,
        userId: up.userId,
        nickname: user?.nickname || '未知用户',
        avatar: user?.avatar || '',
        totalStars: up.totalStars,
        accuracy: up.accuracy,
      };
    });
  }
}

export default new DashboardService();
