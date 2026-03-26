import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import CountryInfo from './CountryInfo';

@Table({
  tableName: 'region_info',
  timestamps: true,
})
export default class RegionInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '区域名称',
  })
  regionName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '区域英文名',
  })
  regionNameEn!: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    comment: '区域类型：1国家 2省份 3城市',
  })
  regionType!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '区域描述',
  })
  description!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '封面图片',
  })
  coverImage!: string;

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
    defaultValue: 1,
    comment: '状态：0禁用 1启用',
  })
  status!: number;

  @HasMany(() => CountryInfo)
  countries!: CountryInfo[];

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
