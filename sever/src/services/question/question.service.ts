import { Question } from '@/models/mysql';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { IQuestionInfo, IQuestionDetail, IRandomQuestionParams, IRandomAnswerResult } from '@/types/question';

export class QuestionService {
  private questionModel: typeof Question;

  constructor() {
    this.questionModel = Question;
  }

  async getRandomQuestions(params: IRandomQuestionParams): Promise<IQuestionInfo[]> {
    const where: any = { status: 1 };

    if (params.region) {
      where.region = params.region;
    }

    if (params.difficulty) {
      where.difficulty = params.difficulty;
    }

    const count = params.count || 10;

    const questions = await this.questionModel.findAll({
      where,
      limit: count,
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

  async validateAnswer(questionId: string, answer: string): Promise<IRandomAnswerResult> {
    const question = await this.questionModel.findByPk(questionId);
    if (!question) {
      throwErr(ERROR_CODE.QUESTION_NOT_FOUND);
    }

    const isCorrect = question.correctAnswer === answer;

    await question.update({
      usedCount: question.usedCount + 1,
    });

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      currentScore: isCorrect ? 10 : 0,
      totalQuestions: 1,
      completedQuestions: 1,
    };
  }
}

export default QuestionService;
