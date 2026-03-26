import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import CountryInfo from './CountryInfo';
import CityInfo from './CityInfo';

@Table({
  tableName: 'province_info',
  timestamps: true,
})
export default class ProvinceInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => CountryInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '所属国家ID',
  })
  countryId!: number;

  @BelongsTo(() => CountryInfo)
  country!: CountryInfo;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '省份名称',
  })
  provinceName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '省份英文名',
  })
  provinceNameEn!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '省份简介',
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

  @HasMany(() => CityInfo)
  cities!: CityInfo[];

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
