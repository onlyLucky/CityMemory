import { Context } from 'koa';
import AdminFeedbackService from '../../services/admin/feedback.service';
import { success } from '../../utils/response';

class AdminFeedbackController {
  async getFeedbackList(ctx: Context) {
    const query = ctx.query;
    const params = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      feedbackType: query.feedbackType ? parseInt(query.feedbackType as string) : undefined,
      status: query.status ? parseInt(query.status as string) : undefined,
      startDate: query.startDate as string,
      endDate: query.endDate as string,
    };
    const result = await AdminFeedbackService.getFeedbackList(params);
    success(ctx, result);
  }

  async getFeedbackDetail(ctx: Context) {
    const feedbackId = parseInt(ctx.params.feedbackId);
    const result = await AdminFeedbackService.getFeedbackDetail(feedbackId);
    success(ctx, result);
  }

  async replyFeedback(ctx: Context) {
    const feedbackId = parseInt(ctx.params.feedbackId);
    const adminId = parseInt(ctx.admin!.userId);
    const data = ctx.validatedData as { reply: string };
    const result = await AdminFeedbackService.replyFeedback(feedbackId, adminId, data.reply);
    success(ctx, result, '回复成功');
  }

  async deleteFeedback(ctx: Context) {
    const feedbackId = parseInt(ctx.params.feedbackId);
    await AdminFeedbackService.deleteFeedback(feedbackId);
    success(ctx, null, '删除成功');
  }
}

export default new AdminFeedbackController();
