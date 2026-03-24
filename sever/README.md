# 城迹后端服务

## 项目介绍
城迹项目后端服务，为小程序和后台管理系统提供统一的API接口。

## 技术栈
- Node.js 18.x
- Koa 2.x
- TypeScript 5.0+
- MySQL 8.0+
- Redis 7.0+
- MongoDB 6.0+
- Sequelize 6.x
- Mongoose 7.x
- JWT 9.x
- Winston 3.x

## 项目结构
```
src/
├── config/         # 配置文件
├── controllers/    # 控制器
├── services/       # 业务逻辑层
├── models/         # 数据模型
├── middlewares/    # 中间件
├── routes/         # 路由
├── utils/          # 工具函数
├── types/          # 类型定义
├── constants/      # 常量定义
├── validators/     # 验证器
├── app.ts          # 应用实例
└── server.ts       # 服务器入口
```

## 开发指南

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 构建项目
```bash
pnpm build
```

### 启动生产服务器
```bash
pnpm start
```

### 代码检查
```bash
pnpm lint
```

### 代码格式化
```bash
pnpm format
```

## 环境变量
复制 `.env` 文件并配置相应的环境变量。

## API文档
详见接口文档。
