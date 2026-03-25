import AdminInfo from '../../models/mysql/AdminInfo';
import AdminLog from '../../models/mysql/AdminLog';
import RoleInfo from '../../models/mysql/RoleInfo';
import { ERROR_CODES, AppError } from '../../constants/error';
import { ADMIN_STATUS } from '../../constants/status';
import { generateToken } from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/crypto';
import { generateCaptcha, verifyCaptcha } from '../../utils/captcha';
import { redisUtils } from '../../config/redis';
import { logger } from '../../config/logger';

export class AuthService {
  async login(
    username: string,
    password: string,
    captchaId: string,
    captchaCode: string,
    ip: string,
  ) {
    const isValidCaptcha = await verifyCaptcha(captchaId, captchaCode);
    if (!isValidCaptcha) {
    throw new AppError(ERROR_CODES.INVALID_CAPTCHA, '验证码错误');
  }

    const admin = await AdminInfo.findOne({
      where: { username },
      include: [{ model: RoleInfo }],
    });

    if (!admin) {
      throw new AppError(ERROR_CODES.ADMIN_NOT_FOUND, '管理员不存在');
    }

    if (admin.status === ADMIN_STATUS.DISABLED) {
      throw new AppError(ERROR_CODES.ADMIN_DISABLED, '账号已禁用');
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError(ERROR_CODES.PASSWORD_ERROR, '密码错误');
    }

    await admin.update({
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    });

    await AdminLog.create({
      adminId: admin.id,
      adminName: admin.nickname || admin.username,
      action: 'login',
      module: 'auth',
      target: '登录系统',
      detail: '管理员登录',
      ip,
    });

    const token = generateToken({
      userId: String(admin.id),
      type: 'admin',
    });

    await redisUtils.set(`admin:token:${admin.id}`, token, 7 * 24 * 60 * 60);

    return {
      token,
      adminInfo: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        avatar: admin.avatar,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
          ? {
              id: admin.role.id,
              roleName: admin.role.roleName,
              roleCode: admin.role.roleCode,
              permissions: admin.role.permissions ? JSON.parse(admin.role.permissions) : [],
            }
          : null,
      },
    };
  }

  async getCaptcha() {
    return generateCaptcha();
  }

  async getProfile(adminId: number) {
    const admin = await AdminInfo.findByPk(adminId, {
      include: [{ model: RoleInfo }],
    });

    if (!admin) {
      throw new AppError(ERROR_CODES.ADMIN_NOT_FOUND, '管理员不存在');
    }

    return {
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname,
      avatar: admin.avatar,
      email: admin.email,
      phone: admin.phone,
      role: admin.role
        ? {
            id: admin.role.id,
            roleName: admin.role.roleName,
            roleCode: admin.role.roleCode,
            permissions: admin.role.permissions ? JSON.parse(admin.role.permissions) : [],
          }
        : null,
      lastLoginTime: admin.lastLoginTime,
      createTime: admin.createTime,
    };
  }

  async changePassword(adminId: number, oldPassword: string, newPassword: string) {
    const admin = await AdminInfo.findByPk(adminId);
    if (!admin) {
      throw new AppError(ERROR_CODES.ADMIN_NOT_FOUND, '管理员不存在');
    }

    const isPasswordValid = await comparePassword(oldPassword, admin.password);
    if (!isPasswordValid) {
      throw new AppError(ERROR_CODES.PASSWORD_ERROR, '原密码错误');
    }

    const hashedPassword = await hashPassword(newPassword);
    await admin.update({ password: hashedPassword });

    await redisUtils.del(`admin:token:${adminId}`);
  }

  async logout(adminId: number) {
    await redisUtils.del(`admin:token:${adminId}`);
  }
}

export default new AuthService();
