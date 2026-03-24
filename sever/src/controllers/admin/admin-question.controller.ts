import { Context } from 'koa';
import { AdminQuestionService } from '@/services/admin/admin-question.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class AdminQuestionController {
  private adminQuestionService: AdminQuestionService;

  constructor() {
    this.adminQuestionService = new AdminQuestionService();
  }

  getQuestionList = async (ctx: Context) => {
    try {
      const params = ctx.query;

      const result = await this.adminQuestionService.getQuestionList({
        page: parseInt(params.page as string) || 1,
        pageSize: parseInt(params.pageSize as string) || 20,
        questionType: params.questionType ? parseInt(params.questionType as string) : undefined,
        region: params.region as string,
        status: params.status ? parseInt(params.status as string) : undefined,
      });

      success(ctx, result);
    } catch (err) {
      logger.error('获取题目列表失败', err);
      error(ctx, err);
    }
  };

  getQuestionDetail = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      const questionDetail = await this.adminQuestionService.getQuestionDetail(id);

      success(ctx, questionDetail);
    } catch (err) {
      logger.error('获取题目详情失败', err);
      error(ctx, err);
    }
  };

  createQuestion = async (ctx: Context) => {
    try {
      const params = ctx.request.body;

      const question = await this.adminQuestionService.createQuestion(params);

      success(ctx, question);
    } catch (err) {
      logger.error('创建题目失败', err);
      error(ctx, err);
    }
  };

  updateQuestion = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const params = ctx.request.body;

      const question = await this.adminQuestionService.updateQuestion(id, params);

      success(ctx, question);
    } catch (err) {
      logger.error('更新题目失败', err);
      error(ctx, err);
    }
  };

  deleteQuestion = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      await this.adminQuestionService.deleteQuestion(id);

      success(ctx, { message: '题目删除成功' });
    } catch (err) {
      logger.error('删除题目失败', err);
      error(ctx, err);
    }
  };

  batchDeleteQuestions = async (ctx: Context) => {
    try {
      const { ids } = ctx.request.body;

      const result = await this.adminQuestionService.batchDeleteQuestions(ids);

      success(ctx, result);
    } catch (err) {
      logger.error('批量删除题目失败', err);
      error(ctx, err);
    }
  };
}

export default AdminQuestionController;
