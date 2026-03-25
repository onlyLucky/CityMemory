# 城迹服务端 - 后端代码开发指导及规范

## 一、文档概述

### 1.1 文档目的
本文档定义"城迹"项目服务端后端开发的技术标准、编码规范、目录结构及开发流程。服务端统一为小程序和后台管理系统提供API服务，为后端开发团队提供统一的开发指南，确保代码质量和项目可维护性。

### 1.2 适用范围
- 后端开发人员
- 代码审查人员
- 技术负责人

### 1.3 技术栈确认

| 技术组件 | 版本 | 用途 |
|----------|------|------|
| Node.js | 18.x+ | 运行环境 |
| Koa | 2.x | Web框架 |
| TypeScript | 5.0+ | 类型系统 |
| MySQL | 8.0+ | 关系型数据库 |
| Redis | 7.0+ | 缓存数据库 |
| MongoDB | 6.0+ | 文档数据库 |
| Sequelize | 6.x | MySQL ORM |
| Mongoose | 7.x | MongoDB ODM |
| JWT | 9.x | 身份认证 |
| Winston | 3.x | 日志管理 |
| Joi | 17.x | 数据验证 |
| pnpm | 8.x | 包管理器 |

---

## 二、项目目录结构

### 2.1 标准目录结构

```
server/
├── .vscode/                    # VS Code配置
│   ├── settings.json           # 编辑器配置
│   └── extensions.json         # 推荐插件
├── src/                        # 源代码目录
│   ├── config/                 # 配置文件
│   │   ├── database.ts         # 数据库配置
│   │   ├── redis.ts            # Redis配置
│   │   ├── jwt.ts              # JWT配置
│   │   └── logger.ts           # 日志配置
│   │
│   ├── controllers/            # 控制器
│   │   ├── user/               # 用户控制器
│   │   │   ├── index.ts
│   │   │   └── user.controller.ts
│   │   ├── level/               # 关卡控制器
│   │   │   ├── index.ts
│   │   │   └── level.controller.ts
│   │   ├── question/           # 题目控制器
│   │   │   ├── index.ts
│   │   │   └── question.controller.ts
│   │   ├── shop/               # 商店控制器
│   │   │   ├── index.ts
│   │   │   └── shop.controller.ts
│   │   ├── rank/               # 排行榜控制器
│   │   │   ├── index.ts
│   │   │   └── rank.controller.ts
│   │   ├── feedback/           # 反馈控制器
│   │   │   ├── index.ts
│   │   │   └── feedback.controller.ts
│   │   └── admin/              # 后台管理控制器
│   │       ├── index.ts
│   │       ├── user.controller.ts
│   │       ├── level.controller.ts
│   │       └── question.controller.ts
│   │
│   ├── services/               # 业务逻辑层
│   │   ├── user/               # 用户服务
│   │   │   ├── index.ts
│   │   │   └── user.service.ts
│   │   ├── level/              # 关卡服务
│   │   │   ├── index.ts
│   │   │   └── level.service.ts
│   │   ├── question/           # 题目服务
│   │   │   ├── index.ts
│   │   │   └── question.service.ts
│   │   ├── shop/               # 商店服务
│   │   │   ├── index.ts
│   │   │   └── shop.service.ts
│   │   ├── rank/               # 排行榜服务
│   │   │   ├── index.ts
│   │   │   └── rank.service.ts
│   │   ├── feedback/           # 反馈服务
│   │   │   ├── index.ts
│   │   │   └── feedback.service.ts
│   │   └── admin/              # 后台管理服务
│   │       ├── index.ts
│   │       ├── user.service.ts
│   │       ├── level.service.ts
│   │       └── question.service.ts
│   │
│   ├── models/                 # 数据模型
│   │   ├── mysql/              # MySQL模型
│   │   │   ├── user.model.ts
│   │   │   ├── level.model.ts
│   │   │   ├── question.model.ts
│   │   │   ├── shop.model.ts
│   │   │   ├── feedback.model.ts
│   │   │   └── index.ts
│   │   └── mongodb/            # MongoDB模型
│   │       ├── user-progress.model.ts
│   │       ├── game-record.model.ts
│   │       └── index.ts
│   │
│   ├── middlewares/            # 中间件
│   │   ├── auth.middleware.ts  # 认证中间件
│   │   ├── admin.middleware.ts # 后台管理中间件
│   │   ├── error.middleware.ts # 错误处理中间件
│   │   ├── logger.middleware.ts # 日志中间件
│   │   └── validate.middleware.ts # 验证中间件
│   │
│   ├── routes/                 # 路由
│   │   ├── index.ts            # 路由入口
│   │   ├── user.routes.ts     # 用户路由
│   │   ├── level.routes.ts    # 关卡路由
│   │   ├── question.routes.ts # 题目路由
│   │   ├── shop.routes.ts     # 商店路由
│   │   ├── rank.routes.ts     # 排行榜路由
│   │   ├── feedback.routes.ts # 反馈路由
│   │   └── admin.routes.ts    # 后台管理路由
│   │
│   ├── utils/                  # 工具函数
│   │   ├── jwt.ts              # JWT工具
│   │   ├── crypto.ts           # 加密工具
│   │   ├── validator.ts       # 验证工具
│   │   ├── formatter.ts       # 格式化工具
│   │   ├── response.ts        # 响应工具
│   │   └── logger.ts           # 日志工具
│   │
│   ├── types/                  # 类型定义
│   │   ├── user.ts             # 用户类型
│   │   ├── level.ts            # 关卡类型
│   │   ├── question.ts         # 题目类型
│   │   ├── shop.ts             # 商店类型
│   │   ├── rank.ts             # 排行榜类型
│   │   ├── feedback.ts         # 反馈类型
│   │   ├── common.ts           # 通用类型
│   │   └── index.ts
│   │
│   ├── constants/              # 常量定义
│   │   ├── error.ts            # 错误码
│   │   ├── status.ts           # 状态码
│   │   ├── config.ts           # 配置常量
│   │   └── index.ts
│   │
│   ├── validators/             # 验证器
│   │   ├── user.validator.ts   # 用户验证
│   │   ├── level.validator.ts  # 关卡验证
│   │   ├── question.validator.ts # 题目验证
│   │   └── index.ts
│   │
│   ├── app.ts                  # 应用实例
│   └── server.ts               # 服务器入口
│
├── tests/                      # 测试文件
│   ├── unit/                   # 单元测试
│   │   ├── user.test.ts
│   │   └── question.test.ts
│   └── integration/            # 集成测试
│       └── api.test.ts
│
├── .env                        # 环境变量
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript配置
├── tsconfig.build.json         # 构建TypeScript配置
├── .eslintrc.js                # ESLint配置
├── .prettierrc                 # Prettier配置
└── README.md                   # 项目说明
```

