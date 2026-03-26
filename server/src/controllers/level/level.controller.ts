import { Context } from 'koa';
import LevelService from '../../services/level/level.service';
import { success } from '../../utils/response';

class LevelController {
  async getRegions(ctx: Context) {
    const regions = await LevelService.getRegions();
    success(ctx, regions);
  }

  async getCountries(ctx: Context) {
    const regionId = parseInt(ctx.query.regionId as string);
    const countries = await LevelService.getCountries(regionId);
    success(ctx, countries);
  }

  async getProvinces(ctx: Context) {
    const countryId = parseInt(ctx.query.countryId as string);
    const provinces = await LevelService.getProvinces(countryId);
    success(ctx, provinces);
  }

  async getCities(ctx: Context) {
    const provinceId = parseInt(ctx.query.provinceId as string);
    const cities = await LevelService.getCities(provinceId);
    success(ctx, cities);
  }

  async getLevels(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levels = await LevelService.getLevels(userId);
    success(ctx, levels);
  }

  async getLevelDetail(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levelId = parseInt(ctx.params.levelId);
    const level = await LevelService.getLevelDetail(userId, levelId);
    success(ctx, level);
  }

  async startLevel(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levelId = parseInt(ctx.params.levelId);
    const result = await LevelService.startLevel(userId, levelId);
    success(ctx, result, '开始游戏');
  }

  async recordAnswerFail(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
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
    };
    await LevelService.recordAnswerFail(userId, data);
    success(ctx, null, '记录成功');
  }

  async endLevel(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levelId = parseInt(ctx.params.levelId);
    const data = ctx.validatedData as {
      sessionId: string;
      answers: Array<{ questionId: number; answer: string; timeSpent: number }>;
    };
    const result = await LevelService.endLevel(userId, levelId, data.sessionId, data.answers);
    success(ctx, result, '游戏结束');
  }

  async abandonLevel(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const sessionId = ctx.params.sessionId;
    await LevelService.giveUpLevel(userId, sessionId);
    success(ctx, null, '已放弃关卡');
  }
}

export default new LevelController();
