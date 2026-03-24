import { Feedback } from '@/models/mysql';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { IFeedback, ISubmitFeedbackParams } from '@/types/feedback';

export class FeedbackService {
  private feedbackModel: typeof Feedback;

  constructor() {
    this.feedbackModel = Feedback;
  }

  async submitFeedback(userId: string, params: ISubmitFeedbackParams): Promise<IFeedback> {
    const feedback = await this.feedbackModel.create({
      userId,
      feedbackType: params.type,
      content: params.content,
      images: params.images ? JSON.stringify(params.images) : null,
      status: 'pending',
    });

    return {
      id: feedback.id,
      userId: feedback.userId,
      type: feedback.feedbackType,
      content: feedback.content,
      images: feedback.images ? JSON.parse(feedback.images) : undefined,
      status: feedback.status,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }

  async getFeedbackList(page = 1, pageSize = 20, status?: string): Promise<{ list: IFeedback[]; total: number }> {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await this.feedbackModel.findAndCountAll({
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']],
    });

    return {
      list: rows.map((f) => ({
        id: f.id,
        userId: f.userId,
        type: f.feedbackType,
        content: f.content,
        images: f.images ? JSON.parse(f.images) : undefined,
        status: f.status,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
      total: count,
    };
  }

  async updateFeedbackStatus(feedbackId: string, status: string, reply?: string): Promise<void> {
    const feedback = await this.feedbackModel.findByPk(feedbackId);
    if (!feedback) {
      throwErr(ERROR_CODE.NOT_FOUND, '反馈不存在');
    }

    await feedback.update({
      status,
      reply: reply || null,
    });
  }
}

export default FeedbackService;
