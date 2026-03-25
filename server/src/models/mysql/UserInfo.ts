import { Model, Column, Table, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'user_info',
  timestamps: true,
})
export default class UserInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    unique: true,
    comment: '微信openid',
  })
  openid!: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
    unique: true,
    comment: '微信unionid',
  })
  unionid!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '用户昵称',
  })
  nickname!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '头像URL',
  })
  avatar!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '性别：0未知 1男 2女',
  })
  gender!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '省份',
  })
  province!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '城市',
  })
  city!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '国家',
  })
  country!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5,
    comment: '门票数量',
  })
  ticketCount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '星星数量',
  })
  starCount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '当前关卡',
  })
  currentLevel!: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '状态：0正常 1封禁 2删除',
  })
  status!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: '最后登录时间',
  })
  lastLoginTime!: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '最后登录IP',
  })
  lastLoginIp!: string;

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
