import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

export class Role extends Model {
  public id!: string;
  public roleName!: string;
  public description!: string | null;
  public permissions!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '角色名称',
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: '角色描述',
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '权限配置',
    },
  },
  {
    sequelize,
    tableName: 'role',
    timestamps: true,
  }
);

export default Role;
