import { Context } from 'koa';
import LevelService from '../../services/level/level.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 关卡模块
 *   description: 关卡相关接口
 */
class LevelController {
  /**
   * @swagger
   * /api/v1/level/regions:
   *   get:
   *     tags:
   *       - 关卡模块
   *     summary: 获取区域列表
   *     description: 获取所有地理区域列表
   *     responses:
   *       200:
   *         description: 成功获取区域列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Region'
   */
  async getRegions(ctx: Context) {
    const regions = await LevelService.getRegions();
    success(ctx, regions);
  }

  /**
   * @swagger
   * /api/v1/level/countries:
   *   get:
   *     tags:
   *       - 关卡模块
   *     summary: 获取国家列表
   *     description: 根据区域ID获取国家列表
   *     parameters:
   *       - name: regionId
   *         in: query
   *         required: true
   *         schema:
   *           type: integer
   *         description: 区域ID
   *         example: 1
   *     responses:
   *       200:
   *         description: 成功获取国家列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Country'
   */
  async getCountries(ctx: Context) {
    const regionId = parseInt(ctx.query.regionId as string);
    const countries = await LevelService.getCountries(regionId);
    success(ctx, countries);
  }

  /**
   * @swagger
   * /api/v1/level/provinces:
   *   get:
   *     tags:
   *       - 关卡模块
   *     summary: 获取省份列表
   *     description: 根据国家ID获取省份列表
   *     parameters:
   *       - name: countryId
   *         in: query
   *         required: true
   *         schema:
   *           type: integer
   *         description: 国家ID
   *         example: 1
   *     responses:
   *       200:
   *         description: 成功获取省份列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Province'
   */
  async getProvinces(ctx: Context) {
    const countryId = parseInt(ctx.query.countryId as string);
    const provinces = await LevelService.getProvinces(countryId);
    success(ctx, provinces);
  }

  /**
   * @swagger
   * /api/v1/level/cities:
   *   get:
   *     tags:
   *       - 关卡模块
   *     summary: 获取城市列表
   *     description: 根据省份ID获取城市列表
   *     parameters:
   *       - name: provinceId
   *         in: query
   *         required: true
   *         schema:
   *           type: integer
   *         description: 省份ID
   *         example: 1
   *     responses:
   *       200:
   *         description: 成功获取城市列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/City'
   */
  async getCities(ctx: Context) {
    const provinceId = parseInt(ctx.query.provinceId as string);
    const cities = await LevelService.getCities(provinceId);
    success(ctx, cities);
  }

  /**
   * @swagger
   * /api/v1/level/list:
   *   get:
   *     tags:
   *       - 关卡模块
   *     summary: 获取关卡列表
   *     description: 获取当前用户可玩的关卡列表
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: 成功获取关卡列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Level'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async getLevels(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levels = await LevelService.getLevels(userId);
    success(ctx, levels);
  }

  /**
   * @swagger
   * /api/v1/level/{levelId}:
   *   get:
   *     tags:
   *       - 关卡模块
   *     summary: 获取关卡详情
   *     description: 获取指定关卡的详细信息
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: 关卡ID
   *         example: 1
   *     responses:
   *       200:
   *         description: 成功获取关卡详情
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Level'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  async getLevelDetail(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levelId = parseInt(ctx.params.levelId);
    const level = await LevelService.getLevelDetail(userId, levelId);
    success(ctx, level);
  }

  /**
   * @swagger
   * /api/v1/level/{levelId}/start:
   *   post:
   *     tags:
   *       - 关卡模块
   *     summary: 开始关卡
   *     description: 开始一个关卡游戏，消耗门票
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: 关卡ID
   *         example: 1
   *     responses:
   *       200:
   *         description: 成功开始关卡
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         sessionId:
   *                           type: string
   *                           description: 游戏会话ID
   *                         questions:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Question'
   *                           description: 题目列表
   *                         timeLimit:
   *                           type: integer
   *                           description: 时间限制（秒）
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         description: 门票不足
   */
  async startLevel(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const levelId = parseInt(ctx.params.levelId);
    const result = await LevelService.startLevel(userId, levelId);
    success(ctx, result, '开始游戏');
  }

  /**
   * @swagger
   * /api/v1/level/answer-fail:
   *   post:
   *     tags:
   *       - 关卡模块
   *     summary: 记录答题错误
   *     description: 记录用户答错的题目信息
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sessionId
   *               - questionId
   *               - questionType
   *               - questionContent
   *               - cityId
   *               - cityName
   *               - userAnswer
   *               - correctAnswer
   *               - options
   *               - timeSpent
   *             properties:
   *               sessionId:
   *                 type: string
   *                 description: 游戏会话ID
   *               questionId:
   *                 type: integer
   *                 description: 题目ID
   *               questionType:
   *                 type: integer
   *                 description: 题目类型
   *               questionContent:
   *                 type: string
   *                 description: 题目内容
   *               cityId:
   *                 type: string
   *                 description: 城市ID
   *               cityName:
   *                 type: string
   *                 description: 城市名称
   *               provinceId:
   *                 type: string
   *                 description: 省份ID
   *               provinceName:
   *                 type: string
   *                 description: 省份名称
   *               userAnswer:
   *                 type: string
   *                 description: 用户答案
   *               correctAnswer:
   *                 type: string
   *                 description: 正确答案
   *               options:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     key:
   *                       type: string
   *                     value:
   *                       type: string
   *               timeSpent:
   *                 type: integer
   *                 description: 答题用时（秒）
   *     responses:
   *       200:
   *         description: 记录成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
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

  /**
   * @swagger
   * /api/v1/level/{levelId}/end:
   *   post:
   *     tags:
   *       - 关卡模块
   *     summary: 结束关卡
   *     description: 提交答案并结束关卡游戏
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: levelId
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: 关卡ID
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sessionId
   *               - answers
   *             properties:
   *               sessionId:
   *                 type: string
   *                 description: 游戏会话ID
   *               answers:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     questionId:
   *                       type: integer
   *                       description: 题目ID
   *                     answer:
   *                       type: string
   *                       description: 用户答案
   *                     timeSpent:
   *                       type: integer
   *                       description: 答题用时（秒）
   *     responses:
   *       200:
   *         description: 游戏结束
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/GameRecord'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
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

  /**
   * @swagger
   * /api/v1/level/abandon/{sessionId}:
   *   post:
   *     tags:
   *       - 关卡模块
   *     summary: 放弃关卡
   *     description: 放弃当前正在进行的关卡
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: sessionId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: 游戏会话ID
   *     responses:
   *       200:
   *         description: 已放弃关卡
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async abandonLevel(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const sessionId = ctx.params.sessionId;
    await LevelService.giveUpLevel(userId, sessionId);
    success(ctx, null, '已放弃关卡');
  }
}

export default new LevelController();
