import { Context } from 'koa';
import { FeedbackService } from '@/services/feedback/feedback.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }

  submitFeedback = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const params = ctx.request.body;

      const feedback = await this.feedbackService.submitFeedback(userId, params);

      success(ctx, feedback);
    } catch (err) {
      logger.error('提交反馈失败', err);
      error(ctx, err);
    }
  };

  getFeedbackList = async (ctx: Context) => {
    try {
      const { page, pageSize, status } = ctx.query;

      const result = await this.feedbackService.getFeedbackList(
        page ? parseInt(page as string) : 1,
        pageSize ? parseInt(pageSize as string) : 20,
        status as string
      );

      success(ctx, result);
    } catch (err) {
      logger.error('获取反馈列表失败', err);
      error(ctx, err);
    }
  };

  updateFeedbackStatus = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { status, reply } = ctx.request.body;

      await this.feedbackService.updateFeedbackStatus(id, status, reply);

      success(ctx, { message: '反馈状态更新成功' });
    } catch (err) {
      logger.error('更新反馈状态失败', err);
      error(ctx, err);
    }
  };
}

export default FeedbackController;