### 2.2 目录职责说明

| 目录 | 职责 | 说明 |
|------|------|------|
| config | 配置文件 | 数据库、Redis、JWT等配置 |
| controllers | 控制器层 | 处理HTTP请求和响应 |
| services | 业务逻辑层 | 核心业务逻辑处理 |
| models | 数据模型层 | 数据库模型定义 |
| middlewares | 中间件 | 请求拦截和处理 |
| routes | 路由层 | API路由定义 |
| utils | 工具函数 | 通用工具方法 |
| types | 类型定义 | TypeScript类型定义 |
| constants | 常量定义 | 错误码、状态码等常量 |
| validators | 验证器 | 请求数据验证 |

---

## 三、命名规范

### 3.1 文件命名

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| TypeScript文件 | kebab-case | `user.controller.ts`, `question.service.ts` |
| 类型定义文件 | kebab-case | `user.types.ts`, `common.types.ts` |
| 验证器文件 | kebab-case | `user.validator.ts`, `question.validator.ts` |
| 配置文件 | kebab-case | `database.config.ts`, `redis.config.ts` |
| 目录名 | kebab-case | `user-management/`, `question-service/` |

### 3.2 变量命名

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 普通变量 | camelCase | `userName`, `totalCount` |
| 常量 | UPPER_SNAKE_CASE | `MAX_COUNT`, `API_BASE_URL` |
| 私有变量 | _camelCase | `_privateData`, `_internalState` |
| 布尔值 | is/has/can + camelCase | `isLoading`, `hasPermission`, `canEdit` |
| 数组 | 复数形式或List后缀 | `users`, `questionList` |
| 对象 | 单数形式 | `user`, `question` |
| 函数 | 动词开头 | `getUserList`, `handleSubmit`, `formatDate` |
| 异步函数 | async前缀或动词 | `asyncFetchData`, `loadUserData` |
| 类名 | PascalCase | `UserService`, `QuestionController` |
| 接口 | PascalCase | `IUserService`, `IQuestionController` |

