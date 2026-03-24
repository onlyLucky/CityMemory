import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { cryptoUtil } from '@/utils/crypto';

export class User extends Model {
  public id!: string;
  public openid!: string;
  public nickname!: string;
  public avatar!: string;
  public province!: string;
  public totalStars!: number;
  public levelCount!: number;
  public coins!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '微信openid',
    },
    nickname: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      comment: '用户昵称',
    },
    avatar: {
      type: DataTypes.STRING(256),
      allowNull: false,
      defaultValue: '',
      comment: '用户头像URL',
    },
    province: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
      comment: '用户选择省份',
    },
    totalStars: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: false,
      defaultValue: 0,
      comment: '总星星数',
    },
    levelCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '已通关卡数',
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '金币数',
    },
  },
  {
    sequelize,
    tableName: 'user_info',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['openid'],
      },
      {
        fields: ['province'],
      },
      {
        fields: ['totalStars'],
      },
    ],
  }
);

export default User;
