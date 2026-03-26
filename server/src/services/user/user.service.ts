import axios from 'axios';
import config from '../../config';
import { ERROR_CODES, AppError } from '../../constants/error';
import { USER_STATUS } from '../../constants/status';
import { generateToken } from '../../utils/jwt';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../config/logger';
import UserInfo from '../../models/mysql/UserInfo';
import UserTicket from '../../models/mysql/UserTicket';
import { UserProgress } from '../../models/mongodb';
import { WechatSessionResponse } from '../../types/common';
import { UserLoginInput } from '../../types/user';

export class UserService {
  async login(data: UserLoginInput, ip: string) {
    const { code, nickname, avatar, gender, province, city, country } = data;

    const wechatResponse = await this.getWechatOpenid(code);
    const { openid, session_key, unionid } = wechatResponse;

    let user = await UserInfo.findOne({ where: { openid } });

    if (!user) {
      user = await UserInfo.create({
        openid,
        unionid,
        nickname: nickname || '微信用户',
        avatar: avatar || '',
        gender: gender || 0,
        province: province || '',
        city: city || '',
        country: country || '',
        ticketCount: config.game.initialTickets,
        starCount: 0,
        currentLevel: 1,
        status: USER_STATUS.NORMAL,
        lastLoginTime: new Date(),
        lastLoginIp: ip,
      });

      await UserProgress.create({
        userId: user.id,
        levelProgress: new Map(),
        totalStars: 0,
        totalCorrect: 0,
        totalWrong: 0,
        accuracy: 0,
      });
    } else {
      if (user.status === USER_STATUS.BANNED) {
        throw new AppError(ERROR_CODES.USER_BANNED, '账号已被封禁');
      }

      const updateData: Partial<UserInfo> = {
        lastLoginTime: new Date(),
        lastLoginIp: ip,
      };

      if (nickname) updateData.nickname = nickname;
      if (avatar) updateData.avatar = avatar;
      if (gender !== undefined) updateData.gender = gender;
      if (province) updateData.province = province;
      if (city) updateData.city = city;
      if (country) updateData.country = country;
      if (unionid) updateData.unionid = unionid;

      await user.update(updateData);
    }

    const token = generateToken({
      userId: String(user.id),
      openid: user.openid,
      type: 'user',
    });

    return {
      token,
      userInfo: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        province: user.province,
        city: user.city,
        country: user.country,
        ticketCount: user.ticketCount,
        starCount: user.starCount,
        currentLevel: user.currentLevel,
      },
    };
  }

  private async getWechatOpenid(code: string): Promise<WechatSessionResponse> {
    const url = config.wechat.loginUrl;
    const params = {
      appid: config.wechat.appId,
      secret: config.wechat.secret,
      js_code: code,
      grant_type: config.wechat.grantType,
    };

    try {
      const response = await axios.get<WechatSessionResponse>(url, { params });
      const data = response.data;

      if (data.errcode) {
        logger.error('微信登录失败:', data);
        throw new AppError(ERROR_CODES.WECHAT_AUTH_FAILED, data.errmsg || '微信授权失败');
      }

      return data;
    } catch (err) {
      logger.error('微信接口调用失败:', err);
      throw new AppError(ERROR_CODES.WECHAT_AUTH_FAILED, '微信授权失败');
    }
  }

  async getProfile(userId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      province: user.province,
      city: user.city,
      country: user.country,
      ticketCount: user.ticketCount,
      starCount: user.starCount,
      currentLevel: user.currentLevel,
      lastLoginTime: user.lastLoginTime,
      createTime: user.createTime,
    };
  }

  async updateProfile(userId: number, data: Partial<UserInfo>) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const updateData: Partial<UserInfo> = {};
    if (data.nickname) updateData.nickname = data.nickname;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.province) updateData.province = data.province;
    if (data.city) updateData.city = data.city;
    if (data.country) updateData.country = data.country;

    await user.update(updateData);

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      province: user.province,
      city: user.city,
      country: user.country,
    };
  }

  async initProvince(userId: number, province: string) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    await user.update({ province });
    return { province };
  }

  async getTickets(userId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const records = await UserTicket.findAll({
      where: { userId },
      order: [['createTime', 'DESC']],
      limit: 20,
    });

    return {
      currentTickets: user.ticketCount,
      records: records.map((r) => ({
        id: r.id,
        changeAmount: r.changeAmount,
        balance: r.balance,
        changeType: r.changeType,
        remark: r.remark,
        createTime: r.createTime,
      })),
    };
  }

  async recoverTicket(userId: number): Promise<{ recovered: boolean; message: string; currentTickets?: number }> {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    if (user.ticketCount >= config.game.maxTickets) {
    return {
      recovered: false,
      message: '门票已满',
      currentTickets: user.ticketCount,
    };
    }

    await user.update({ ticketCount: user.ticketCount + 1 });

    await UserTicket.create({
      userId,
      changeAmount: 1,
      balance: user.ticketCount + 1,
      changeType: 3,
      remark: '门票自动恢复',
    });

    return {
      recovered: true,
      message: '门票恢复成功',
      currentTickets: user.ticketCount + 1,
    };
  }

  async getUserItems(userId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const UserItem = require('../../models/mysql/UserItem').default;
    const items = await UserItem.findAll({
      where: { userId },
      order: [['createTime', 'DESC']],
    });

    return items.map((item: any) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      itemType: item.itemType,
      quantity: item.quantity,
      createTime: item.createTime,
    }));
  }

  async getProgress(userId: number) {
    const user = await UserInfo.findByPk(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, '用户不存在');
    }

    const progress = await UserProgress.findOne({ where: { userId } });

    if (!progress) {
      return {
        totalStars: 0,
        totalCorrect: 0,
        totalWrong: 0,
        accuracy: 0,
        levelProgress: {},
      };
    }

    return {
      totalStars: progress.totalStars,
      totalCorrect: progress.totalCorrect,
      totalWrong: progress.totalWrong,
      accuracy: Math.round(progress.accuracy * 100) / 100,
      levelProgress: progress.levelProgress,
    };
  }
}

export default new UserService();
