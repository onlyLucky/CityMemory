import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

export class Feedback extends Model {
  public id!: string;
  public userId!: string;
  public feedbackType!: string;
  public content!: string;
  public images!: string | null;
  public status!: string;
  public reply!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '用户ID',
    },
    feedbackType: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: '反馈类型：suggestion/bug/complaint/other',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '反馈内容',
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '反馈图片（JSON数组）',
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'pending',
      comment: '状态：pending/processed/closed',
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '回复内容',
    },
  },
  {
    sequelize,
    tableName: 'user_feedback',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['feedbackType'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Feedback;
