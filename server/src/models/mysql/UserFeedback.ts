import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import UserInfo from './UserInfo';

@Table({
  tableName: 'user_feedback',
  timestamps: true,
})
export default class UserFeedback extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => UserInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '用户ID',
  })
  userId!: number;

  @BelongsTo(() => UserInfo)
  user!: UserInfo;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    comment: '反馈类型：1Bug 2建议 3投诉 4其他',
  })
  feedbackType!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: '反馈标题',
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '反馈内容',
  })
  content!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: '图片URLs，逗号分隔',
  })
  images!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '状态：0待处理 1处理中 2已解决 3已关闭',
  })
  status!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '回复内容',
  })
  reply!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: '回复时间',
  })
  replyTime!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: '回复人ID',
  })
  replyAdminId!: number;

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
