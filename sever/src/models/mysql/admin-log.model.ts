import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

export class AdminLog extends Model {
  public id!: string;
  public adminId!: string;
  public adminName!: string;
  public actionType!: string;
  public module!: string;
  public content!: string | null;
  public ipAddress!: string;
  public readonly createdAt!: Date;
}

AdminLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '管理员ID',
    },
    adminName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '管理员账号',
    },
    actionType: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '操作类型',
    },
    module: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '操作模块',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '操作内容',
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'IP地址',
    },
  },
  {
    sequelize,
    tableName: 'admin_log',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['adminId'],
      },
      {
        fields: ['module'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default AdminLog;
