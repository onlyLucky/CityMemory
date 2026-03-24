import { Level } from '@/models/mysql';
import { UserProgress } from '@/models/mongodb';
import { Question } from '@/models/mysql';
import { User } from '@/models/mysql';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { ILevelInfo, ILevelDetail, IStartLevelResult, IAnswerResult, ICompleteLevelParams, ICompleteLevelResult } from '@/types/level';
import type { IQuestionInfo } from '@/types/question';

export class LevelService {
  private levelModel: typeof Level;
  private userProgressModel: typeof UserProgress;
  private questionModel: typeof Question;
  private userModel: typeof User;

  constructor() {
    this.levelModel = Level;
    this.userProgressModel = UserProgress;
    this.questionModel = Question;
    this.userModel = User;
  }

  async getLevelList(userId: string, province?: string): Promise<ILevelInfo[]> {
    const where: any = { status: 1 };
    if (province) {
      where.region = province;
    }

    const levels = await this.levelModel.findAll({
      where,
      order: [['region', 'ASC'], ['difficulty', 'ASC']],
    });

    const userProgress = await this.userProgressModel.findOne({ userId });

    return levels.map((level) => {
      const isUnlocked = userProgress?.unlockedLevels.includes(level.id) || false;
      const isCompleted = userProgress?.completedLevels.includes(level.id) || false;
      const userStars = userProgress?.levelStars.get(level.id) || 0;

      return {
        id: level.id,
        levelName: level.levelName,
        province: level.region,
        levelOrder: level.difficulty,
        questionCount: level.questionCount,
        difficulty: level.difficulty,
        status: level.status,
        userStars,
        isUnlocked,
        isCompleted,
      };
    });
  }

  async getLevelDetail(userId: string, levelId: string): Promise<ILevelDetail> {
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throwErr(ERROR_CODE.LEVEL_NOT_FOUND);
    }

    const userProgress = await this.userProgressModel.findOne({ userId });

    const isUnlocked = userProgress?.unlockedLevels.includes(level.id) || false;
    const isCompleted = userProgress?.completedLevels.includes(level.id) || false;
    const userStars = userProgress?.levelStars.get(level.id) || 0;

