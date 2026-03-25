import { Context } from 'koa';
import UserService from '../../services/user/user.service';
import { success, error } from '../../utils/response';
import { ErrorCode } from '../../types/enums';

class UserController {
  async login(ctx: Context) {
    const data = ctx.validatedData as {
      code: string;
      nickname?: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
    };

    const result = await UserService.login(
      {
        code: data.code,
        nickname: data.nickname,
        avatar: data.avatar,
        gender: data.gender,
        province: data.province,
        city: data.city,
        country: data.country,
      },
      ctx.ip,
    );

    success(ctx, result, '登录成功');
  }

  async getProfile(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const profile = await UserService.getProfile(userId);
    success(ctx, profile);
  }

  async updateProfile(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      nickname?: string;
      avatar?: string;
      gender?: number;
      province?: string;
      city?: string;
      country?: string;
    };

    const profile = await UserService.updateProfile(userId, data);
    success(ctx, profile, '更新成功');
  }

  async initProvince(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as { province: string };

    const result = await UserService.initProvince(userId, data.province);
    success(ctx, result, '初始化成功');
  }

  async getTickets(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const tickets = await UserService.getTickets(userId);
    success(ctx, tickets);
  }

  async recoverTicket(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const result = await UserService.recoverTicket(userId);
    success(ctx, result);
  }

  async getUserItems(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const items = await UserService.getUserItems(userId);
    success(ctx, items);
  }

  async getProgress(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const progress = await UserService.getProgress(userId);
    success(ctx, progress);
  }
}

export default new UserController();
