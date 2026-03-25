import { Context } from 'koa';
import AdminQuestionService from '../../services/admin/question.service';
import { success } from '../../utils/response';

class AdminQuestionController {
  async getQuestionList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      questionType: query.questionType ? parseInt(query.questionType as string) : undefined,
      levelId: query.levelId ? parseInt(query.levelId as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
      keyword: query.keyword as string,
    };
    const result = await AdminQuestionService.getQuestionList(params);
    success(ctx, result);
  }

  async getQuestionDetail(ctx: Context) {
    const questionId = parseInt(ctx.params.questionId);
    const result = await AdminQuestionService.getQuestionDetail(questionId);
    success(ctx, result);
  }

  async createQuestion(ctx: Context) {
    const data = ctx.validatedData;
    const result = await AdminQuestionService.createQuestion(data);
    success(ctx, result, '创建成功');
  }

  async updateQuestion(ctx: Context) {
    const questionId = parseInt(ctx.params.questionId);
    const data = ctx.validatedData;
    const result = await AdminQuestionService.updateQuestion(questionId, data);
    success(ctx, result, '更新成功');
  }

  async deleteQuestion(ctx: Context) {
    const questionId = parseInt(ctx.params.questionId);
    await AdminQuestionService.deleteQuestion(questionId);
    success(ctx, null, '删除成功');
  }

  async batchDeleteQuestions(ctx: Context) {
    const data = ctx.validatedData as { questionIds: number[] };
    await AdminQuestionService.batchDeleteQuestions(data.questionIds);
    success(ctx, null, '批量删除成功');
  }

  async batchImportQuestions(ctx: Context) {
    const data = ctx.validatedData as { questions: any[] };
    const result = await AdminQuestionService.batchImportQuestions(data.questions);
    success(ctx, result, '导入完成');
  }

  async batchExportQuestions(ctx: Context) {
    const query = ctx.query;
    const params = {
      levelId: query.levelId ? parseInt(query.levelId as string) : undefined,
      questionType: query.questionType ? parseInt(query.questionType as string) : undefined,
    };
    const result = await AdminQuestionService.batchExportQuestions(params);
    success(ctx, result);
  }
}

export default new AdminQuestionController();
