import 'reflect-metadata';
import Koa from 'koa';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import logger from 'koa-logger';
import koaBody from 'koa-body';
import serve from 'koa-static';
import path from 'path';
import config from './config';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import router from './routes';
import { initDatabase } from './config/database';
import { initMongoDB } from './config/mongodb';
import { initRedis } from './config/redis';
import { logger as appLogger } from './config/logger';

const app = new Koa();

const initApp = async () => {
  try {
    appLogger.info('正在初始化应用...');

    await initDatabase();
    appLogger.info('MySQL数据库连接成功');

    await initMongoDB();
    appLogger.info('MongoDB数据库连接成功');

    await initRedis();
    appLogger.info('Redis连接成功');

    app.use(errorMiddleware);

    if (config.app.nodeEnv === 'development') {
      app.use(logger());
    }

    app.use(loggerMiddleware);

    app.use(
      cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
      }),
    );

    app.use(helmet());

    app.use(
      compress({
        filter: (contentType) => {
          return /text|json|javascript|css/i.test(contentType);
        },
        threshold: 2048,
        flush: require('zlib').constants.Z_SYNC_FLUSH,
      }),
    );

    app.use(
      koaBody({
        multipart: true,
        formidable: {
          maxFileSize: config.upload.maxFileSize,
          uploadDir: path.resolve(__dirname, '../', config.upload.dir),
          keepExtensions: true,
        },
        json: true,
        jsonLimit: '10mb',
        formLimit: '10mb',
        text: true,
        textLimit: '10mb',
      }),
    );

    const uploadDir = path.resolve(__dirname, '../', config.upload.dir);
    app.use(serve(uploadDir));

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.use(async (ctx) => {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '接口不存在',
        data: null,
        timestamp: Date.now(),
      };
    });

    const server = app.listen(config.app.port, config.app.host, () => {
      appLogger.info(`服务器启动成功，监听 ${config.app.host}:${config.app.port}`);
      appLogger.info(`环境: ${config.app.nodeEnv}`);
    });

    const gracefulShutdown = () => {
      appLogger.info('正在关闭服务器...');
      server.close(() => {
        appLogger.info('服务器已关闭');
        process.exit(0);
      });

      setTimeout(() => {
        appLogger.error('强制关闭服务器');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    process.on('uncaughtException', (error) => {
      appLogger.error('未捕获的异常:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      appLogger.error('未处理的Promise拒绝:', { reason, promise });
    });

    return app;
  } catch (error) {
    appLogger.error('应用初始化失败:', error);
    process.exit(1);
  }
};

initApp();

export default app;
