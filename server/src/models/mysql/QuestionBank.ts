import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import LevelInfo from './LevelInfo';

@Table({
  tableName: 'question_bank',
  timestamps: true,
})
export default class QuestionBank extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => LevelInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '关卡ID',
  })
  levelId!: number;

  @BelongsTo(() => LevelInfo)
  level!: LevelInfo;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    comment: '题目类型：1单选 2多选 3判断 4填空 5图片选择 6音频选择',
  })
  questionType!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '题目内容',
  })
  questionText!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: '选项A',
  })
  optionA!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: '选项B',
  })
  optionB!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '选项C',
  })
  optionC!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '选项D',
  })
  optionD!: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    comment: '正确答案',
  })
  correctAnswer!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '答案解析',
  })
  explanation!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '图片URL',
  })
  imageUrl!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '音频URL',
  })
  audioUrl!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '难度：1简单 2中等 3困难 4专家',
  })
  difficulty!: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '状态：0禁用 1启用',
  })
  status!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'create_time',
  })
  createTime!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'update_time',
  })
  updateTime!: Date;
}