### 3.3 数据库命名

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 表名 | snake_case | `user_info`, `question_bank` |
| 字段名 | snake_case | `user_id`, `question_content` |
| 索引名 | idx_表名_字段名 | `idx_user_nickname` |
| 外键名 | fk_表名_字段名 | `fk_question_level_id` |

### 3.4 API命名

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 路由路径 | kebab-case | `/user/list`, `/question/create` |
| 查询参数 | camelCase | `?page=1&pageSize=20` |
| 请求体 | camelCase | `{ "userName": "test" }` |
| 响应体 | camelCase | `{ "userName": "test" }` |

---

## 四、编码规范

### 4.1 控制器规范

#### 4.1.1 控制器结构

```typescript
// controllers/user/user.controller.ts
import { Context } from 'koa'
import { UserService } from '@/services/user/user.service'
import { success, error } from '@/utils/response'
import { logger } from '@/utils/logger'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  login = async (ctx: Context) => {
    try {
      const { code } = ctx.request.body

      const result = await this.userService.login(code)

      success(ctx, result)
    } catch (err) {
      logger.error('用户登录失败', err)
      error(ctx, err)
    }
  }

  getUserInfo = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id

      const userInfo = await this.userService.getUserInfo(userId)

      success(ctx, userInfo)
    } catch (err) {
      logger.error('获取用户信息失败', err)
      error(ctx, err)
    }
  }

  updateUser = async (ctx: Context) => {
    try {
      const userId = ctx.state.user.id
      const updateData = ctx.request.body

      const userInfo = await this.userService.updateUser(userId, updateData)

      success(ctx, userInfo)
    } catch (err) {
      logger.error('更新用户信息失败', err)
      error(ctx, err)
    }
  }
}
```

#### 4.1.2 控制器编写顺序

```typescript
// controllers/user/user.controller.ts
// 1. 导入语句
import { Context } from 'koa'
import { UserService } from '@/services/user/user.service'
import { success, error } from '@/utils/response'
import { logger } from '@/utils/logger'

// 2. 类定义
export class UserController {
  // 3. 私有属性
  private userService: UserService

  // 4. 构造函数
  constructor() {
    this.userService = new UserService()
  }

  // 5. 公共方法（按字母顺序或功能分组）
  // 用户相关
  login = async (ctx: Context) => { }

  getUserInfo = async (ctx: Context) => { }

  updateUser = async (ctx: Context) => { }

  // 门票相关
  getTicketStatus = async (ctx: Context) => { }

  useTicket = async (ctx: Context) => { }
}
```

### 4.2 服务层规范

#### 4.2.1 服务结构

