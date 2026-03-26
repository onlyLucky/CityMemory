import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import UserItem from './UserItem';

@Table({
  tableName: 'shop_item',
  timestamps: true,
})
export default class ShopItem extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    comment: '商品类型：1门票 2提示 3跳过 4时间延长 5护盾',
  })
  itemType!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '商品名称',
  })
  itemName!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '商品描述',
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '价格（星星）',
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: '原价（星星）',
  })
  originalPrice!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '商品图片',
  })
  imageUrl!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '效果说明',
  })
  effect!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: -1,
    comment: '库存：-1表示无限',
  })
  stock!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: -1,
    comment: '每日限购：-1表示无限',
  })
  dailyLimit!: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '状态：0下架 1上架 2售罄',
  })
  status!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序',
  })
  sortOrder!: number;

  @HasMany(() => UserItem)
  userItems!: UserItem[];

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
