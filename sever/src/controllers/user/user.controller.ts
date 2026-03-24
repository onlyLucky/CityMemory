import { Context } from 'koa';
import { UserService } from '@/services/user/user.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  login = async (ctx: Context) => {
    try {
      const { code } = ctx.request.body;

      const result = await this.userService.login(code);

      success(ctx, result);
    } catch (err) {
      logger.error('用户登录失败', err);
      error(ctx, err);
    }
  };

  getUserInfo = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;

      const userInfo = await this.userService.getUserInfo(userId);

      success(ctx, userInfo);
    } catch (err) {
      logger.error('获取用户信息失败', err);
      error(ctx, err);
    }
  };

  updateUser = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const updateData = ctx.request.body;

      const userInfo = await this.userService.updateUser(userId, updateData);

      success(ctx, userInfo);
    } catch (err) {
      logger.error('更新用户信息失败', err);
      error(ctx, err);
    }
  };

  initProvince = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const params = ctx.request.body;

      const result = await this.userService.initProvince(userId, params);

      success(ctx, result);
    } catch (err) {
      logger.error('初始化省份失败', err);
      error(ctx, err);
    }
  };

  getTicketStatus = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;

      const ticketStatus = await this.userService.getTicketStatus(userId);

      success(ctx, ticketStatus);
    } catch (err) {
      logger.error('获取门票状态失败', err);
      error(ctx, err);
    }
  };

  useTicket = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id;
      const { type } = ctx.request.body;

      await this.userService.useTicket(userId, type);

      success(ctx, { message: '门票使用成功' });
    } catch (err) {
      logger.error('使用门票失败', err);
      error(ctx, err);
    }
  };
}

export default UserController;
