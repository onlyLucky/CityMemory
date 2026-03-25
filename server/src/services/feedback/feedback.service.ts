import UserFeedback from '../../models/mysql/UserFeedback';
import { ERROR_CODES, AppError } from '../../constants/error';
import { FeedbackInput, Feedback as FeedbackType } from '../../types/feedback';

export class FeedbackService {
  async submit(userId: number, data: FeedbackInput): Promise<FeedbackType> {
    const feedback = await UserFeedback.create({
      userId,
      feedbackType: data.feedbackType,
      title: data.title,
      content: data.content,
      images: data.images ? data.images.join(',') : '',
      status: 0,
    });

    return {
      id: feedback.id,
      feedbackType: feedback.feedbackType,
      title: feedback.title,
      content: feedback.content,
      status: feedback.status,
      createTime: feedback.createTime,
    };
  }

  async getList(userId: number, page: number = 1, pageSize: number = 20) {
    const { count, rows } = await UserFeedback.findAndCountAll({
      where: { userId },
      order: [['createTime', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return {
      list: rows.map((f) => ({
        id: f.id,
        feedbackType: f.feedbackType,
        title: f.title,
        status: f.status,
        createTime: f.createTime,
      })),
      total: count,
      page,
      pageSize,
    };
  }
}

export default new FeedbackService();
