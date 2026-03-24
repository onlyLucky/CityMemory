import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

export class Level extends Model {
  public id!: string;
  public levelName!: string;
  public levelType!: string;
  public region!: string;
  public regionTheme!: string;
  public difficulty!: number;
  public questionCount!: number;
  public unlockCondition!: string;
  public status!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Level.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    levelName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '关卡名称',
    },
    levelType: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '类型：province/country',
    },
    region: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '区域名称',
    },
    regionTheme: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: '区域主题：亚洲/中东/欧洲/非洲/美洲',
    },
    difficulty: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '难度：1-5',
    },
    questionCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      comment: '题目数量',
    },
    unlockCondition: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '解锁条件（JSON）',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：1启用/0禁用',
    },
  },
  {
    sequelize,
    tableName: 'level_info',
    timestamps: true,
    indexes: [
      {
        fields: ['levelType'],
      },
      {
        fields: ['region'],
      },
      {
        fields: ['regionTheme'],
      },
      {
        fields: ['difficulty'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Level;
