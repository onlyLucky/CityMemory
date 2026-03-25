import { Context } from 'koa';
import FeedbackService from '../../services/feedback/feedback.service';
import { success } from '../../utils/response';

class FeedbackController {
  async submitFeedback(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      feedbackType: number;
      content: string;
      images?: string[];
      contact?: string;
    };
    const result = await FeedbackService.submitFeedback(
      userId,
      data.feedbackType,
      data.content,
      data.images,
      data.contact,
    );
    success(ctx, result, '提交成功');
  }

  async getFeedbackList(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 10;

    const result = await FeedbackService.getUserFeedbacks(userId, page, pageSize);
    success(ctx, result);
  }

  async getFeedbackDetail(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const feedbackId = parseInt(ctx.params.feedbackId);
    const result = await FeedbackService.getFeedbackDetail(userId, feedbackId);
    success(ctx, result);
  }
}

export default new FeedbackController();
