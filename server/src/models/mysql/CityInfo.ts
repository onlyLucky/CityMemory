import { Model, Column, Table, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import ProvinceInfo from './ProvinceInfo';

@Table({
  tableName: 'city_info',
  timestamps: true,
})
export default class CityInfo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => ProvinceInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '所属省份ID',
  })
  provinceId!: number;

  @BelongsTo(() => ProvinceInfo)
  province!: ProvinceInfo;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '城市名称',
  })
  cityName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: '城市英文名',
  })
  cityNameEn!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '城市简介',
  })
  description!: string;

  @Column({
    type: DataType.DECIMAL(10, 7),
    allowNull: true,
    comment: '纬度',
  })
  latitude!: number;

  @Column({
    type: DataType.DECIMAL(10, 7),
    allowNull: true,
    comment: '经度',
  })
  longitude!: number;

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
