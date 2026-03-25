import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import RoleInfo from './RoleInfo';

@Table({
  tableName: 'admin_info',
  timestamps: true,
})
export default class AdminInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名',
  })
  username!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: '密码（加密）',
  })
  password!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '昵称',
  })
  nickname!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '头像URL',
  })
  avatar!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: '邮箱',
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    comment: '手机号',
  })
  phone!: string;

  @ForeignKey(() => RoleInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 2,
    comment: '角色ID',
  })
  roleId!: number;

  @BelongsTo(() => RoleInfo)
  role!: RoleInfo;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '状态：0正常 1禁用 2删除',
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