```typescript
// services/user/user.service.ts
import { User } from '@/models/mysql/user.model'
import { UserProgress } from '@/models/mongodb/user-progress.model'
import { jwtUtil } from '@/utils/jwt'
import { redisUtil } from '@/utils/redis'
import { logger } from '@/utils/logger'
import type { ILoginResult, IUserInfo } from '@/types/user'

export class UserService {
  private userModel: User
  private userProgressModel: UserProgress

  constructor() {
    this.userModel = new User()
    this.userProgressModel = new UserProgress()
  }

  async login(code: string): Promise<ILoginResult> {
    // 1. 验证微信code
    const openid = await this.getOpenidFromWechat(code)
    if (!openid) {
      throw new Error('微信登录失败')
    }

    // 2. 查询或创建用户
    let user = await this.userModel.findByOpenid(openid)
    if (!user) {
      user = await this.userModel.create({ openid })
    }

    // 3. 生成JWT token
    const token = jwtUtil.sign({ id: user.id })

    // 4. 返回结果
    return {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        province: user.province,
        totalStars: user.totalStars,
        levelCount: user.levelCount
      }
    }
  }

  async getUserInfo(userId: string): Promise<IUserInfo> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new Error('用户不存在')
    }

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      province: user.province,
      totalStars: user.totalStars,
      levelCount: user.levelCount,
      createdAt: user.createdAt
    }
  }

  async updateUser(userId: string, updateData: Partial<IUserInfo>): Promise<IUserInfo> {
    const user = await this.userModel.update(userId, updateData)
    if (!user) {
      throw new Error('用户不存在')
    }

    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      province: user.province,
      totalStars: user.totalStars,
      levelCount: user.levelCount,
      createdAt: user.createdAt
    }
  }

  private async getOpenidFromWechat(code: string): Promise<string | null> {
    // 调用微信API获取openid
    return 'mock_openid'
  }
}
```

### 4.3 模型层规范

#### 4.3.1 MySQL模型

```typescript
// models/mysql/user.model.ts
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/config/database'

export class User extends Model {
  public id!: string
  public openid!: string
  public nickname!: string
  public avatar!: string
  public province!: string
  public totalStars!: number
  public levelCount!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '微信openid'
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
      comment: '用户昵称'
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '用户头像'
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
      comment: '用户所在省份'
    },
    totalStars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '总星数'
    },
    levelCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '通关关卡数'
    }
  },
  {
    sequelize,
    tableName: 'user_info',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['openid']
      },
      {
        fields: ['province']
      },
      {
        fields: ['totalStars']
      }
    ]
  }
)

export default User
```

#### 4.3.2 MongoDB模型

```typescript
// models/mongodb/user-progress.model.ts
import mongoose, { Schema, Document } from 'mongoose'

interface IUserProgress extends Document {
  userId: string
  province: string
  unlockedLevels: string[]
  currentLevel: string
  levelStars: Record<string, number>
  completedLevels: string[]
  createdAt: Date
  updatedAt: Date
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    province: {
      type: String,
      required: true,
      default: ''
    },
    unlockedLevels: {
      type: [String],
      default: []
    },
    currentLevel: {
      type: String,
      default: ''
    },
    levelStars: {
      type: Map,
      of: Number,
      default: {}
    },
    completedLevels: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
)

UserProgressSchema.index({ userId: 1, province: 1 })
UserProgressSchema.index({ province: 1 })

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema)

export default UserProgress
```

### 4.4 路由规范

#### 4.4.1 路由定义

```typescript
// routes/user.routes.ts
import Router from '@koa/router'
import { UserController } from '@/controllers/user/user.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { loginValidator, updateUserValidator } from '@/validators/user.validator'

const router = new Router({ prefix: '/user' })
const userController = new UserController()

// 小程序接口
router.post('/login', validateMiddleware(loginValidator), userController.login)
router.get('/info', authMiddleware, userController.getUserInfo)
router.put('/info', authMiddleware, validateMiddleware(updateUserValidator), userController.updateUser)
router.post('/init-province', authMiddleware, userController.initProvince)
router.get('/tickets', authMiddleware, userController.getTicketStatus)

export default router
```

