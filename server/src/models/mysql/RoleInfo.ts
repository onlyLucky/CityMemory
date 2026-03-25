import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import AdminInfo from './AdminInfo';

@Table({
  tableName: 'role_info',
  timestamps: true,
})
export default class RoleInfo extends Model {
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
    comment: '角色名称',
  })
  roleName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    comment: '角色编码',
  })
  roleCode!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '角色描述',
  })
  description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '权限列表，JSON格式',
  })
  permissions!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '状态：0禁用 1启用',
  })
  status!: number;

  @HasMany(() => AdminInfo)
  admins!: AdminInfo[];

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
