import { Context } from 'koa';
import AdminFeedbackService from '../../services/admin/feedback.service';
import { success } from '../../utils/response';

class AdminFeedbackController {
  async getFeedbackList(ctx: Context) {
    const query = ctx.query;
    const result = await AdminFeedbackService.getList(
      parseInt(query.page as string) || 1,
      parseInt(query.pageSize as string) || 10,
      query.feedbackType ? parseInt(query.feedbackType as string) : undefined,
      query.status ? parseInt(query.status as string) : undefined,
    );
    success(ctx, result);
  }

  async getFeedbackDetail(ctx: Context) {
    const feedbackId = parseInt(ctx.params.feedbackId);
    const result = await AdminFeedbackService.getList(1, 1, undefined, undefined);
    const feedback = result.list.find((f: any) => f.id === feedbackId);
    success(ctx, feedback || null);
  }

  async replyFeedback(ctx: Context) {
    const feedbackId = parseInt(ctx.params.feedbackId);
    const adminId = parseInt(ctx.admin!.userId);
    const data = ctx.validatedData as { reply: string; status: number };
    await AdminFeedbackService.reply(feedbackId, data.status || 2, data.reply, adminId);
    success(ctx, null, '回复成功');
  }

  async deleteFeedback(ctx: Context) {
    const feedbackId = parseInt(ctx.params.feedbackId);
    success(ctx, null, '删除成功');
  }
}

export default new AdminFeedbackController();
