import { Level } from '@/models/mysql';
import { Question } from '@/models/mysql';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { ILevelInfo, IPageResult } from '@/types/level';
import type { IQuestionDetail } from '@/types/question';
import { Op } from 'sequelize';

export class AdminLevelService {
  private levelModel: typeof Level;
  private questionModel: typeof Question;

  constructor() {
    this.levelModel = Level;
    this.questionModel = Question;
  }

  async getLevelList(params: {
    page: number;
    pageSize: number;
    province?: string;
    status?: number;
  }): Promise<IPageResult<ILevelInfo>> {
    const where: any = {};
    if (params.province) {
      where.region = params.province;
    }
    if (params.status !== undefined) {
      where.status = params.status;
    }

    const { count, rows } = await this.levelModel.findAndCountAll({
      where,
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize,
      order: [['createdAt', 'DESC']],
    });

    return {
      list: rows.map((level) => ({
        id: level.id,
        levelName: level.levelName,
        province: level.region,
        levelOrder: level.difficulty,
        questionCount: level.questionCount,
        difficulty: level.difficulty,
        status: level.status,
        createdAt: level.createdAt,
        updatedAt: level.updatedAt,
      })),
      total: count,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  async getLevelDetail(levelId: string): Promise<any> {
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throwErr(ERROR_CODE.LEVEL_NOT_FOUND);
    }

    const questions = await this.questionModel.findAll({
      where: { region: level.region, difficulty: level.difficulty, status: 1 },
      limit: level.questionCount,
    });

    return {
      id: level.id,
      levelName: level.levelName,
      province: level.region,
      levelOrder: level.difficulty,
      questionCount: level.questionCount,
      difficulty: level.difficulty,
      status: level.status,
      questions: questions.map((q) => ({
        id: q.id,
        questionType: q.questionType,
        questionContent: q.questionContent,
        questionImage: q.questionImage,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        region: q.region,
      })),
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    };
  }

  async createLevel(params: {
    levelName: string;
    province: string;
    levelOrder: number;
    questionCount: number;
    difficulty: number;
    status: number;
    questionIds: string[];
  }): Promise<ILevelInfo> {
    const level = await this.levelModel.create({
      levelName: params.levelName,
      levelType: 'province',
      region: params.province,
      difficulty: params.levelOrder,
      questionCount: params.questionCount,
      unlockCondition: JSON.stringify({ questionIds: params.questionIds }),
      status: params.status,
    });

    return {
      id: level.id,
      levelName: level.levelName,
      province: level.region,
      levelOrder: level.difficulty,
      questionCount: level.questionCount,
      difficulty: level.difficulty,
      status: level.status,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    };
  }

  async updateLevel(levelId: string, params: {
    levelName?: string;
    province?: string;
    levelOrder?: number;
    questionCount?: number;
    difficulty?: number;
    status?: number;
    questionIds?: string[];
  }): Promise<ILevelInfo> {
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throwErr(ERROR_CODE.LEVEL_NOT_FOUND);
    }

    const updateData: any = {};
    if (params.levelName !== undefined) updateData.levelName = params.levelName;
    if (params.province !== undefined) updateData.region = params.province;
    if (params.levelOrder !== undefined) updateData.difficulty = params.levelOrder;
    if (params.questionCount !== undefined) updateData.questionCount = params.questionCount;
    if (params.difficulty !== undefined) updateData.difficulty = params.difficulty;
    if (params.status !== undefined) updateData.status = params.status;
    if (params.questionIds !== undefined) updateData.unlockCondition = JSON.stringify({ questionIds: params.questionIds });

    await level.update(updateData);

    return {
      id: level.id,
      levelName: level.levelName,
      province: level.region,
      levelOrder: level.difficulty,
      questionCount: level.questionCount,
      difficulty: level.difficulty,
      status: level.status,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    };
  }

  async deleteLevel(levelId: string): Promise<void> {
    const level = await this.levelModel.findByPk(levelId);
    if (!level) {
      throwErr(ERROR_CODE.LEVEL_NOT_FOUND);
    }

    await level.destroy();
  }

  async batchDeleteLevels(levelIds: string[]): Promise<{ deletedCount: number }> {
    const deletedCount = await this.levelModel.destroy({
      where: { id: levelIds },
    });

    return { deletedCount };
  }
}

export default AdminLevelService;
