import { Sequelize } from 'sequelize-typescript';
import config from './index';

let sequelize: Sequelize | null = null;

export const initDatabase = async (): Promise<Sequelize> => {
  if (sequelize) {
    return sequelize;
  }

  sequelize = new Sequelize({
    database: config.mysql.database,
    dialect: 'mysql',
    host: config.mysql.host,
    port: config.mysql.port,
    username: config.mysql.user,
    password: config.mysql.password,
    logging: false,
    pool: {
      max: config.mysql.connectionLimit,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    timezone: '+08:00',
  });

  try {
    await sequelize.authenticate();
    console.log('MySQL数据库连接成功');
    return sequelize;
  } catch (error) {
    console.error('MySQL数据库连接失败:', error);
    throw error;
  }
};

export const getSequelize = (): Sequelize => {
  if (!sequelize) {
    throw new Error('数据库未初始化');
  }
  return sequelize;
};

export const closeDatabase = async (): Promise<void> => {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    console.log('MySQL数据库连接已关闭');
  }
};
