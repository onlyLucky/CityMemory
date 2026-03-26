import { v4 as uuidv4 } from 'uuid';
import config from '../../config';
import { ERROR_CODES, AppError } from '../../constants/error';
import { LEVEL_STATUS } from '../../constants/status';
import LevelInfo from '../../models/mysql/LevelInfo';
import QuestionBank from '../../models/mysql/QuestionBank';
import UserInfo from '../../models/mysql/UserInfo';
import UserTicket from '../../models/mysql/UserTicket';
import { UserProgress, GameRecord, LevelSession } from '../../models/mongodb';
import { redisUtils } from '../../config/redis';
import { logger } from '../../config/logger';

export class LevelService {
  async getRegions() {
    const levels = await LevelInfo.findAll({
      where: { status: 1 },
      order: [['levelNumber', 'ASC']],
    });

    return levels.map((level) => ({
      id: level.id,
      levelNumber: level.levelNumber,
      regionName: level.regionName,
      difficulty: level.difficulty,
      questionCount: level.questionCount,
      starReward: level.starReward,
    }));
  }

  async getCountries(regionId?: number) {
    const where: any = { status: 1 };
    if (regionId) {
      where.regionId = regionId;
    }

    const levels = await LevelInfo.findAll({
      where,
      order: [['levelNumber', 'ASC']],
    });

    return levels.map((level) => ({
      id: level.id,
      regionId: level.regionId,
      regionName: level.regionName,
      regionType: level.regionType,
    }));
  }

  async getProvinces(countryId?: number) {
    const where: any = { status: 1 };
    if (countryId) {
      where.regionId = countryId;
      where.regionType = 2;
    }

    const levels = await LevelInfo.findAll({
      where,
      order: [['levelNumber', 'ASC']],
    });

    return levels.map((level) => ({
      id: level.id,
      regionId: level.regionId,
      regionName: level.regionName,
    }));
  }

  async getCities(provinceId?: number) {
    const where: any = { status: 1 };
    if (provinceId) {
      where.regionId = provinceId;
        where.regionType = 3;
      }

    const levels = await LevelInfo.findAll({
      where,
      order: [['levelNumber', 'ASC']],
    });

    return levels.map((level) => ({
      id: level.id,
      regionId: level.regionId,
      regionName: level.regionName,
    }));
  }

  async getLevels(userId: number) {
    const levels = await LevelInfo.findAll({
      where: { status: 1 },
      order: [['levelNumber', 'ASC']],
    });

    const userProgress = await UserProgress.findOne({ userId }).exec();
    const levelProgressMap = userProgress?.levelProgress || new Map();

    return levels.map((level) => {
      const progress = levelProgressMap.get(String(level.id));
      let status: number = LEVEL_STATUS.LOCKED;

      if (level.levelNumber === 1) {
        status = LEVEL_STATUS.UNLOCKED;
      } else if (progress) {
        status = progress.stars >= 1 ? LEVEL_STATUS.COMPLETED : LEVEL_STATUS.UNLOCKED;
      } else {
        const prevLevel = levels.find((l) => l.levelNumber === level.levelNumber - 1);
        if (prevLevel) {
          const prevProgress = levelProgressMap.get(String(prevLevel.id));
          if (prevProgress && prevProgress.stars >= 1) {
            status = LEVEL_STATUS.UNLOCKED;
          }
        }
      }

      return {
        id: level.id,
        levelNumber: level.levelNumber,
        regionName: level.regionName,
        difficulty: level.difficulty,
        questionCount: level.questionCount,
        starReward: level.starReward,
        status,
        stars: progress?.stars || 0,
        bestTime: progress?.bestTime || 0,
        attempts: progress?.attempts || 0,
      };
    });
  }

  async getLevelDetail(userId: number, levelId: number) {
    const level = await LevelInfo.findByPk(levelId, {
      include: [{ model: QuestionBank }],
    });

    if (!level) {
      throw new AppError(ERROR_CODES.LEVEL_NOT_FOUND, '关卡不存在');
    }

    const userProgress = await UserProgress.findOne({ userId }).exec();
    const progress = userProgress?.levelProgress?.get(String(levelId));

    let status: number = LEVEL_STATUS.LOCKED;
    if (level.levelNumber === 1) {
      status = LEVEL_STATUS.UNLOCKED;
    } else if (progress) {
      status = progress.stars >= 1 ? LEVEL_STATUS.COMPLETED : LEVEL_STATUS.UNLOCKED;
    }

    return {
      id: level.id,
      levelNumber: level.levelNumber,
      regionName: level.regionName,
      regionType: level.regionType,
      difficulty: level.difficulty,
      questionCount: level.questionCount,
      starReward: level.starReward,
      description: level.description,
      status,
      stars: progress?.stars || 0,
      bestTime: progress?.bestTime || 0,
      attempts: progress?.attempts || 0,
      correctCount: progress?.correctCount || 0,
      wrongCount: progress?.wrongCount || 0,
    };
  }

