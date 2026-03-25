import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import QuestionBank from './QuestionBank';

@Table({
  tableName: 'level_info',
  timestamps: true,
})
export default class LevelInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    comment: '关卡编号',
  })
  levelNumber!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '区域ID（国家/省份/城市）',
  })
  regionId!: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    comment: '区域类型：1国家 2省份 3城市',
  })
  regionType!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: '区域名称',
  })
  regionName!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '难度：1简单 2中等 3困难 4专家',
  })
  difficulty!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: '题目数量',
  })
  questionCount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3,
    comment: '星星奖励',
  })
  starReward!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '解锁条件',
  })
  unlockCondition!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: '关卡描述',
  })
  description!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '状态：0禁用 1启用',
  })
  status!: number;

  @HasMany(() => QuestionBank)
  questions!: QuestionBank[];

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
