# 城迹小程序 - 前端项目

## 项目概述

城迹是一款地理知识答题微信小程序，通过闯关游戏和随机挑战形式帮助用户学习祖国大好河山及全球国家城市知识，寓教于乐。

## 技术栈

- **框架**: UniApp 3.x + Vue 3 + TypeScript
- **状态管理**: Pinia 2.x
- **构建工具**: Vite 4.x
- **样式**: SCSS
- **包管理器**: pnpm

## 项目结构

```
mini_program/
├── src/
│   ├── pages/              # 页面
│   │   ├── splash/         # 启动页（每日推荐）
│   │   ├── auth/           # 授权登录页
│   │   ├── province-init/  # 省份初始化页
│   │   ├── home/           # 首页
│   │   ├── level-map/      # 关卡地图页
│   │   ├── answer/         # 答题页（闯关模式）
│   │   ├── answer-result/   # 答题结果页
│   │   ├── random-entry/   # 随机模式入口页
│   │   ├── random-answer/   # 随机模式答题页
│   │   ├── random-result/   # 随机模式结果页
│   │   ├── shop/           # 商店页
│   │   ├── rank/           # 排行榜页
│   │   ├── profile/        # 个人中心页
│   │   └── settings/       # 设置页
│   ├── components/         # 公共组件
│   │   ├── question-card/  # 题目卡片组件
│   │   ├── star-rating/    # 星级评价组件
│   │   ├── health-bar/     # 血量条组件
│   │   └── ticket-display/ # 门票显示组件
│   ├── stores/            # Pinia状态管理
│   │   ├── user.ts         # 用户状态
│   │   ├── game.ts         # 游戏状态
│   │   └── shop.ts         # 商店状态
│   ├── api/               # API接口
│   ├── utils/             # 工具函数
│   │   ├── request.ts      # 请求封装
│   │   ├── storage.ts      # 本地存储
│   │   ├── question-generator.ts # 题目生成器
│   │   └── star-calculator.ts   # 星级计算器
│   ├── constants/         # 常量定义
│   ├── types/             # TypeScript类型定义
│   ├── styles/            # 全局样式
│   ├── App.vue            # 应用入口
│   ├── main.ts            # 主入口
│   ├── manifest.json       # 应用配置
│   └── pages.json         # 页面配置
├── package.json
├── vite.config.js
├── tsconfig.json
└── README.md
```

## 核心功能

### 1. 用户系统
- 微信授权登录
- 省份初始化（自动定位/手动选择）
- 用户信息管理

### 2. 答题系统
- 闯关模式：10道题目，无倒计时
- 随机模式：无限答题，血量机制
- 4种题型：城市猜省份、城市猜国家、古称猜今名、国旗猜国家
- 实时答题反馈

### 3. 星级系统
- 基于正确率和答题时间的星级计算
- 支持0.5星精度
- 最高6星（完美评价）

### 4. 门票系统
- 闯关门票：上限30次，每10分钟恢复1次
- 随机门票：上限3次/天，每日0点重置

### 5. 商店系统
- 星星商店：使用星星购买门票和道具
- 金币商店：使用金币购买道具

### 6. 排行榜系统
- 星星排行榜
- 关卡排行榜

## 安装和运行

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev:mp-weixin

# H5
pnpm dev:h5
```

### 生产构建

```bash
# 微信小程序
pnpm build:mp-weixin

# H5
pnpm build:h5
```

## 开发说明

### 使用假数据

当前项目使用假数据进行开发，所有API请求都会返回模拟数据。真实API对接时，只需修改 `src/api/index.ts` 中的接口调用即可。

### 题目生成

题目通过 `src/utils/question-generator.ts` 中的 `QuestionGenerator` 类生成，支持4种题型：

1. **城市猜省份**: 根据城市名称选择所属省份
2. **城市猜国家**: 根据城市名称选择所属国家
3. **古称猜今名**: 根据古代地名选择现代城市
4. **国旗猜国家**: 根据国旗emoji选择对应国家

### 星级计算

星级通过 `src/utils/star-calculator.ts` 中的 `StarCalculator` 类计算，计算规则：

- 基础星级：根据正确率计算（0.5-5星）
- 时间加成：平均答题时间≤5秒加1星，5-10秒加0.5星
- 最终星级：min(基础星级 + 时间加成, 6星)

### 状态管理

使用Pinia进行状态管理，主要Store：

1. **userStore**: 用户信息、登录状态、门票状态
2. **gameStore**: 游戏状态、题目数据、答题进度
3. **shopStore**: 商店数据、购买逻辑

## 设计规范

### 色彩规范

- 主色调: #2E7D32
- 辅助色: #4CAF50
- 强调色: #FF9800
- 背景色: #F5F5F5
- 文字主色: #212121
- 文字辅色: #757575
- 成功色: #4CAF50
- 失败色: #F44336
- 星星色: #FFD700

### 字体规范

- 大标题: 24px Bold
- 标题: 20px Medium
- 正文: 16px Regular
- 辅助文字: 14px Regular
- 小字: 12px Regular

### 间距规范

- 页面边距: 32rpx
- 模块间距: 40rpx
- 元素间距: 24rpx
- 文字间距: 16rpx

## 注意事项

1. **小程序配置**: 需要在 `src/manifest.json` 中配置微信小程序的appid
2. **API地址**: 在 `.env.development` 和 `.env.production` 中配置API基础地址
3. **图片资源**: 需要准备相应的图片资源放在 `src/static/` 目录下
4. **图标资源**: 需要准备底部导航栏的图标放在 `src/static/icons/` 目录下

## 待完善功能

以下功能已预留接口，待后端开发完成后对接：

1. 真实的微信登录接口
2. 用户数据持久化
3. 关卡数据动态加载
4. 商店购买逻辑
5. 排行榜数据加载
6. 分享功能
7. 用户反馈功能

## 许可证

MIT
