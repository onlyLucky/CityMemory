import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

export class Question extends Model {
  public id!: string;
  public questionType!: number;
  public questionContent!: string;
  public questionImage!: string | null;
  public options!: any;
  public correctAnswer!: string;
  public difficulty!: number;
  public region!: string;
  public status!: number;
  public usedCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    questionType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '题目类型：1-城市到省份 2-城市到国家 3-古地名到今地名 4-国旗到国家',
    },
    questionContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '题目内容',
    },
    questionImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '题目图片',
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '选项',
    },
    correctAnswer: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '正确答案',
    },
    difficulty: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '难度：1-5',
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '地区',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：1启用/0禁用/2待审核',
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '使用次数',
    },
  },
  {
    sequelize,
    tableName: 'question_bank',
    timestamps: true,
    indexes: [
      {
        fields: ['questionType'],
      },
      {
        fields: ['region'],
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

export default Question;
