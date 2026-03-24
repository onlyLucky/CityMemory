import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { logger } from '@/config/logger';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { loggerMiddleware } from '@/middlewares/logger.middleware';
import routes from '@/routes';
import { CONFIG } from '@/constants/config';

const app = new Koa();

app.use(cors());
app.use(bodyParser({
  enableTypes: ['json', 'form'],
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb',
}));

app.use(loggerMiddleware);
app.use(errorMiddleware);

app.use(routes.routes());
app.use(routes.allowedMethods());

app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    code: 404,
    message: '接口不存在',
    data: null,
  };
});

export default app;
