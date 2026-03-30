# 城迹后端服务

基于 Node.js + Koa + TypeScript 的地理知识问答小游戏后端服务。

## 技术栈

- **运行环境**: Node.js 18.x+
- **Web框架**: Koa 2.x
- **类型系统**: TypeScript 5.0+
- **数据库**:
  - MySQL 8.0+ (关系型数据)
  - MongoDB 6.0+ (文档型数据)
  - Redis 7.0+ (缓存)
- **ORM/ODM**: Sequelize 6.x / Mongoose 7.x
- **认证**: JWT 9.x
- **日志**: Winston 3.x
- **验证**: Joi 17.x
- **包管理**: pnpm 8.x

## 项目结构

```
server/
├── src/
│   ├── config/           # 配置文件
│   │   ├── database.ts   # MySQL连接配置
│   │   ├── mongodb.ts    # MongoDB连接配置
│   │   ├── redis.ts      # Redis连接配置
│   │   ├── jwt.ts        # JWT配置
│   │   └── logger.ts     # 日志配置
│   ├── constants/        # 常量定义
│   │   ├── error.ts      # 错误码常量
│   │   ├── status.ts     # 状态码常量
│   │   └── config.ts     # 配置常量
│   ├── controllers/      # 控制器
│   │   ├── user/         # 用户控制器
│   │   ├── level/        # 关卡控制器
│   │   ├── question/     # 题目控制器
│   │   ├── shop/         # 商店控制器
│   │   ├── rank/         # 排行榜控制器
│   │   ├── feedback/     # 反馈控制器
│   │   └── admin/        # 后台管理控制器
│   ├── middlewares/      # 中间件
│   │   ├── auth.middleware.ts       # 用户认证中间件
│   │   ├── admin.middleware.ts      # 管理员认证中间件
│   │   ├── error.middleware.ts      # 错误处理中间件
│   │   ├── logger.middleware.ts     # 日志中间件
│   │   └── validate.middleware.ts   # 参数验证中间件
│   ├── models/           # 数据模型
│   │   ├── mysql/        # MySQL模型
│   │   └── mongodb/      # MongoDB模型
│   ├── routes/           # 路由
│   │   ├── user.routes.ts           # 用户路由
│   │   ├── level.routes.ts          # 关卡路由
│   │   ├── question.routes.ts       # 题目路由
│   │   ├── shop.routes.ts           # 商店路由
│   │   ├── rank.routes.ts           # 排行榜路由
│   │   ├── feedback.routes.ts       # 反馈路由
│   │   ├── admin/                   # 后台管理路由
│   │   └── index.ts                 # 路由入口
│   ├── services/         # 服务层
│   │   ├── user/         # 用户服务
│   │   ├── level/        # 关卡服务
│   │   ├── question/     # 题目服务
│   │   ├── shop/         # 商店服务
│   │   ├── rank/         # 排行榜服务
│   │   ├── feedback/     # 反馈服务
│   │   └── admin/        # 后台管理服务
│   ├── types/            # 类型定义
│   ├── utils/            # 工具函数
│   ├── validators/       # 验证器
│   ├── app.ts            # 应用实例
│   └── server.ts         # 服务器入口
├── docker/               # Docker配置
├── .env                  # 环境变量
├── docker-compose.yml    # Docker编排
├── package.json
└── tsconfig.json
```

## 快速开始

### 环境要求

- Node.js 18.x+
- pnpm 8.x+
- Docker & Docker Compose

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量
```

### 启动Docker服务

```bash
docker compose up -d mysql mongodb redis
```

### 运行开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
pnpm start
```

## API文档

### 基础路径

```
/api/v1
```

### 小程序端接口

| 模块 | 接口 | 说明 |
|------|------|------|
| 用户 | POST /user/login | 微信登录 |
| 用户 | GET /user/profile | 获取用户信息 |
| 用户 | PUT /user/profile | 更新用户信息 |
| 用户 | POST /user/init-province | 初始化省份 |
| 用户 | GET /user/tickets | 获取门票状态 |
| 用户 | POST /user/tickets/recover | 恢复门票 |
| 用户 | GET /user/items | 获取用户道具 |
| 用户 | GET /user/progress | 获取用户进度 |
| 关卡 | GET /level/regions | 获取区域列表 |
| 关卡 | GET /level/countries | 获取国家列表 |
| 关卡 | GET /level/provinces | 获取省份列表 |
| 关卡 | GET /level/cities | 获取城市列表 |
| 关卡 | GET /level | 获取关卡列表 |
| 关卡 | GET /level/:levelId | 获取关卡详情 |
| 关卡 | POST /level/:levelId/start | 开始关卡 |
| 关卡 | POST /level/:levelId/end | 结束关卡 |
| 关卡 | POST /level/:sessionId/abandon | 放弃关卡 |
| 题目 | POST /question/random | 获取随机题目 |
| 题目 | POST /question/submit | 提交答案 |
| 商店 | GET /shop | 获取商品列表 |
| 商店 | POST /shop/purchase | 购买商品 |
| 商店 | POST /shop/exchange-stars | 星星兑换 |
| 排行榜 | GET /rank | 获取排行榜 |
| 排行榜 | GET /rank/me | 获取我的排名 |
| 反馈 | POST /feedback | 提交反馈 |
| 反馈 | GET /feedback | 获取反馈列表 |
| 反馈 | GET /feedback/:feedbackId | 获取反馈详情 |

