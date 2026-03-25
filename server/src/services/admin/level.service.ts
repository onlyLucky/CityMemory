import LevelInfo from '../../models/mysql/LevelInfo';
import QuestionBank from '../../models/mysql/QuestionBank';
import { ERROR_CODES, AppError } from '../../constants/error';
import { Op } from 'sequelize';

export class AdminLevelService {
  async getList(
    page: number = 1,
    pageSize: number = 20,
    regionId?: number,
    difficulty?: number,
  ) {
    const where: any = { status: 1 };

    if (regionId) {
      where.regionId = regionId;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const { count, rows } = await LevelInfo.findAndCountAll({
      where,
      order: [['levelNumber', 'ASC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const list = rows.map((level) => ({
      id: level.id,
      levelNumber: level.levelNumber,
      regionId: level.regionId,
      regionType: level.regionType,
      regionName: level.regionName,
      difficulty: level.difficulty,
      questionCount: level.questionCount,
      starReward: level.starReward,
      description: level.description,
      createTime: level.createTime,
    }));

    return { list, total: count };
  }

  async getDetail(levelId: number) {
    const level = await LevelInfo.findByPk(levelId);
    if (!level) {
      throw new AppError(ERROR_CODES.LEVEL_NOT_FOUND, '关卡不存在');
    }

    const questionCount = await QuestionBank.count({
      where: { levelId, status: 1 },
    });

    return {
      id: level.id,
      levelNumber: level.levelNumber,
      regionId: level.regionId,
      regionType: level.regionType,
      regionName: level.regionName,
      difficulty: level.difficulty,
      questionCount: level.questionCount,
      actualQuestionCount: questionCount,
      starReward: level.starReward,
      unlockCondition: level.unlockCondition,
      description: level.description,
      createTime: level.createTime,
    };
  }

  async create(data: Partial<LevelInfo>) {
    const level = await LevelInfo.create(data);
    return level;
  }

  async update(levelId: number, data: Partial<LevelInfo>) {
    const level = await LevelInfo.findByPk(levelId);
    if (!level) {
      throw new AppError(ERROR_CODES.LEVEL_NOT_FOUND, '关卡不存在');
    }

    await level.update(data);
    return level;
  }

  async delete(levelId: number) {
    const level = await LevelInfo.findByPk(levelId);
    if (!level) {
      throw new AppError(ERROR_CODES.LEVEL_NOT_FOUND, '关卡不存在');
    }

    await level.update({ status: 0 });
  }
}

export default new AdminLevelService();
