import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import RegionInfo from './RegionInfo';
import ProvinceInfo from './ProvinceInfo';

@Table({
  tableName: 'country_info',
  timestamps: true,
})
export default class CountryInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => RegionInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '所属区域ID',
  })
  regionId!: number;

  @BelongsTo(() => RegionInfo)
  region!: RegionInfo;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '国家名称',
  })
  countryName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '国家英文名',
  })
  countryNameEn!: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    comment: '国家代码',
  })
  countryCode!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '国旗图片',
  })
  flagImage!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '国家简介',
  })
  description!: string;

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

  @HasMany(() => ProvinceInfo)
  provinces!: ProvinceInfo[];

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
