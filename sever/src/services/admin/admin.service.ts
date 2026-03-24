import { Admin } from '@/models/mysql';
import { Role } from '@/models/mysql';
import { jwtUtil } from '@/config/jwt';
import { ERROR_CODE } from '@/constants/error';
import { throwErr } from '@/utils/response';
import { logger } from '@/utils/logger';
import type { IAdminInfo, IAdminLoginResult } from '@/types/admin';
import bcrypt from 'bcrypt';

export class AdminService {
  private adminModel: typeof Admin;
  private roleModel: typeof Role;

  constructor() {
    this.adminModel = Admin;
    this.roleModel = Role;
  }

  async login(username: string, password: string): Promise<IAdminLoginResult> {
    const admin = await this.adminModel.findOne({
      where: { username },
      include: [{ model: Role, as: 'role' }],
    });

    if (!admin) {
      throwErr(ERROR_CODE.ADMIN_NOT_FOUND);
    }

    if (admin.status !== 1) {
      throwErr(ERROR_CODE.ADMIN_LOCKED);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throwErr(ERROR_CODE.ADMIN_PASSWORD_ERROR);
    }

    const role = await this.roleModel.findByPk(admin.roleId);
    const permissions = role?.permissions || [];

    const token = jwtUtil.sign({
      id: admin.id,
      username: admin.username,
      role: 'admin',
      permissions,
    });

    await admin.update({
      lastLoginTime: new Date(),
      lastLoginIp: '127.0.0.1',
    });

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        realName: admin.realName,
        role: 'admin',
        avatar: admin.avatar || undefined,
        status: admin.status,
        permissions,
        lastLoginTime: admin.lastLoginTime || undefined,
        lastLoginIp: admin.lastLoginIp || undefined,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  async getAdminInfo(adminId: string): Promise<IAdminInfo> {
    const admin = await this.adminModel.findByPk(adminId);
    if (!admin) {
      throwErr(ERROR_CODE.ADMIN_NOT_FOUND);
    }

    const role = await this.roleModel.findByPk(admin.roleId);
    const permissions = role?.permissions || [];

    return {
      id: admin.id,
      username: admin.username,
      realName: admin.realName,
      role: 'admin',
      avatar: admin.avatar || undefined,
      status: admin.status,
      permissions,
      lastLoginTime: admin.lastLoginTime || undefined,
      lastLoginIp: admin.lastLoginIp || undefined,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}

export default AdminService;
