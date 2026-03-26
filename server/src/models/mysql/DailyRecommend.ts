import { Model, Column, Table, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'daily_recommend',
  timestamps: true,
})
export default class DailyRecommend extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: '标题',
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '内容',
  })
  content!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '图片URL',
  })
  imageUrl!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '跳转链接',
  })
  linkUrl!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    comment: '开始日期',
  })
  startDate!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    comment: '结束日期',
  })
  endDate!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序',
  })
  sortOrder!: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '状态：0草稿 1已发布 2已过期',
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
