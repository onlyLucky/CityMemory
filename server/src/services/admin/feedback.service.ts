import UserFeedback from '../../models/mysql/UserFeedback';
import UserInfo from '../../models/mysql/UserInfo';
import { ERROR_CODES, AppError } from '../../constants/error';
import { Op } from 'sequelize';

export class AdminFeedbackService {
  async getList(
    page: number = 1,
    pageSize: number = 20,
    type?: number,
    status?: number,
  ) {
    const where: any = {};

    if (type) {
      where.feedbackType = type;
    }

    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await UserFeedback.findAndCountAll({
      where,
      include: [{ model: UserInfo, attributes: ['id', 'nickname', 'avatar'] }],
      order: [['createTime', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const list = rows.map((fb) => ({
      id: fb.id,
      userId: fb.userId,
      user: fb.user
        ? {
            id: fb.user.id,
            nickname: fb.user.nickname,
            avatar: fb.user.avatar,
          }
        : null,
      feedbackType: fb.feedbackType,
      title: fb.title,
      content: fb.content,
      images: fb.images ? fb.images.split(',') : [],
      status: fb.status,
      reply: fb.reply,
      replyTime: fb.replyTime,
      createTime: fb.createTime,
    }));

    return { list, total: count };
  }

  async reply(feedbackId: number, status: number, reply: string, adminId: number) {
    const feedback = await UserFeedback.findByPk(feedbackId);
    if (!feedback) {
      throw new AppError(ERROR_CODES.NOT_FOUND, '反馈不存在');
    }

    await feedback.update({
      status,
      reply,
      replyTime: new Date(),
      replyAdminId: adminId,
    });
  }
}

export default new AdminFeedbackService();
