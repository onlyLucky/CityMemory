import 'reflect-metadata';
import Koa from 'koa';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import logger from 'koa-logger';
import koaBody from 'koa-body';
import serve from 'koa-static';
import path from 'path';
import { koaSwagger } from 'koa2-swagger-ui';
import config from './config';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import router from './routes';
import { initDatabase } from './config/database';
import { initMongoDB } from './config/mongodb';
import { initRedis } from './config/redis';
import { logger as appLogger } from './config/logger';
import swaggerSpec from './config/swagger';

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

    app.use(
      // 使用Helmet中间件增强安全性，设置HTTP响应头
      helmet({
        // 内容安全策略(CSP)配置，防止XSS攻击
        contentSecurityPolicy: {
          directives: {
            // 默认资源加载策略：只允许同源资源
            defaultSrc: ["'self'"],
            // 脚本加载策略：允许同源、内联脚本、eval和指定CDN
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdnjs.cloudflare.com'],
            // 样式加载策略：允许同源、内联样式和指定CDN
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            // 图片加载策略：允许同源、data URI和HTTPS图片
            imgSrc: ["'self'", 'data:', 'https:'],
            // 字体加载策略：允许同源和指定CDN字体
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
            // 连接请求策略：只允许同源请求
            connectSrc: ["'self'"],
          },
        },
      }),
    );

    app.use(
      compress({
        filter: (contentType) => {
          return /text|json|javascript|css/i.test(contentType);
        },
        threshold: 2048,
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

    app.use(
      koaSwagger({
        routePrefix: '/api-docs',
        swaggerOptions: {
          url: '/api-docs.json',
        },
        hideTopbar: true,
        title: '城迹 API 文档',
      }),
    );

    app.use(async (ctx, next) => {
      if (ctx.path === '/api-docs.json') {
        ctx.body = swaggerSpec;
        return;
      }
      await next();
    });

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
