import 'reflect-metadata';
import app from './app';
import { initDatabase } from './config/database';
import { initMongoDB } from './config/mongodb';
import { initRedis } from './config/redis';
import { logger } from './config/logger';
import config from './config';

const PORT = config.app.port;
const HOST = config.app.host;

async function startServer() {
  try {
    logger.info('正在启动服务器...');

    await initDatabase();
    logger.info('MySQL数据库连接成功');

    await initMongoDB();
    logger.info('MongoDB数据库连接成功');

    await initRedis();
    logger.info('Redis连接成功');

    const server = app.listen(PORT, HOST, () => {
      logger.info(`服务器启动成功，监听 ${HOST}:${PORT}`);
      logger.info(`环境: ${config.app.nodeEnv}`);
      logger.info(`API文档: http://${HOST}:${PORT}/api/v1/health`);
    });

    const gracefulShutdown = () => {
      logger.info('正在关闭服务器...');
      server.close(() => {
        logger.info('服务器已关闭');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('强制关闭服务器');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    process.on('uncaughtException', (error) => {
      logger.error('未捕获的异常:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('未处理的Promise拒绝:', { reason, promise });
    });

    return server;
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
