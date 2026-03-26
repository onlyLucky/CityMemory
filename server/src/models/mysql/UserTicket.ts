import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import UserInfo from './UserInfo';

@Table({
  tableName: 'user_ticket',
  timestamps: true,
})
export default class UserTicket extends Model {
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
    type: DataType.INTEGER,
    allowNull: false,
    comment: '门票变动数量',
  })
  changeAmount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '变动后余额',
  })
  balance!: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    comment: '变动类型：1购买 2消耗 3系统赠送 4关卡奖励',
  })
  changeType!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '变动说明',
  })
  remark!: string;

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