    return {
      id: level.id,
      levelName: level.levelName,
      province: level.region,
      levelOrder: level.difficulty,
      questionCount: level.questionCount,
      difficulty: level.difficulty,
      status: level.status,
      userStars,
      isUnlocked,
      isCompleted,
    };
  }

  async startLevel(userId: string, levelId: string): Promise<IStartLevelResult> {
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throwErr(ERROR_CODE.LEVEL_NOT_FOUND);
    }

    const userProgress = await this.userProgressModel.findOne({ userId });
    if (!userProgress?.unlockedLevels.includes(levelId)) {
      throwErr(ERROR_CODE.LEVEL_LOCKED);
    }

    const questions = await this.generateQuestions(level);

    return {
      levelId,
      questions,
    };
  }

  async submitAnswer(userId: string, levelId: string, questionId: string, answer: string): Promise<IAnswerResult> {
    const question = await this.questionModel.findByPk(questionId);
    if (!question) {
      throwErr(ERROR_CODE.QUESTION_NOT_FOUND);
    }

    const isCorrect = question.correctAnswer === answer;
    const userProgress = await this.userProgressModel.findOne({ userId });

    if (!userProgress) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    const currentAttempt = userProgress.attemptCount.get(levelId) || 0;
    const blood = Math.max(0, 10 - currentAttempt - (isCorrect ? 0 : 1));

    const isLevelCompleted = blood <= 0;

    let nextQuestion: IQuestionInfo | undefined;
    if (!isLevelCompleted) {
      const level = await this.levelModel.findByPk(levelId);
      if (level) {
        const questions = await this.questionModel.findAll({
          where: {
            region: level.region,
            difficulty: level.difficulty,
            status: 1,
          },
          limit: 1,
        });
        if (questions.length > 0) {
          nextQuestion = {
            id: questions[0].id,
            questionType: questions[0].questionType,
            questionContent: questions[0].questionContent,
            questionImage: questions[0].questionImage || undefined,
            options: questions[0].options,
            difficulty: questions[0].difficulty,
            region: questions[0].region,
          };
        }
      }
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      blood,
      isLevelCompleted,
      nextQuestion,
    };
  }

  async completeLevel(userId: string, levelId: string, params: ICompleteLevelParams): Promise<ICompleteLevelResult> {
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throwErr(ERROR_CODE.LEVEL_NOT_FOUND);
    }

    const userProgress = await this.userProgressModel.findOne({ userId });
    if (!userProgress) {
      throwErr(ERROR_CODE.USER_NOT_FOUND);
    }

    const correctCount = params.answers.filter((a) => a.isCorrect).length;
    const totalCount = params.answers.length;
    const correctRate = correctCount / totalCount;

    if (correctRate < 0.6) {
      throwErr(ERROR_CODE.LEVEL_NOT_COMPLETED, '正确率不足60%');
    }

    const stars = this.calculateStars(correctRate, params.blood);

    const oldStars = userProgress.levelStars.get(levelId) || 0;
    const starsIncrease = Math.max(0, stars - oldStars);

    userProgress.levelStars.set(levelId, stars);

    if (!userProgress.completedLevels.includes(levelId)) {
      userProgress.completedLevels.push(levelId);
    }

    const nextLevel = await this.levelModel.findOne({
      where: {
        region: level.region,
        difficulty: level.difficulty + 1,
        status: 1,
      },
    });

    let unlockedLevel: string | undefined;
    if (nextLevel && !userProgress.unlockedLevels.includes(nextLevel.id)) {
      userProgress.unlockedLevels.push(nextLevel.id);
      unlockedLevel = nextLevel.id;
    }

    await userProgress.save();

    const user = await this.userModel.findByPk(userId);
    if (user) {
      await user.update({
        totalStars: Number(user.totalStars) + starsIncrease,
        levelCount: userProgress.completedLevels.length,
      });
    }

    return {
      levelId,
      stars,
      totalStars: Number(user?.totalStars || 0) + starsIncrease,
      unlockedLevel,
      rewards: {
        stars: starsIncrease,
        tickets: 1,
      },
    };
  }

  private async generateQuestions(level: any): Promise<IQuestionInfo[]> {
    const questions = await this.questionModel.findAll({
      where: {
        region: level.region,
        difficulty: level.difficulty,
        status: 1,
      },
      limit: level.questionCount,
      order: [['usedCount', 'ASC']],
    });

    return questions.map((q) => ({
      id: q.id,
      questionType: q.questionType,
      questionContent: q.questionContent,
      questionImage: q.questionImage || undefined,
      options: q.options,
      difficulty: q.difficulty,
      region: q.region,
    }));
  }

  private calculateStars(correctRate: number, blood: number): number {
    let baseStars: number;

    if (correctRate >= 1.0) {
      baseStars = 5;
    } else if (correctRate >= 0.9) {
      baseStars = 4.5;
    } else if (correctRate >= 0.8) {
      baseStars = 4;
    } else if (correctRate >= 0.7) {
      baseStars = 3.5;
    } else if (correctRate >= 0.6) {
      baseStars = 3;
    } else if (correctRate >= 0.5) {
      baseStars = 2.5;
    } else if (correctRate >= 0.4) {
      baseStars = 2;
    } else if (correctRate >= 0.3) {
      baseStars = 1.5;
    } else if (correctRate >= 0.2) {
      baseStars = 1;
    } else {
      baseStars = 0.5;
    }

    const timeBonus = blood >= 8 ? 1 : blood >= 5 ? 0.5 : 0;

    return Math.min(6, baseStars + timeBonus);
  }
}

export default LevelService;
