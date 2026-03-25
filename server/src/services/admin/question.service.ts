import QuestionBank from '../../models/mysql/QuestionBank';
import LevelInfo from '../../models/mysql/LevelInfo';
import { ERROR_CODES, AppError } from '../../constants/error';
import { Op } from 'sequelize';

export class AdminQuestionService {
  async getList(
    page: number = 1,
    pageSize: number = 20,
    keyword?: string,
    levelId?: number,
    questionType?: number,
    difficulty?: number,
  ) {
    const where: any = { status: 1 };

    if (keyword) {
      where.questionText = { [Op.like]: `%${keyword}%` };
    }

    if (levelId) {
      where.levelId = levelId;
    }

    if (questionType) {
      where.questionType = questionType;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const { count, rows } = await QuestionBank.findAndCountAll({
      where,
      include: [{ model: LevelInfo, attributes: ['id', 'levelNumber', 'regionName'] }],
      order: [['createTime', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const list = rows.map((q) => ({
      id: q.id,
      levelId: q.levelId,
      level: q.level
        ? {
            id: q.level.id,
            levelNumber: q.level.levelNumber,
            regionName: q.level.regionName,
          }
        : null,
      questionType: q.questionType,
      questionText: q.questionText,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      createTime: q.createTime,
    }));

    return { list, total: count };
  }

  async getDetail(questionId: number) {
    const question = await QuestionBank.findByPk(questionId, {
      include: [{ model: LevelInfo }],
    });
    if (!question) {
      throw new AppError(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在');
    }

    return {
      id: question.id,
      levelId: question.levelId,
      level: question.level
        ? {
            id: question.level.id,
            levelNumber: question.level.levelNumber,
            regionName: question.level.regionName,
          }
        : null,
      questionType: question.questionType,
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      imageUrl: question.imageUrl,
      audioUrl: question.audioUrl,
      difficulty: question.difficulty,
      createTime: question.createTime,
    };
  }

  async create(data: Partial<QuestionBank>) {
    const question = await QuestionBank.create(data);
    return question;
  }

  async update(questionId: number, data: Partial<QuestionBank>) {
    const question = await QuestionBank.findByPk(questionId);
    if (!question) {
      throw new AppError(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在');
    }

    await question.update(data);
    return question;
  }

  async delete(questionId: number) {
    const question = await QuestionBank.findByPk(questionId);
    if (!question) {
      throw new AppError(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在');
    }

    await question.update({ status: 0 });
  }

  async batchDelete(ids: number[]) {
    await QuestionBank.update(
      { status: 0 },
      { where: { id: { [Op.in]: ids } } },
    );
  }
}

export default new AdminQuestionService();
