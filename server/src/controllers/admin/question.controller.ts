import { Context } from 'koa';
import AdminQuestionService from '../../services/admin/question.service';
import { success } from '../../utils/response';

class AdminQuestionController {
  async getQuestionList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminQuestionService.getList(
      parseInt(query.page as string) || 1,
      parseInt(query.pageSize as string) || 10,
      query.keyword as string,
      query.levelId ? parseInt(query.levelId as string) : undefined,
      query.questionType ? parseInt(query.questionType as string) : undefined,
      query.difficulty ? parseInt(query.difficulty as string) : undefined,
    );
    success(ctx, result);
  }

  async getQuestionDetail(ctx: Context) {
    const questionId = parseInt(ctx.params.questionId);
    const result = await AdminQuestionService.getDetail(questionId);
    success(ctx, result);
  }

  async createQuestion(ctx: Context) {
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminQuestionService.create(data);
    success(ctx, result, '创建成功');
  }

  async updateQuestion(ctx: Context) {
    const questionId = parseInt(ctx.params.questionId);
    const data = ctx.validatedData as Partial<any>;
    const result = await AdminQuestionService.update(questionId, data);
    success(ctx, result, '更新成功');
  }

  async deleteQuestion(ctx: Context) {
    const questionId = parseInt(ctx.params.questionId);
    await AdminQuestionService.delete(questionId);
    success(ctx, null, '删除成功');
  }

  async batchDeleteQuestions(ctx: Context) {
    const data = ctx.validatedData as { questionIds: number[] };
    await AdminQuestionService.batchDelete(data.questionIds);
    success(ctx, null, '批量删除成功');
  }

  async batchImportQuestions(ctx: Context) {
    const data = ctx.validatedData as { questions: any[] };
    const results = [];
    for (const q of data.questions) {
      try {
        const result = await AdminQuestionService.create(q);
        results.push({ success: true, data: result });
      } catch (e) {
        results.push({ success: false, error: String(e) });
      }
    }
    success(ctx, { total: data.questions.length, results }, '导入完成');
  }

  async batchExportQuestions(ctx: Context) {
    const query = ctx.query;
    const result = await AdminQuestionService.getList(
      1,
      10000,
      undefined,
      query.levelId ? parseInt(query.levelId as string) : undefined,
      query.questionType ? parseInt(query.questionType as string) : undefined,
    );
    success(ctx, result.list);
  }
}

export default new AdminQuestionController();