### 后台管理接口

| 模块 | 接口 | 说明 |
|------|------|------|
| 认证 | POST /admin/auth/login | 管理员登录 |
| 认证 | GET /admin/auth/captcha | 获取验证码 |
| 认证 | GET /admin/auth/profile | 获取管理员信息 |
| 认证 | PUT /admin/auth/password | 修改密码 |
| 认证 | POST /admin/auth/logout | 退出登录 |
| 用户管理 | GET /admin/users | 用户列表 |
| 用户管理 | GET /admin/users/:userId | 用户详情 |
| 用户管理 | POST /admin/users | 创建用户 |
| 用户管理 | PUT /admin/users/:userId | 更新用户 |
| 用户管理 | DELETE /admin/users/:userId | 删除用户 |
| 关卡管理 | GET /admin/levels | 关卡列表 |
| 关卡管理 | GET /admin/levels/:levelId | 关卡详情 |
| 关卡管理 | POST /admin/levels | 创建关卡 |
| 关卡管理 | PUT /admin/levels/:levelId | 更新关卡 |
| 关卡管理 | DELETE /admin/levels/:levelId | 删除关卡 |
| 区域管理 | GET /admin/regions | 区域列表 |
| 区域管理 | POST /admin/regions | 创建区域 |
| 区域管理 | PUT /admin/regions/:regionId | 更新区域 |
| 区域管理 | DELETE /admin/regions/:regionId | 删除区域 |
| 国家管理 | GET /admin/countries | 国家列表 |
| 国家管理 | POST /admin/countries | 创建国家 |
| 国家管理 | PUT /admin/countries/:countryId | 更新国家 |
| 国家管理 | DELETE /admin/countries/:countryId | 删除国家 |
| 省份管理 | GET /admin/provinces | 省份列表 |
| 省份管理 | POST /admin/provinces | 创建省份 |
| 省份管理 | PUT /admin/provinces/:provinceId | 更新省份 |
| 省份管理 | DELETE /admin/provinces/:provinceId | 删除省份 |
| 城市管理 | GET /admin/cities | 城市列表 |
| 城市管理 | POST /admin/cities | 创建城市 |
| 城市管理 | PUT /admin/cities/:cityId | 更新城市 |
| 城市管理 | DELETE /admin/cities/:cityId | 删除城市 |
| 城市管理 | POST /admin/cities/batch-import | 批量导入城市 |
| 题目管理 | GET /admin/questions | 题目列表 |
| 题目管理 | POST /admin/questions | 创建题目 |
| 题目管理 | PUT /admin/questions/:questionId | 更新题目 |
| 题目管理 | DELETE /admin/questions/:questionId | 删除题目 |
| 题目管理 | POST /admin/questions/batch-import | 批量导入题目 |
| 商品管理 | GET /admin/shop | 商品列表 |
| 商品管理 | POST /admin/shop | 创建商品 |
| 商品管理 | PUT /admin/shop/:itemId | 更新商品 |
| 商品管理 | DELETE /admin/shop/:itemId | 删除商品 |
| 排行榜管理 | GET /admin/rank | 排行榜列表 |
| 排行榜管理 | GET /admin/rank/user/:userId | 用户排名详情 |
| 反馈管理 | GET /admin/feedback | 反馈列表 |
| 反馈管理 | POST /admin/feedback/:feedbackId/reply | 回复反馈 |
| 仪表盘 | GET /admin/dashboard | 仪表盘数据 |
| 仪表盘 | GET /admin/dashboard/user-stats | 用户统计 |
| 仪表盘 | GET /admin/dashboard/game-stats | 游戏统计 |
| 仪表盘 | GET /admin/dashboard/level-stats | 关卡统计 |

## 默认账号

- 管理员: `admin` / `admin123`

## 开发命令

```bash
# 开发模式
pnpm run dev

# 构建
pnpm run build

# 生产模式
pnpm start

# 代码检查
pnpm run lint

# 代码格式化
pnpm run format

# 运行测试
pnpm test

# 测试覆盖率
pnpm run test:coverage
```

## Docker管理工具

- **Adminer** (MySQL管理): http://localhost:8080
- **Mongo Express** (MongoDB管理): http://localhost:8081

## 许可证

MIT
