# 城迹后端服务 - 开发规格说明

## 一、项目概述

### 1.1 项目背景
城迹是一款地理知识答题小程序，后端服务为小程序客户端和运营后台管理系统提供统一的API服务。

### 1.2 技术栈

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

### 1.3 开发环境要求
- 本地开发与测试环境必须使用Docker容器化部署
- 确保环境一致性

---

## 二、系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
├─────────────────────────────────────────────────────────────┤
│  小程序客户端  │  运营后台管理系统                           │
└────────┬───────────────────────┬────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                        API网关层                             │
├─────────────────────────────────────────────────────────────┤
│  Nginx反向代理  │  负载均衡  │  SSL终止                     │
└────────┬───────────────────────┬────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      应用服务层                              │
├─────────────────────────────────────────────────────────────┤
│  Koa应用  │  路由  │  中间件  │  控制器  │  服务层           │
└────────┬───────────────────────┬────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据存储层                              │
├─────────────────────────────────────────────────────────────┤
│  MySQL  │  MongoDB  │  Redis                                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
server/
├── .vscode/                    # VS Code配置
├── src/                        # 源代码目录
│   ├── config/                 # 配置文件
│   │   ├── database.ts         # 数据库配置
│   │   ├── redis.ts            # Redis配置
│   │   ├── mongodb.ts          # MongoDB配置
│   │   ├── jwt.ts              # JWT配置
│   │   └── logger.ts           # 日志配置
│   │
│   ├── controllers/            # 控制器
│   │   ├── user/               # 用户控制器
│   │   ├── level/              # 关卡控制器
│   │   ├── question/           # 题目控制器
│   │   ├── shop/               # 商店控制器
│   │   ├── rank/               # 排行榜控制器
│   │   ├── feedback/           # 反馈控制器
│   │   └── admin/              # 后台管理控制器
│   │
│   ├── services/               # 业务逻辑层
│   │   ├── user/               # 用户服务
│   │   ├── level/              # 关卡服务
│   │   ├── question/           # 题目服务
│   │   ├── shop/               # 商店服务
│   │   ├── rank/               # 排行榜服务
│   │   ├── feedback/           # 反馈服务
│   │   └── admin/              # 后台管理服务
│   │
│   ├── models/                 # 数据模型
│   │   ├── mysql/              # MySQL模型
│   │   │   ├── user.model.ts
│   │   │   ├── level.model.ts
│   │   │   ├── region.model.ts
│   │   │   ├── country.model.ts
│   │   │   ├── province.model.ts
│   │   │   ├── city.model.ts
│   │   │   ├── question.model.ts
│   │   │   ├── shop.model.ts
│   │   │   ├── feedback.model.ts
│   │   │   └── index.ts
│   │   └── mongodb/            # MongoDB模型
│   │       ├── user-progress.model.ts
│   │       ├── game-record.model.ts
│   │       ├── level-session.model.ts
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
│   │   ├── user.routes.ts      # 用户路由
│   │   ├── level.routes.ts     # 关卡路由
│   │   ├── question.routes.ts  # 题目路由
│   │   ├── shop.routes.ts      # 商店路由
│   │   ├── rank.routes.ts      # 排行榜路由
│   │   ├── feedback.routes.ts  # 反馈路由
│   │   └── admin.routes.ts     # 后台管理路由
│   │
│   ├── utils/                  # 工具函数
│   │   ├── jwt.ts              # JWT工具
│   │   ├── crypto.ts           # 加密工具
│   │   ├── validator.ts        # 验证工具
│   │   ├── formatter.ts        # 格式化工具
│   │   ├── response.ts         # 响应工具
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
│   └── integration/            # 集成测试
│
├── docker/                     # Docker配置
│   ├── mysql/                  # MySQL配置
│   │   └── init/               # 初始化脚本
│   └── mongodb/                # MongoDB配置
│
├── .env                        # 环境变量
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── .env.example                # 环境变量示例
├── docker-compose.yml          # Docker Compose配置
├── Dockerfile                  # Docker镜像构建
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript配置
├── tsconfig.build.json         # 构建TypeScript配置
├── .eslintrc.js                # ESLint配置
├── .prettierrc                 # Prettier配置
└── README.md                   # 项目说明
```

---

## 三、数据库设计

### 3.1 MySQL数据库表

#### 3.1.1 用户表（user_info）

```sql
CREATE TABLE `user_info` (
  `id` varchar(36) NOT NULL COMMENT '用户ID',
  `openid` varchar(100) NOT NULL COMMENT '微信openid',
  `nickname` varchar(50) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `avatar` varchar(500) NOT NULL DEFAULT '' COMMENT '用户头像',
  `province` varchar(50) NOT NULL DEFAULT '' COMMENT '用户所在省份',
  `total_stars` decimal(4,1) NOT NULL DEFAULT 0.0 COMMENT '总星数',
  `level_count` int NOT NULL DEFAULT 0 COMMENT '通关关卡数',
  `coins` int NOT NULL DEFAULT 0 COMMENT '金币数',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_province` (`province`),
  KEY `idx_total_stars` (`total_stars`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';
```

#### 3.1.2 用户门票表（user_ticket）

```sql
CREATE TABLE `user_ticket` (
  `id` varchar(36) NOT NULL COMMENT '记录ID',
  `user_id` varchar(36) NOT NULL COMMENT '用户ID',
  `adventure_tickets` int NOT NULL DEFAULT 30 COMMENT '闯关门票数',
  `random_tickets` int NOT NULL DEFAULT 3 COMMENT '随机门票数',
  `last_adventure_recover` datetime DEFAULT NULL COMMENT '上次闯关门票恢复时间',
  `daily_reset_time` datetime DEFAULT NULL COMMENT '每日重置时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  CONSTRAINT `fk_user_ticket_user` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户门票表';
```

#### 3.1.3 用户道具表（user_item）

```sql
CREATE TABLE `user_item` (
  `id` varchar(36) NOT NULL COMMENT '记录ID',
  `user_id` varchar(36) NOT NULL COMMENT '用户ID',
  `item_type` varchar(32) NOT NULL COMMENT '道具类型',
  `quantity` int NOT NULL DEFAULT 0 COMMENT '数量',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_item` (`user_id`, `item_type`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_user_item_user` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户道具表';
```

#### 3.1.4 区域表（region_info）

```sql
CREATE TABLE `region_info` (
  `id` varchar(36) NOT NULL COMMENT '区域ID',
  `name` varchar(50) NOT NULL COMMENT '区域名称',
  `code` varchar(20) NOT NULL COMMENT '区域代码',
  `country_count` int NOT NULL DEFAULT 0 COMMENT '国家数量',
  `city_count` int NOT NULL DEFAULT 0 COMMENT '城市数量',
  `level_count` int NOT NULL DEFAULT 0 COMMENT '关卡数量',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='区域信息表';
```

#### 3.1.5 国家表（country_info）

```sql
CREATE TABLE `country_info` (
  `id` varchar(36) NOT NULL COMMENT '国家ID',
  `name` varchar(50) NOT NULL COMMENT '国家名称',
  `code` varchar(10) NOT NULL COMMENT '国家代码',
  `region_id` varchar(36) NOT NULL COMMENT '区域ID',
  `flag` varchar(500) DEFAULT NULL COMMENT '国旗图片URL',
  `province_count` int NOT NULL DEFAULT 0 COMMENT '省份数量',
  `city_count` int NOT NULL DEFAULT 0 COMMENT '城市数量',
  `level_count` int NOT NULL DEFAULT 0 COMMENT '关卡数量',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_region_id` (`region_id`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_country_region` FOREIGN KEY (`region_id`) REFERENCES `region_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='国家信息表';
```

#### 3.1.6 省份表（province_info）

```sql
CREATE TABLE `province_info` (
  `id` varchar(36) NOT NULL COMMENT '省份ID',
  `name` varchar(50) NOT NULL COMMENT '省份名称',
  `country_id` varchar(36) NOT NULL COMMENT '国家ID',
  `city_count` int NOT NULL DEFAULT 0 COMMENT '城市数量',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_country_id` (`country_id`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_province_country` FOREIGN KEY (`country_id`) REFERENCES `country_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='省份信息表';
```

#### 3.1.7 城市表（city_info）

```sql
CREATE TABLE `city_info` (
  `id` varchar(36) NOT NULL COMMENT '城市ID',
  `name` varchar(50) NOT NULL COMMENT '城市名称',
  `province_id` varchar(36) NOT NULL COMMENT '省份ID',
  `ancient_name` varchar(50) DEFAULT NULL COMMENT '古称',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `population` int DEFAULT NULL COMMENT '人口',
  `is_capital` tinyint NOT NULL DEFAULT 0 COMMENT '是否省会',
  `description` text COMMENT '描述',
  `landmarks` json DEFAULT NULL COMMENT '地标',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_province_id` (`province_id`),
  KEY `idx_name` (`name`),
  KEY `idx_ancient_name` (`ancient_name`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_city_province` FOREIGN KEY (`province_id`) REFERENCES `province_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市信息表';
```

#### 3.1.8 关卡表（level_info）

```sql
CREATE TABLE `level_info` (
  `id` varchar(36) NOT NULL COMMENT '关卡ID',
  `level_name` varchar(100) NOT NULL COMMENT '关卡名称',
  `region_id` varchar(36) NOT NULL COMMENT '区域ID',
  `country_id` varchar(36) NOT NULL COMMENT '国家ID',
  `level_order` int NOT NULL COMMENT '关卡顺序',
  `difficulty` decimal(2,1) NOT NULL DEFAULT 1.0 COMMENT '难度等级',
  `question_count` int NOT NULL DEFAULT 10 COMMENT '题目数量',
  `max_blood` int NOT NULL DEFAULT 3 COMMENT '最大血量',
  `time_limit` int NOT NULL DEFAULT 0 COMMENT '时间限制(秒)',
  `play_count` int NOT NULL DEFAULT 0 COMMENT '游玩次数',
  `complete_count` int NOT NULL DEFAULT 0 COMMENT '通关次数',
  `avg_accuracy` decimal(4,2) DEFAULT NULL COMMENT '平均正确率',
  `avg_time` int DEFAULT NULL COMMENT '平均用时(秒)',
  `star_distribution` json DEFAULT NULL COMMENT '星级分布',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_country_order` (`country_id`, `level_order`),
  KEY `idx_region_id` (`region_id`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_level_region` FOREIGN KEY (`region_id`) REFERENCES `region_info` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_level_country` FOREIGN KEY (`country_id`) REFERENCES `country_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关卡信息表';
```

#### 3.1.9 题目表（question_bank）

```sql
CREATE TABLE `question_bank` (
  `id` varchar(36) NOT NULL COMMENT '题目ID',
  `question_type` tinyint NOT NULL COMMENT '题目类型',
  `question_content` text NOT NULL COMMENT '题目内容',
  `question_image` varchar(500) DEFAULT NULL COMMENT '题目图片',
  `options` json NOT NULL COMMENT '选项',
  `correct_answer` varchar(10) NOT NULL COMMENT '正确答案',
  `difficulty` int NOT NULL DEFAULT 1 COMMENT '难度',
  `region` varchar(50) NOT NULL COMMENT '地区',
  `used_count` int NOT NULL DEFAULT 0 COMMENT '使用次数',
  `correct_rate` decimal(4,2) DEFAULT NULL COMMENT '正确率',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_question_type` (`question_type`),
  KEY `idx_region` (`region`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目库表';
```

#### 3.1.10 商店商品表（shop_item）

```sql
CREATE TABLE `shop_item` (
  `id` varchar(36) NOT NULL COMMENT '商品ID',
  `item_name` varchar(100) NOT NULL COMMENT '商品名称',
  `item_type` varchar(32) NOT NULL COMMENT '商品类型',
  `price` int NOT NULL COMMENT '价格',
  `quantity` int NOT NULL COMMENT '数量',
  `icon` varchar(500) DEFAULT NULL COMMENT '图标',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `sold_count` int NOT NULL DEFAULT 0 COMMENT '售出数量',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_item_type` (`item_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商店商品表';
```

#### 3.1.11 用户反馈表（user_feedback）

```sql
CREATE TABLE `user_feedback` (
  `id` varchar(36) NOT NULL COMMENT '反馈ID',
  `user_id` varchar(36) NOT NULL COMMENT '用户ID',
  `feedback_type` varchar(16) NOT NULL COMMENT '反馈类型',
  `content` text NOT NULL COMMENT '反馈内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0待处理/1已处理/2已关闭',
  `reply` text COMMENT '回复内容',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_feedback_type` (`feedback_type`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';
```

#### 3.1.12 管理员表（admin_info）

```sql
CREATE TABLE `admin_info` (
  `id` varchar(36) NOT NULL COMMENT '管理员ID',
  `username` varchar(32) NOT NULL COMMENT '登录账号',
  `password` varchar(128) NOT NULL COMMENT '密码',
  `real_name` varchar(32) NOT NULL COMMENT '真实姓名',
  `role_id` varchar(36) NOT NULL COMMENT '角色ID',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用/0禁用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(64) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员信息表';
```

#### 3.1.13 角色表（role_info）

```sql
CREATE TABLE `role_info` (
  `id` varchar(36) NOT NULL COMMENT '角色ID',
  `role_name` varchar(32) NOT NULL COMMENT '角色名称',
  `description` varchar(256) DEFAULT NULL COMMENT '角色描述',
  `permissions` json NOT NULL COMMENT '权限配置',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色信息表';
```

#### 3.1.14 操作日志表（admin_log）

```sql
CREATE TABLE `admin_log` (
  `id` varchar(36) NOT NULL COMMENT '日志ID',
  `admin_id` varchar(36) NOT NULL COMMENT '管理员ID',
  `admin_name` varchar(32) NOT NULL COMMENT '管理员账号',
  `action_type` varchar(32) NOT NULL COMMENT '操作类型',
  `module` varchar(32) NOT NULL COMMENT '操作模块',
  `content` text COMMENT '操作内容',
  `ip_address` varchar(64) NOT NULL COMMENT 'IP地址',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';
```

#### 3.1.15 每日推荐表（daily_recommend）

```sql
CREATE TABLE `daily_recommend` (
  `id` varchar(36) NOT NULL COMMENT '推荐ID',
  `recommend_date` date NOT NULL COMMENT '推荐日期',
  `type` varchar(16) NOT NULL COMMENT '类型：city/country',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `subtitle` varchar(100) DEFAULT NULL COMMENT '副标题',
  `content` json NOT NULL COMMENT '推荐内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `tags` json DEFAULT NULL COMMENT '标签',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0待发布/1已发布',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_recommend_date` (`recommend_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日推荐表';
```

### 3.2 MongoDB数据库集合

#### 3.2.1 用户进度集合（user_progress）

```typescript
interface IUserProgress {
  userId: string
  province: string
  unlockedLevels: string[]
  currentLevel: string
  levelStars: Map<string, number>
  completedLevels: string[]
  unlockedCountries: string[]
  unlockedRegions: string[]
  createdAt: Date
  updatedAt: Date
}
```

#### 3.2.2 游戏记录集合（game_record）

```typescript
interface IGameRecord {
  userId: string
  levelId: string
  sessionId: string
  timeSpent: number
  correctCount: number
  wrongCount: number
  accuracy: number
  stars: number
  isSuccess: boolean
  answers: Array<{
    questionType: number
    cityId: string
    cityName: string
    provinceId?: string
    provinceName?: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    timeSpent: number
  }>
  createdAt: Date
}
```

#### 3.2.3 关卡会话集合（level_session）

```typescript
interface ILevelSession {
  sessionId: string
  userId: string
  levelId: string
  status: 'playing' | 'completed' | 'abandoned'
  startedAt: Date
  endedAt?: Date
  currentQuestion: number
  correctCount: number
  wrongCount: number
  currentBlood: number
  createdAt: Date
  updatedAt: Date
}
```

#### 3.2.4 答题失败记录集合（answer_fail_record）

```typescript
interface IAnswerFailRecord {
  sessionId: string
  levelId: string
  userId: string
  questionType: number
  questionContent: string
  cityId: string
  cityName: string
  provinceId?: string
  provinceName?: string
  userAnswer: string
  correctAnswer: string
  options: Array<{ key: string; value: string }>
  timeSpent: number
  createdAt: Date
}
```

---

## 四、API接口设计

### 4.1 接口规范

#### 4.1.1 基础信息

| 项目 | 内容 |
|------|------|
| API基础路径 | `/api/v1` |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

#### 4.1.2 响应格式

**成功响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**失败响应：**
```json
{
  "code": 400,
  "message": "参数错误",
  "data": null
}
```

#### 4.1.3 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权或token无效 |
| 403 | 已登录无权限 |
| 404 | 资源不存在 |
| 405 | 方法不存在 |
| 409 | 数据冲突 |
| 422 | 请求参数验证失败 |
| 429 | 超出请求频率 |
| 500 | 服务器内部错误 |

### 4.2 小程序端接口

#### 4.2.1 用户模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 微信登录 | POST | /user/login | 微信授权登录 |
| 获取用户信息 | GET | /user/info | 获取用户详细信息 |
| 更新用户信息 | PUT | /user/info | 更新用户信息 |
| 初始化省份 | POST | /user/init-province | 用户初始化省份 |
| 获取门票状态 | GET | /user/tickets | 获取门票数量和恢复状态 |

#### 4.2.2 关卡模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取区域列表 | GET | /level/regions | 获取所有区域列表 |
| 获取国家列表 | GET | /level/countries | 根据区域获取国家列表 |
| 获取省份列表 | GET | /level/provinces | 根据国家获取省份列表 |
| 获取城市列表 | GET | /level/cities | 获取城市数据 |
| 获取单个城市 | GET | /level/cities/:id | 获取单个城市详情 |
| 获取关卡列表 | GET | /level/list | 获取关卡分页列表 |
| 获取关卡详情 | GET | /level/:id | 获取关卡详细信息 |
| 开始关卡 | POST | /level/:id/start | 开始关卡 |
| 记录答题失败 | POST | /level/answer/fail | 答题失败记录 |
| 完成关卡 | POST | /level/:id/complete | 完成关卡 |
| 放弃关卡 | POST | /level/:id/abandon | 放弃关卡 |

#### 4.2.3 题目模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取随机题目 | GET | /question/random | 获取随机题目 |
| 提交随机题目答案 | POST | /question/random/answer | 提交随机题目答案 |

#### 4.2.4 商店模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取商品列表 | GET | /shop/items | 获取商品列表 |
| 购买商品 | POST | /shop/items/:id/buy | 购买商品 |

#### 4.2.5 排行榜模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取排行榜 | GET | /rank/list | 获取排行榜 |

#### 4.2.6 反馈模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 提交反馈 | POST | /feedback/submit | 提交反馈 |

### 4.3 后台管理端接口

#### 4.3.1 认证模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 管理员登录 | POST | /admin/auth/login | 管理员登录 |
| 管理员登出 | POST | /admin/auth/logout | 退出登录 |
| 获取管理员信息 | GET | /admin/auth/info | 获取当前登录管理员信息 |

#### 4.3.2 用户管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取用户列表 | GET | /admin/user/list | 获取用户列表 |
| 获取用户详情 | GET | /admin/user/:id | 获取用户详情 |
| 创建用户 | POST | /admin/user | 创建用户 |
| 更新用户 | PUT | /admin/user/:id | 更新用户 |
| 删除用户 | DELETE | /admin/user/:id | 删除用户 |
| 批量删除用户 | POST | /admin/user/batch-delete | 批量删除用户 |

#### 4.3.3 关卡管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取关卡列表 | GET | /admin/level/list | 获取关卡列表 |
| 获取关卡详情 | GET | /admin/level/:id | 获取关卡详情 |
| 创建关卡 | POST | /admin/level | 创建关卡 |
| 更新关卡 | PUT | /admin/level/:id | 更新关卡 |
| 删除关卡 | DELETE | /admin/level/:id | 删除关卡 |
| 批量删除关卡 | POST | /admin/level/batch-delete | 批量删除关卡 |
| 更新关卡状态 | PUT | /admin/level/:id/status | 更新关卡状态 |
| 获取答题失败统计 | GET | /admin/level/:id/fail-stats | 获取答题失败统计 |

#### 4.3.4 区域数据管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取区域列表 | GET | /admin/region/list | 获取区域列表 |
| 创建区域 | POST | /admin/region | 创建区域 |
| 更新区域 | PUT | /admin/region/:id | 更新区域 |
| 删除区域 | DELETE | /admin/region/:id | 删除区域 |

#### 4.3.5 国家数据管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取国家列表 | GET | /admin/country/list | 获取国家列表 |
| 创建国家 | POST | /admin/country | 创建国家 |
| 更新国家 | PUT | /admin/country/:id | 更新国家 |
| 删除国家 | DELETE | /admin/country/:id | 删除国家 |

#### 4.3.6 省份/城市数据管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取省份列表 | GET | /admin/province/list | 获取省份列表 |
| 创建省份 | POST | /admin/province | 创建省份 |
| 更新省份 | PUT | /admin/province/:id | 更新省份 |
| 删除省份 | DELETE | /admin/province/:id | 删除省份 |
| 获取城市列表 | GET | /admin/city/list | 获取城市列表 |
| 创建城市 | POST | /admin/city | 创建城市 |
| 更新城市 | PUT | /admin/city/:id | 更新城市 |
| 删除城市 | DELETE | /admin/city/:id | 删除城市 |
| 批量导入城市 | POST | /admin/city/import | 批量导入城市 |
| 获取导入进度 | GET | /admin/city/import/:taskId | 获取导入进度 |

#### 4.3.7 题目管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取题目列表 | GET | /admin/question/list | 获取题目列表 |
| 获取题目详情 | GET | /admin/question/:id | 获取题目详情 |
| 创建题目 | POST | /admin/question | 创建题目 |
| 更新题目 | PUT | /admin/question/:id | 更新题目 |
| 删除题目 | DELETE | /admin/question/:id | 删除题目 |
| 批量删除题目 | POST | /admin/question/batch-delete | 批量删除题目 |
| 批量导入题目 | POST | /admin/question/import | 批量导入题目 |
| 批量导出题目 | GET | /admin/question/export | 批量导出题目 |

#### 4.3.8 商店管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取商品列表 | GET | /admin/shop/items | 获取商品列表 |
| 创建商品 | POST | /admin/shop/items | 创建商品 |
| 更新商品 | PUT | /admin/shop/items/:id | 更新商品 |
| 删除商品 | DELETE | /admin/shop/items/:id | 删除商品 |

#### 4.3.9 排行榜管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取排行榜 | GET | /admin/rank/list | 获取排行榜 |

#### 4.3.10 反馈管理模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取反馈列表 | GET | /admin/feedback/list | 获取反馈列表 |
| 获取反馈详情 | GET | /admin/feedback/:id | 获取反馈详情 |
| 回复反馈 | PUT | /admin/feedback/:id/reply | 回复反馈 |
| 删除反馈 | DELETE | /admin/feedback/:id | 删除反馈 |

#### 4.3.11 数据统计模块

| 接口名称 | 请求方式 | 接口路径 | 说明 |
|----------|----------|----------|------|
| 获取仪表盘数据 | GET | /admin/dashboard | 获取仪表盘数据 |

---

## 五、核心业务逻辑

### 5.1 星级评价规则

**基本规则：**
- 评价单位：星星（可半星，如3.5星）
- 满分：5星
- 完美评价：6星（100%正确率 + 时间达标）

**星级计算公式：**
```
基础星级计算：
- 正确率 100% → 5星
- 正确率 90-99% → 4.5星
- 正确率 80-89% → 4星
- 正确率 70-79% → 3.5星
- 正确率 60-69% → 3星
- 正确率 50-59% → 2.5星
- 正确率 40-49% → 2星
- 正确率 30-39% → 1.5星
- 正确率 20-29% → 1星
- 正确率 <20% → 0.5星

时间加成计算：
- 平均答题时间 ≤ 5秒 → +1星
- 平均答题时间 5-10秒 → +0.5星
- 平均答题时间 > 10秒 → +0星

最终星级 = min(基础星级 + 时间加成, 6星)
```

### 5.2 门票恢复机制

**闯关门票：**
- 上限：30次
- 恢复机制：每10分钟恢复1次
- 恢复条件：门票数 < 30时开始恢复

**随机模式门票：**
- 上限：3次/天
- 恢复机制：每日0点重置为3次

### 5.3 关卡解锁规则

**层级设计：**
```
第1层：用户选择省份（初始解锁）
    ↓
第2层：相邻省份（闯关成功解锁）
    ↓
第3层：全国省份（逐步解锁）
    ↓
第4层：亚洲国家（解锁条件：完成20个关卡）
    ↓
第5层：中东国家（解锁条件：完成25个关卡）
    ↓
第6层：欧洲国家（解锁条件：完成30个关卡）
    ↓
第7层：非洲国家（解锁条件：完成35个关卡）
    ↓
第8层：美洲国家（解锁条件：完成40个关卡）
```

---

## 六、Docker部署配置

### 6.1 Dockerfile

```dockerfile
# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if(r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/server.js"]
```

### 6.2 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: citytrace-server-dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=citytrace_dev
      - DB_USER=root
      - DB_PASSWORD=root123456
      - MONGODB_HOST=mongodb
      - MONGODB_PORT=27017
      - MONGODB_NAME=citytrace_dev
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=dev-secret-key
      - LOG_LEVEL=debug
    volumes:
      - ./src:/app/src
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    depends_on:
      mysql:
        condition: service_healthy
      mongodb:
        condition: service_started
      redis:
        condition: service_started
    networks:
      - citytrace-network
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: citytrace-mysql-dev
    environment:
      - MYSQL_ROOT_PASSWORD=root123456
      - MYSQL_DATABASE=citytrace_dev
      - MYSQL_USER=citytrace
      - MYSQL_PASSWORD=citytrace123
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot123456"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - citytrace-network
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    container_name: citytrace-mongodb-dev
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=admin123456
      - MONGO_INITDB_DATABASE=citytrace_dev
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - citytrace-network
    restart: unless-stopped

  redis:
    image: redis:7.0-alpine
    container_name: citytrace-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --requirepass redis123456
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "redis123456", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - citytrace-network
    restart: unless-stopped

volumes:
  mysql-data:
    driver: local
  mongodb-data:
    driver: local
  redis-data:
    driver: local

networks:
  citytrace-network:
    driver: bridge
```

---

## 七、环境变量配置

### 7.1 开发环境变量（.env.development）

```bash
# 应用配置
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# 数据库配置 - MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=citytrace_dev
DB_USER=root
DB_PASSWORD=root123456
DB_POOL_MIN=5
DB_POOL_MAX=20

# 数据库配置 - MongoDB
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_NAME=citytrace_dev
MONGODB_USER=
MONGODB_PASSWORD=

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT配置
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=debug
LOG_DIR=logs

# 微信小程序配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 文件上传配置
UPLOAD_DIR=uploads
UPLOAD_MAX_SIZE=10485760

# CORS配置
CORS_ORIGIN=*
CORS_CREDENTIALS=true
```

---

## 八、性能要求

| 指标 | 要求 |
|------|------|
| 页面加载时间 | < 2秒（首屏） |
| 题目生成时间 | < 300ms（本地生成） |
| 接口响应时间 | < 500ms（95%请求） |
| 并发用户数 | 支持1000并发 |
| 数据库查询 | < 100ms（单次查询） |
| 图片加载 | < 1秒（压缩后） |

---

## 九、安全要求

| 安全项 | 要求 |
|--------|------|
| 数据传输 | HTTPS加密传输 |
| 用户数据 | 敏感信息加密存储 |
| 接口安全 | Token验证、防重放攻击 |
| 数据备份 | 每日自动备份 |
| 隐私保护 | 符合微信小程序隐私规范 |
| 密码存储 | bcrypt加密 |
| SQL注入防护 | 使用ORM参数化查询 |
| XSS防护 | 输入过滤、输出编码 |

---

## 十、测试要求

### 10.1 单元测试
- 覆盖率要求：≥80%
- 测试框架：Vitest
- 测试内容：所有Service层和工具函数

### 10.2 集成测试
- 测试框架：Vitest + Supertest
- 测试内容：所有API接口

### 10.3 性能测试
- 测试工具：Artillery或k6
- 测试内容：并发用户数、响应时间

---

## 十一、版本历史

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| v1.0 | 2026-03-25 | 初始版本 | 技术经理 |
