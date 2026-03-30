# Swagger 文档系统集成计划

## 项目概述

为 CityMemory 后端服务集成 Swagger 文档系统，实现 RESTful API 的自动文档生成和可视化展示。

## 技术选型

| 组件 | 版本 | 用途 |
|------|------|------|
| `swagger-jsdoc` | ^6.2.8 | 使用 JSDoc 注释生成 OpenAPI 规范 |
| `koa2-swagger-ui` | ^5.10.0 | Koa 的 Swagger UI 中间件 |

**选择理由**：
- 与现有 Koa + TypeScript 架构兼容
- 支持在控制器中使用 JSDoc 注释定义 API
- 自动生成 OpenAPI 3.0 规范
- 无需大幅修改现有代码结构

## 实施步骤

### 第一阶段：依赖安装与基础配置

#### 1.1 安装依赖包

```bash
cd /Users/feynman/Documents/code/2026/@IDEA/CityMemory/server
pnpm add swagger-jsdoc koa2-swagger-ui
pnpm add -D @types/swagger-jsdoc
```

#### 1.2 创建 Swagger 配置文件

创建 `src/config/swagger.ts`：
- 配置 OpenAPI 基本信息（标题、版本、描述、联系方式）
- 配置服务器地址
- 配置认证方式（Bearer JWT）
- 定义通用响应格式

#### 1.3 集成到应用入口

修改 `src/app.ts`：
- 导入 Swagger 配置
- 注册 Swagger UI 路由
- 注册 OpenAPI JSON 路由

### 第二阶段：定义 Swagger 文档结构

#### 2.1 创建文档类型定义

创建 `src/types/swagger.ts`：
- 定义通用响应结构 ApiResponse
- 定义分页响应结构 PaginatedData
- 定义错误响应结构

#### 2.2 定义通用 Schema

在 Swagger 配置中定义可复用的组件：
- `User` - 用户信息
- `Level` - 关卡信息
- `Question` - 题目信息
- `ShopItem` - 商品信息
- `Error` - 错误响应
- `Pagination` - 分页参数

### 第三阶段：为控制器添加 API 注释

#### 3.1 用户模块 (UserController)

为以下接口添加 Swagger 注释：
- `POST /api/v1/user/login` - 用户登录
- `GET /api/v1/user/profile` - 获取用户信息
- `PUT /api/v1/user/profile` - 更新用户信息
- `POST /api/v1/user/init-province` - 初始化省份
- `GET /api/v1/user/tickets` - 获取门票信息
- `POST /api/v1/user/tickets/recover` - 恢复门票
- `GET /api/v1/user/items` - 获取用户道具
- `GET /api/v1/user/progress` - 获取用户进度

#### 3.2 关卡模块 (LevelController)

为以下接口添加 Swagger 注释：
- `GET /api/v1/level/list` - 获取关卡列表
- `GET /api/v1/level/:levelId` - 获取关卡详情
- `POST /api/v1/level/start` - 开始关卡
- `POST /api/v1/level/answer` - 提交答案
- `POST /api/v1/level/end` - 结束关卡

#### 3.3 题目模块 (QuestionController)

为以下接口添加 Swagger 注释：
- `GET /api/v1/question/random` - 获取随机题目
- `GET /api/v1/question/:questionId` - 获取题目详情

#### 3.4 商店模块 (ShopController)

为以下接口添加 Swagger 注释：
- `GET /api/v1/shop/items` - 获取商品列表
- `POST /api/v1/shop/buy` - 购买商品

#### 3.5 排行榜模块 (RankController)

为以下接口添加 Swagger 注释：
- `GET /api/v1/rank/list` - 获取排行榜
- `GET /api/v1/rank/user/:userId` - 获取用户排名

#### 3.6 反馈模块 (FeedbackController)

为以下接口添加 Swagger 注释：
- `POST /api/v1/feedback` - 提交反馈
- `GET /api/v1/feedback/list` - 获取反馈列表

#### 3.7 管理后台模块

为所有 Admin 控制器添加 Swagger 注释：
- `AdminAuthController` - 管理员认证
- `AdminUserController` - 用户管理
- `AdminLevelController` - 关卡管理
- `AdminRegionController` - 区域管理
- `AdminCountryController` - 国家管理
- `AdminProvinceController` - 省份管理
- `AdminCityController` - 城市管理
- `AdminQuestionController` - 题目管理
- `AdminShopController` - 商店管理
- `AdminRankController` - 排行榜管理
- `AdminFeedbackController` - 反馈管理
- `AdminDashboardController` - 仪表盘统计

### 第四阶段：JSDoc 注释规范

#### 4.1 标准 API 注释模板

```typescript
/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     tags:
 *       - 用户模块
 *     summary: 获取用户信息
 *     description: 获取当前登录用户的详细信息
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

#### 4.2 请求参数注释模板

```typescript
/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     tags:
 *       - 用户模块
 *     summary: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: 微信登录凭证
 *               nickname:
 *                 type: string
 *                 description: 用户昵称
 *     responses:
 *       200:
 *         description: 登录成功
 */
```

### 第五阶段：验证与测试

#### 5.1 功能验证

1. 启动服务后访问 `http://localhost:3000/api-docs`
2. 验证 Swagger UI 正常显示
3. 验证所有 API 接口正确展示
4. 验证请求参数、响应格式正确描述

#### 5.2 文档完整性检查

1. 检查所有 RESTful 接口都有对应文档
2. 检查请求参数描述完整
3. 检查响应格式描述准确
4. 检查错误码说明完整

#### 5.3 交互测试

1. 在 Swagger UI 中测试登录接口获取 Token
2. 配置 Bearer Token 认证
3. 测试需要认证的接口
4. 验证参数校验提示

## 文件变更清单

### 新增文件

| 文件路径 | 说明 |
|----------|------|
| `src/config/swagger.ts` | Swagger 配置文件 |
| `src/types/swagger.ts` | Swagger 类型定义 |

### 修改文件

| 文件路径 | 修改内容 |
|----------|----------|
| `src/app.ts` | 集成 Swagger 中间件 |
| `src/controllers/user/user.controller.ts` | 添加 API 注释 |
| `src/controllers/level/level.controller.ts` | 添加 API 注释 |
| `src/controllers/question/question.controller.ts` | 添加 API 注释 |
| `src/controllers/shop/shop.controller.ts` | 添加 API 注释 |
| `src/controllers/rank/rank.controller.ts` | 添加 API 注释 |
| `src/controllers/feedback/feedback.controller.ts` | 添加 API 注释 |
| `src/controllers/admin/*.controller.ts` | 添加 API 注释 |
| `package.json` | 添加依赖 |

## 访问地址

| 地址 | 说明 |
|------|------|
| `http://localhost:3000/api-docs` | Swagger UI 界面 |
| `http://localhost:3000/api-docs.json` | OpenAPI JSON 规范 |

## 预期成果

1. **完整的 API 文档**：所有 RESTful 接口都有清晰的文档说明
2. **交互式测试**：开发人员可在 Swagger UI 中直接测试 API
3. **自动同步**：代码注释变更后文档自动更新
4. **标准化格式**：遵循 OpenAPI 3.0 规范
5. **认证支持**：支持 Bearer Token 认证测试

## 注意事项

1. JSDoc 注释必须以 `@swagger` 开头
2. 路径必须与实际路由完全匹配
3. 生产环境可考虑禁用 Swagger UI
4. 敏感信息不要在文档描述中暴露
