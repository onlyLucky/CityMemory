import app from './app';
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';
import { connectMongoDB } from '@/config/mongodb';
import { logger } from '@/config/logger';
import { CONFIG } from '@/constants/config';

const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();
    await connectMongoDB();

    const server = app.listen(CONFIG.PORT, () => {
      logger.info(`服务器启动成功，端口：${CONFIG.PORT}`);
      logger.info(`环境：${CONFIG.NODE_ENV}`);
    });

    server.on('error', (error) => {
      logger.error('服务器错误', error);
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      logger.info('收到SIGTERM信号，正在关闭服务器...');
      server.close(() => {
        logger.info('服务器已关闭');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('收到SIGINT信号，正在关闭服务器...');
      server.close(() => {
        logger.info('服务器已关闭');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('服务器启动失败', error);
    process.exit(1);
  }
};

startServer();