#### 4.4.2 后台管理路由

```typescript
// routes/admin.routes.ts
import Router from '@koa/router'
import { AdminUserController } from '@/controllers/admin/user.controller'
import { authMiddleware, adminMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { createUserValidator, updateUserValidator } from '@/validators/user.validator'

const router = new Router({ prefix: '/admin/user' })
const adminUserController = new AdminUserController()

// 后台管理接口
router.post('/login', adminUserController.login)
router.get('/list', authMiddleware, adminMiddleware, adminUserController.getUserList)
router.get('/:id', authMiddleware, adminMiddleware, adminUserController.getUserDetail)
router.post('/', authMiddleware, adminMiddleware, validateMiddleware(createUserValidator), adminUserController.createUser)
router.put('/:id', authMiddleware, adminMiddleware, validateMiddleware(updateUserValidator), adminUserController.updateUser)
router.delete('/:id', authMiddleware, adminMiddleware, adminUserController.deleteUser)
router.post('/batch-delete', authMiddleware, adminMiddleware, adminUserController.batchDeleteUsers)

export default router
```

### 4.5 中间件规范

#### 4.5.1 认证中间件

```typescript
// middlewares/auth.middleware.ts
import { Context, Next } from 'koa'
import { jwtUtil } from '@/utils/jwt'
import { error } from '@/utils/response'
import { logger } from '@/utils/logger'
import { ErrorCode } from '@/constants/error'

export const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      error(ctx, { code: ErrorCode.UNAUTHORIZED, message: '未提供认证令牌' })
      return
    }

    const decoded = jwtUtil.verify(token)
    ctx.state.user = decoded

    await next()
  } catch (err) {
    logger.error('认证失败', err)
    error(ctx, { code: ErrorCode.UNAUTHORIZED, message: '认证失败' })
  }
}

export const adminMiddleware = async (ctx: Context, next: Next) => {
  try {
    const user = ctx.state.user

    if (!user || user.role !== 'admin') {
      error(ctx, { code: ErrorCode.FORBIDDEN, message: '无权限访问' })
      return
    }

    await next()
  } catch (err) {
    logger.error('权限验证失败', err)
    error(ctx, { code: ErrorCode.FORBIDDEN, message: '权限验证失败' })
  }
}
```

#### 4.5.2 验证中间件

```typescript
// middlewares/validate.middleware.ts
import { Context, Next } from 'koa'
import Joi from 'joi'
import { error } from '@/utils/response'
import { ErrorCode } from '@/constants/error'

export const validateMiddleware = (schema: Joi.ObjectSchema) => {
  return async (ctx: Context, next: Next) => {
    try {
      const { error: validationError } = schema.validate(ctx.request.body)

      if (validationError) {
        const errorMessage = validationError.details[0].message
        error(ctx, { code: ErrorCode.VALIDATION_ERROR, message: errorMessage })
        return
      }

      await next()
    } catch (err) {
      error(ctx, { code: ErrorCode.VALIDATION_ERROR, message: '数据验证失败' })
    }
  }
}
```

### 4.6 验证器规范

```typescript
// validators/user.validator.ts
import Joi from 'joi'

export const loginValidator = Joi.object({
  code: Joi.string().required().messages({
    'string.empty': '微信code不能为空',
    'any.required': '微信code不能为空'
  })
})

export const updateUserValidator = Joi.object({
  nickname: Joi.string().min(2).max(20).optional(),
  avatar: Joi.string().uri().optional(),
  province: Joi.string().optional()
})

export const createUserValidator = Joi.object({
  nickname: Joi.string().min(2).max(20).required(),
  avatar: Joi.string().uri().required(),
  province: Joi.string().required()
})

export const initProvinceValidator = Joi.object({
  province: Joi.string().required(),
  method: Joi.string().valid('select', 'random').required()
})
```

---

## 五、数据库规范

### 5.1 数据库设计原则

