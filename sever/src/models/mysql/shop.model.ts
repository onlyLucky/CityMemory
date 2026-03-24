import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

export class ShopItem extends Model {
  public id!: string;
  public itemName!: string;
  public itemType!: string;
  public starPrice!: number;
  public coinPrice!: number;
  public quantity!: number;
  public icon!: string | null;
  public description!: string | null;
  public status!: number;
  public sort!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShopItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '商品名称',
    },
    itemType: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '商品类型：ticket/item',
    },
    starPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '星星价格',
    },
    coinPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '金币价格',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '商品数量',
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '商品图标',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '商品描述',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：1上架/0下架',
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序',
    },
  },
  {
    sequelize,
    tableName: 'shop_item',
    timestamps: true,
    indexes: [
      {
        fields: ['itemType'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['sort'],
      },
    ],
  }
);

export default ShopItem;
