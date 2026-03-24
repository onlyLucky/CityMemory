import { Sequelize } from 'sequelize';
import { DB_CONFIG } from '@/constants/config';
import { logger } from '@/utils/logger';

const sequelize = new Sequelize({
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  database: DB_CONFIG.database,
  username: DB_CONFIG.user,
  password: DB_CONFIG.password,
  dialect: 'mysql',
  timezone: DB_CONFIG.timezone,
  logging: DB_CONFIG.logging ? logger.info.bind(logger) : false,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL数据库连接成功');
    await sequelize.sync({ alter: false });
    logger.info('MySQL数据库同步完成');
  } catch (error) {
    logger.error('MySQL数据库连接失败', error);
    throw error;
  }
};

export default sequelize;