  async startLevel(userId: number, levelId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    if (user.ticketCount <= 0) {
      throw new AppError(ERROR_CODES.NO_TICKET, '门票不足');
    }

    const level = await LevelInfo.findByPk(levelId);
    if (!level) {
      throw new AppError(ERROR_CODES.LEVEL_NOT_FOUND, '关卡不存在');
    }

    const userProgress = await UserProgress.findOne({ userId }).exec();
    const progress = userProgress?.levelProgress?.get(String(levelId));

    if (level.levelNumber > 1 && !progress) {
      const prevProgress = userProgress?.levelProgress?.get(String(level.levelNumber - 1));
      if (!prevProgress || prevProgress.stars < 1) {
        throw new AppError(ERROR_CODES.LEVEL_LOCKED, '关卡未解锁');
      }
    }

    const questions = await QuestionBank.findAll({
      where: { levelId, status: 1 },
      order: [['id', 'ASC']],
    });

    if (questions.length < level.questionCount) {
      throw new AppError(ERROR_CODES.INTERNAL_ERROR, '题目数量不足');
    }

    const selectedQuestions = this.shuffleArray(questions).slice(0, level.questionCount);
    const questionIds = selectedQuestions.map((q) => q.id);

    const sessionId = uuidv4();
    const session = new LevelSession({
      sessionId,
      userId,
      levelId,
      questions: questionIds,
      currentIndex: 0,
      startTime: new Date(),
      status: 0,
    });
    await session.save();

    await redisUtils.set(`game:session:${sessionId}`, {
      userId,
      levelId,
      startTime: Date.now(),
    }, 7200);

    await user.update({ ticketCount: user.ticketCount - 1 });
    await UserTicket.create({
      userId,
      changeAmount: -1,
      balance: user.ticketCount - 1,
      changeType: 2,
      remark: `开始关卡${level.levelNumber}`,
    });

    return {
      sessionId,
      levelId: level.id,
      levelNumber: level.levelNumber,
      questionCount: level.questionCount,
      questions: selectedQuestions.map((q) => ({
        id: q.id,
        questionType: q.questionType,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        imageUrl: q.imageUrl,
        audioUrl: q.audioUrl,
      })),
    };
  }

  async recordAnswerFail(
    userId: number,
    data: {
      sessionId: string;
      questionId: number;
      questionType: number;
      questionContent: string;
      cityId: string;
      cityName: string;
      provinceId?: string;
      provinceName?: string;
      userAnswer: string;
      correctAnswer: string;
      options: Array<{ key: string; value: string }>;
      timeSpent: number;
    },
  ) {
    const session = await LevelSession.findOne({ sessionId: data.sessionId, userId }).exec();
    if (!session) {
      throw new AppError(ERROR_CODES.GAME_NOT_STARTED, '游戏会话不存在');
    }

    const { AnswerFailRecord } = await import('../../models/mongodb');
    const existingRecord = await AnswerFailRecord.findOne({
      userId,
      questionId: data.questionId,
    }).exec();

    if (existingRecord) {
      await existingRecord.updateOne({
        failCount: existingRecord.failCount + 1,
        lastFailTime: new Date(),
        userAnswer: data.userAnswer,
      });
    } else {
      await AnswerFailRecord.create({
        userId,
        levelId: session.levelId,
        questionId: data.questionId,
        questionType: data.questionType,
        questionContent: data.questionContent,
        cityId: data.cityId,
        cityName: data.cityName,
        provinceId: data.provinceId,
        provinceName: data.provinceName,
        userAnswer: data.userAnswer,
        correctAnswer: data.correctAnswer,
        options: data.options,
        timeSpent: data.timeSpent,
        failCount: 1,
        lastFailTime: new Date(),
      });
    }

    return { success: true };
  }