1. **命名规范**：使用snake_case命名表名和字段名
2. **主键**：所有表必须有主键，推荐使用UUID
3. **索引**：为常用查询字段创建索引
4. **外键**：使用外键保证数据完整性
5. **字段类型**：选择合适的字段类型，避免浪费空间
6. **默认值**：为字段设置合理的默认值
7. **注释**：为表和字段添加注释说明

### 5.2 表结构示例

#### 5.2.1 用户表（user_info）

```sql
CREATE TABLE `user_info` (
  `id` varchar(36) NOT NULL COMMENT '用户ID',
  `openid` varchar(100) NOT NULL COMMENT '微信openid',
  `nickname` varchar(50) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `avatar` varchar(500) NOT NULL DEFAULT '' COMMENT '用户头像',
  `province` varchar(50) NOT NULL DEFAULT '' COMMENT '用户所在省份',
  `total_stars` int NOT NULL DEFAULT 0 COMMENT '总星数',
  `level_count` int NOT NULL DEFAULT 0 COMMENT '通关关卡数',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_province` (`province`),
  KEY `idx_total_stars` (`total_stars`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';
```

#### 5.2.2 关卡表（level_info）

```sql
CREATE TABLE `level_info` (
  `id` varchar(36) NOT NULL COMMENT '关卡ID',
  `level_name` varchar(100) NOT NULL COMMENT '关卡名称',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `level_order` int NOT NULL COMMENT '关卡顺序',
  `question_count` int NOT NULL DEFAULT 10 COMMENT '题目数量',
  `difficulty` int NOT NULL DEFAULT 1 COMMENT '难度等级',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1-启用 0-禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_province_order` (`province`, `level_order`),
  KEY `idx_province` (`province`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关卡信息表';
```

#### 5.2.3 题目表（question_bank）

```sql
CREATE TABLE `question_bank` (
  `id` varchar(36) NOT NULL COMMENT '题目ID',
  `question_type` tinyint NOT NULL COMMENT '题目类型：1-城市到省份 2-城市到国家 3-古地名到今地名 4-国旗到国家',
  `question_content` text NOT NULL COMMENT '题目内容',
  `question_image` varchar(500) DEFAULT NULL COMMENT '题目图片',
  `options` json NOT NULL COMMENT '选项',
  `correct_answer` varchar(10) NOT NULL COMMENT '正确答案',
  `difficulty` int NOT NULL DEFAULT 1 COMMENT '难度',
  `region` varchar(50) NOT NULL COMMENT '地区',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1-启用 0-禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_question_type` (`question_type`),
  KEY `idx_region` (`region`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目库表';
```

---

## 六、API设计规范

### 6.1 RESTful API设计

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /user/info | 获取用户信息 |
| POST | /user/login | 用户登录 |
| PUT | /user/info | 更新用户信息 |
| GET | /user/list | 获取用户列表 |
| POST | /user | 创建用户 |
| DELETE | /user/:id | 删除用户 |

### 6.2 请求响应格式

#### 6.2.1 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nickname": "用户昵称",
    "avatar": "https://example.com/avatar.png"
  }
}
```

#### 6.2.2 失败响应

```json
{
  "code": 1001,
  "message": "参数错误",
  "data": null
}
```

### 6.3 错误码定义

```typescript
// constants/error.ts
export enum ErrorCode {
  SUCCESS = 0,
  VALIDATION_ERROR = 1001,
  UNAUTHORIZED = 1002,
  FORBIDDEN = 1003,
  NOT_FOUND = 1004,
  INTERNAL_ERROR = 1005,
  USER_NOT_FOUND = 2001,
  USER_ALREADY_EXISTS = 2002,
  LEVEL_NOT_FOUND = 3001,
  QUESTION_NOT_FOUND = 4001,
  TICKET_NOT_ENOUGH = 5001
}
```

---

## 七、工具函数规范

### 7.1 JWT工具

```typescript
// utils/jwt.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const jwtUtil = {
  sign(payload: any, expiresIn: string = '7d'): string {
    return jwt.sign(payload, SECRET, { expiresIn })
  },

  verify(token: string): any {
    try {
      return jwt.verify(token, SECRET)
    } catch (error) {
      throw new Error('Invalid token')
    }
  },

  decode(token: string): any {
    return jwt.decode(token)
  }
}
```

### 7.2 Redis工具

```typescript
// utils/redis.ts
import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

client.on('error', (err) => console.error('Redis Client Error', err))

export const redisUtil = {
  async connect() {
    await client.connect()
  },

  async disconnect() {
    await client.disconnect()
  },

  async get(key: string): Promise<string | null> {
    return await client.get(key)
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await client.setEx(key, ttl, value)
    } else {
      await client.set(key, value)
    }
  },

  async del(key: string): Promise<void> {
    await client.del(key)
  },

  async exists(key: string): Promise<number> {
    return await client.exists(key)
  }
}
```

### 7.3 响应工具

```typescript
// utils/response.ts
import { Context } from 'koa'
import { ErrorCode } from '@/constants/error'

export const success = (ctx: Context, data: any = null, message: string = 'success') => {
  ctx.body = {
    code: ErrorCode.SUCCESS,
    message,
    data
  }
}

export const error = (ctx: Context, err: any) => {
  const code = err.code || ErrorCode.INTERNAL_ERROR
  const message = err.message || '服务器内部错误'

  ctx.status = code >= 500 ? 500 : 200
  ctx.body = {
    code,
    message,
    data: null
  }
}
```

### 7.4 日志工具

```typescript
// utils/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export { logger }
```

---

## 八、代码注释规范

### 8.1 文件头注释

```typescript
/**
 * @file 用户控制器
 * @description 处理用户相关的HTTP请求
 * @author 开发者姓名
 * @date 2026-03-23
 */
```

### 8.2 函数注释

```typescript
/**
 * 用户登录
 * @param ctx Koa上下文对象
 * @returns Promise<void>
 * @example
 * POST /user/login
 * Body: { "code": "wx_code" }
 */
login = async (ctx: Context): Promise<void> => {
  // ...
}
```

### 8.3 行内注释

```typescript
const result = await this.userService.login(code) // 调用服务层登录方法

// TODO: 待优化逻辑
// FIXME: 修复此问题
// NOTE: 注意事项
// HACK: 临时解决方案
```

---

## 九、性能优化规范

### 9.1 数据库优化

```typescript
// 使用索引查询
const users = await User.findAll({
  where: { province: '江苏省' },
  index: 'idx_province'
})

// 使用分页查询
const users = await User.findAll({
  offset: 0,
  limit: 20
})

// 使用缓存
const cacheKey = `user:${userId}`
let user = await redisUtil.get(cacheKey)
if (!user) {
  user = await User.findByPk(userId)
  await redisUtil.set(cacheKey, JSON.stringify(user), 3600)
}
```

### 9.2 查询优化

```typescript
// 只查询需要的字段
const users = await User.findAll({
  attributes: ['id', 'nickname', 'avatar']
})

// 使用关联查询
const users = await User.findAll({
  include: [{
    model: Level,
    attributes: ['id', 'levelName']
  }]
})
```

---

## 十、错误处理规范

### 10.1 全局错误处理

```typescript
// middlewares/error.middleware.ts
import { Context, Next } from 'koa'
import { logger } from '@/utils/logger'
import { error } from '@/utils/response'

export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    logger.error('全局错误:', err)
    error(ctx, err)
  }
}
```

### 10.2 业务错误处理

```typescript
// services/user/user.service.ts
async getUserInfo(userId: string): Promise<IUserInfo> {
  const user = await this.userModel.findById(userId)
  if (!user) {
    throw new Error('用户不存在')
  }
  return user
}
```

---

## 十一、测试规范

### 11.1 单元测试

```typescript
// tests/unit/user.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { UserService } from '@/services/user/user.service'

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
  })

  it('should login user successfully', async () => {
    const result = await userService.login('mock_code')
    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('user')
  })

  it('should throw error when user not found', async () => {
    await expect(userService.getUserInfo('invalid_id')).rejects.toThrow('用户不存在')
  })
})
```

### 11.2 集成测试

```typescript
// tests/integration/api.test.ts
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '@/app'

describe('User API', () => {
  it('should login user', async () => {
    const response = await request(app.callback())
      .post('/api/v1/user/login')
      .send({ code: 'mock_code' })

    expect(response.status).toBe(200)
    expect(response.body.code).toBe(0)
    expect(response.body.data).toHaveProperty('token')
  })
})
```

---

## 十二、发布规范

### 12.1 环境变量

```bash
# .env.development
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=citytrace_dev
DB_USER=root
DB_PASSWORD=root
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key
LOG_LEVEL=debug
```

```bash
# .env.production
NODE_ENV=production
PORT=3000
DB_HOST=production-db-host
DB_PORT=3306
DB_NAME=citytrace_prod
DB_USER=prod_user
DB_PASSWORD=prod_password
REDIS_URL=redis://production-redis:6379
JWT_SECRET=prod-secret-key
LOG_LEVEL=info
```

### 12.2 构建脚本

```json
// package.json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

---

## 十三、最佳实践

### 13.1 依赖注入

```typescript
// services/user/user.service.ts
export class UserService {
  constructor(
    private userModel: User,
    private userProgressModel: UserProgress
  ) {
    this.userModel = userModel || new User()
    this.userProgressModel = userProgressModel || new UserProgress()
  }
}
```

### 13.2 事务处理

```typescript
async transferStars(fromUserId: string, toUserId: string, amount: number) {
  const transaction = await sequelize.transaction()

  try {
    await this.userModel.updateStars(fromUserId, -amount, transaction)
    await this.userModel.updateStars(toUserId, amount, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
```

### 13.3 缓存策略

```typescript
async getUserInfo(userId: string): Promise<IUserInfo> {
  const cacheKey = `user:${userId}`

  // 尝试从缓存获取
  const cached = await redisUtil.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 从数据库获取
  const user = await this.userModel.findById(userId)

  // 写入缓存
  await redisUtil.set(cacheKey, JSON.stringify(user), 3600)

  return user
}
```

---

## 十四、安全规范

### 14.1 输入验证

```typescript
// 使用Joi验证输入
const schema = Joi.object({
  nickname: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required()
})

const { error, value } = schema.validate(ctx.request.body)
if (error) {
  throw new Error(error.details[0].message)
}
```

### 14.2 SQL注入防护

```typescript
// 使用参数化查询
const users = await User.findAll({
  where: {
    nickname: ctx.query.nickname
  }
})

// 避免直接拼接SQL
const sql = `SELECT * FROM user_info WHERE nickname = '${ctx.query.nickname}'` // 危险！
```

### 14.3 XSS防护

```typescript
// 使用XSS过滤库
import xss from 'xss'

const cleanContent = xss(ctx.request.body.content)
```

---

## 十五、附录

### 15.1 相关文档

- [Koa官方文档](https://koajs.com/)
- [Sequelize官方文档](https://sequelize.org/)
- [Mongoose官方文档](https://mongoosejs.com/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Winston官方文档](https://github.com/winstonjs/winston)

### 15.2 开发工具推荐

- VS Code：代码编辑器
- Postman：API测试工具
- MySQL Workbench：数据库管理工具
- MongoDB Compass：MongoDB管理工具
- Redis Desktop Manager：Redis管理工具

### 15.3 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 启动生产环境
pnpm start

# 运行测试
pnpm test

# 代码检查
pnpm run lint

# 代码修复
pnpm run lint:fix
```
