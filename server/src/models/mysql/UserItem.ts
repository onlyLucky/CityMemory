import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import UserInfo from './UserInfo';
import ShopItem from './ShopItem';

@Table({
  tableName: 'user_item',
  timestamps: true,
})
export default class UserItem extends Model {
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

  @ForeignKey(() => ShopItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '商品ID',
  })
  itemId!: number;

  @BelongsTo(() => ShopItem)
  item!: ShopItem;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '拥有数量',
  })
  quantity!: number;

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
