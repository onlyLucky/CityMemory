import { Question } from '@/models/mysql';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { IQuestionDetail, IPageResult } from '@/types/question';
import { Op } from 'sequelize';

export class AdminQuestionService {
  private questionModel: typeof Question;

  constructor() {
    this.questionModel = Question;
  }

  async getQuestionList(params: {
    page: number;
    pageSize: number;
    questionType?: number;
    region?: string;
    status?: number;
  }): Promise<IPageResult<IQuestionDetail>> {
    const where: any = {};
    if (params.questionType !== undefined) {
      where.questionType = params.questionType;
    }
    if (params.region) {
      where.region = params.region;
    }
    if (params.status !== undefined) {
      where.status = params.status;
    }

    const { count, rows } = await this.questionModel.findAndCountAll({
      where,
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize,
      order: [['createdAt', 'DESC']],
    });

    return {
      list: rows.map((question) => ({
        id: question.id,
        questionType: question.questionType,
        questionContent: question.questionContent,
        questionImage: question.questionImage || undefined,
        options: question.options,
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
        region: question.region,
        status: question.status,
        usedCount: question.usedCount,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
      total: count,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  async getQuestionDetail(questionId: string): Promise<IQuestionDetail> {
    const question = await this.questionModel.findByPk(questionId);
    if (!question) {
      throwErr(ERROR_CODE.QUESTION_NOT_FOUND);
    }

    return {
      id: question.id,
      questionType: question.questionType,
      questionContent: question.questionContent,
      questionImage: question.questionImage || undefined,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      region: question.region,
      status: question.status,
      usedCount: question.usedCount,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  async createQuestion(params: {
    questionType: number;
    questionContent: string;
    questionImage?: string;
    options: any;
    correctAnswer: string;
    difficulty: number;
    region: string;
    status: number;
  }): Promise<IQuestionDetail> {
    const question = await this.questionModel.create({
      questionType: params.questionType,
      questionContent: params.questionContent,
      questionImage: params.questionImage || null,
      options: params.options,
      correctAnswer: params.correctAnswer,
      difficulty: params.difficulty,
      region: params.region,
      status: params.status,
      usedCount: 0,
    });

    return {
      id: question.id,
      questionType: question.questionType,
      questionContent: question.questionContent,
      questionImage: question.questionImage || undefined,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      region: question.region,
      status: question.status,
      usedCount: question.usedCount,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  async updateQuestion(questionId: string, params: {
    questionType?: number;
    questionContent?: string;
    questionImage?: string;
    options?: any;
    correctAnswer?: string;
    difficulty?: number;
    region?: string;
    status?: number;
  }): Promise<IQuestionDetail> {
    const question = await this.questionModel.findByPk(questionId);
    if (!question) {
      throwErr(ERROR_CODE.QUESTION_NOT_FOUND);
    }

    await question.update(params);

    return {
      id: question.id,
      questionType: question.questionType,
      questionContent: question.questionContent,
      questionImage: question.questionImage || undefined,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      region: question.region,
      status: question.status,
      usedCount: question.usedCount,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  async deleteQuestion(questionId: string): Promise<void> {
    const question = await this.questionModel.findByPk(questionId);
    if (!question) {
      throwErr(ERROR_CODE.QUESTION_NOT_FOUND);
    }

    await question.destroy();
  }

  async batchDeleteQuestions(questionIds: string[]): Promise<{ deletedCount: number }> {
    const deletedCount = await this.questionModel.destroy({
      where: { id: questionIds },
    });

    return { deletedCount };
  }
}

export default AdminQuestionService;
