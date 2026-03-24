import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { cryptoUtil } from '@/utils/crypto';

export class Admin extends Model {
  public id!: string;
  public username!: string;
  public password!: string;
  public realName!: string;
  public roleId!: string;
  public avatar!: string | null;
  public status!: number;
  public lastLoginTime!: Date | null;
  public lastLoginIp!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      comment: '登录账号',
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '密码（加密）',
    },
    realName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '真实姓名',
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '角色ID',
    },
    avatar: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: '头像',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：1启用/0禁用',
    },
    lastLoginTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间',
    },
    lastLoginIp: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: '最后登录IP',
    },
  },
  {
    sequelize,
    tableName: 'admin',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
      {
        fields: ['roleId'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Admin;
