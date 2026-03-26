import { Model, Column, Table, DataType, CreatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'admin_log',
  timestamps: false,
})
export default class AdminLog extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '管理员ID',
  })
  adminId!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '管理员名称',
  })
  adminName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '操作类型',
  })
  action!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '操作模块',
  })
  module!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: '操作对象',
  })
  target!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '操作详情',
  })
  detail!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'IP地址',
  })
  ip!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'User-Agent',
  })
  userAgent!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'create_time',
    defaultValue: DataType.NOW,
  })
  createTime!: Date;
}