  async endLevel(
    userId: number,
    levelId: number,
    sessionId: string,
    answers: Array<{ questionId: number; answer: string; timeSpent: number }>,
  ) {
    const session = await LevelSession.findOne({ sessionId, userId }).exec();
    if (!session) {
      throw new AppError(ERROR_CODES.GAME_NOT_STARTED, '游戏会话不存在');
    }

    if (session.status !== 0) {
      throw new AppError(ERROR_CODES.GAME_ALREADY_ENDED, '游戏已结束');
    }

    const level = await LevelInfo.findByPk(levelId);
    if (!level) {
      throw new AppError(ERROR_CODES.LEVEL_NOT_FOUND, '关卡不存在');
    }

    const questions = await QuestionBank.findAll({
      where: { id: session.questions },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));
    let correctCount = 0;
    const answerRecords: Array<{
      questionId: number;
      userAnswer: string;
      isCorrect: boolean;
      timeSpent: number;
    }> = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (question) {
        const isCorrect = answer.answer.toUpperCase() === question.correctAnswer.toUpperCase();
        if (isCorrect) correctCount++;
        answerRecords.push({
        questionId: answer.questionId,
        userAnswer: answer.answer,
        isCorrect,
        timeSpent: answer.timeSpent,
        });
      }
    }

    const wrongCount = answers.length - correctCount;
    const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    const stars = this.calculateStars(accuracy, answers.length);

    const endTime = new Date();
    const duration = endTime.getTime() - session.startTime.getTime();

    const gameRecord = new GameRecord({
      userId,
      levelId,
      sessionId,
      startTime: session.startTime,
      endTime,
      duration,
      totalQuestions: answers.length,
      correctCount,
      wrongCount,
      stars,
      isCompleted: true,
      answers: answerRecords,
    });
    await gameRecord.save();

    await session.updateOne({ status: 1, endTime });

    await this.updateUserProgress(userId, levelId, stars, correctCount, wrongCount, duration);

    if (stars > 0) {
      const user = await UserInfo.findByPk(userId);
      if (user) {
        const starReward = level.starReward * stars;
        await user.update({ starCount: user.starCount + starReward });
      }
    }

    await redisUtils.del(`game:session:${sessionId}`);

    return {
      sessionId,
      levelId,
      correctCount,
      wrongCount,
      accuracy,
      stars,
      duration,
      starReward: stars > 0 ? level.starReward * stars : 0,
    };
  }

  async giveUpLevel(userId: number, sessionId: string) {
    const session = await LevelSession.findOne({ sessionId, userId }).exec();
    if (!session) {
      throw new AppError(ERROR_CODES.GAME_NOT_STARTED, '游戏会话不存在');
    }

    if (session.status !== 0) {
      throw new AppError(ERROR_CODES.GAME_ALREADY_ENDED, '游戏已结束');
    }

    await session.updateOne({ status: 2, endTime: new Date() });
    await redisUtils.del(`game:session:${sessionId}`);

    return { success: true };
  }

  private calculateStars(accuracy: number, totalQuestions: number): number {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
    return 0;
  }

  private async updateUserProgress(
    userId: number,
    levelId: number,
    stars: number,
    correctCount: number,
    wrongCount: number,
    duration: number,
  ) {
    let userProgress = await UserProgress.findOne({ userId }).exec();
    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        levelProgress: new Map(),
        totalStars: 0,
        totalCorrect: 0,
        totalWrong: 0,
        accuracy: 0,
      });
    }

    const existingProgress = userProgress.levelProgress.get(String(levelId)) || {
      levelId,
      status: 0,
      stars: 0,
      bestTime: 0,
      attempts: 0,
      correctCount: 0,
      wrongCount: 0,
      lastPlayTime: new Date(),
    };

    const updatedProgress = {
      levelId,
      status: stars > 0 ? 2 : 1,
      stars: Math.max(existingProgress.stars, stars),
      bestTime: existingProgress.bestTime > 0 ? Math.min(existingProgress.bestTime, duration) : duration,
      attempts: existingProgress.attempts + 1,
      correctCount: existingProgress.correctCount + correctCount,
      wrongCount: existingProgress.wrongCount + wrongCount,
      lastPlayTime: new Date(),
    };

    userProgress.levelProgress.set(String(levelId), updatedProgress);
    userProgress.totalCorrect += correctCount;
    userProgress.totalWrong += wrongCount;
    if (stars > existingProgress.stars) {
      userProgress.totalStars += stars - existingProgress.stars;
    }

    await userProgress.save();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default new LevelService();
