# Tasks

## Phase 1: 项目初始化

- [x] Task 1: 创建UniApp项目基础结构
  - [x] SubTask 1.1: 初始化UniApp项目，配置Vue 3 + TypeScript + Pinia + Vite
  - [x] SubTask 1.2: 创建标准目录结构（pages、components、stores、api、utils、constants、static、styles）
  - [x] SubTask 1.3: 配置pages.json页面路由
  - [x] SubTask 1.4: 配置manifest.json应用配置
  - [x] SubTask 1.5: 创建全局样式文件（variables.scss、common.scss、reset.scss）
  - [x] SubTask 1.6: 配置vite框架项目级配置

## Phase 2: 常量和类型定义

- [x] Task 2: 创建常量和类型定义
  - [x] SubTask 2.1: 创建constants/api.ts定义API地址常量
  - [x] SubTask 2.2: 创建constants/config.ts定义配置常量（门票上限、恢复时间等）
  - [x] SubTask 2.3: 创建constants/enums.ts定义枚举（题型、状态等）
  - [x] SubTask 2.4: 创建types目录，定义所有接口类型（UserInfo、Question、Level等）

## Phase 3: 工具函数

- [x] Task 3: 创建核心工具函数
  - [x] SubTask 3.1: 创建utils/request.ts请求封装
  - [x] SubTask 3.2: 创建utils/storage.ts本地存储封装
  - [x] SubTask 3.3: 创建utils/question-generator.ts题目生成器
  - [x] SubTask 3.4: 创建utils/star-calculator.ts星级计算器
  - [x] SubTask 3.5: 创建utils/ticket-manager.ts门票管理器

## Phase 4: API接口层

- [x] Task 4: 创建API接口封装（使用虚拟数据）
  - [x] SubTask 4.1: 创建api/user.ts用户接口
  - [x] SubTask 4.2: 创建api/level.ts关卡接口
  - [x] SubTask 4.3: 创建api/answer.ts答题接口
  - [x] SubTask 4.4: 创建api/shop.ts商店接口
  - [x] SubTask 4.5: 创建api/rank.ts排行榜接口

## Phase 5: 状态管理

- [x] Task 5: 创建Pinia Store
  - [x] SubTask 5.1: 创建stores/user.ts用户Store
  - [x] SubTask 5.2: 创建stores/game.ts游戏Store
  - [x] SubTask 5.3: 创建stores/shop.ts商店Store

## Phase 6: 公共组件

- [x] Task 6: 创建公共组件
  - [x] SubTask 6.1: 创建components/star-rating/index.vue星级组件
  - [x] SubTask 6.2: 创建components/health-bar/index.vue血量条组件
  - [x] SubTask 6.3: 创建components/ticket-display/index.vue门票显示组件
  - [x] SubTask 6.4: 创建components/level-card/index.vue关卡卡片组件
  - [x] SubTask 6.5: 创建components/nav-bar/index.vue导航栏组件
  - [x] SubTask 6.6: 创建components/question-card/index.vue题目卡片组件

## Phase 7: 页面开发 - 用户系统

- [x] Task 7: 创建启动页和授权页
  - [x] SubTask 7.1: 创建pages/splash/index.vue启动页
  - [x] SubTask 7.2: 创建pages/auth/index.vue授权页
  - [x] SubTask 7.3: 创建pages/province-init/index.vue省份初始化页

## Phase 8: 页面开发 - 首页和关卡

- [x] Task 8: 创建首页和关卡地图页
  - [x] SubTask 8.1: 创建pages/home/index.vue首页
  - [x] SubTask 8.2: 创建pages/level-map/index.vue关卡地图页

## Phase 9: 页面开发 - 闯关答题

- [x] Task 9: 创建答题相关页面
  - [x] SubTask 9.1: 创建pages/answer/index.vue答题页
  - [x] SubTask 9.2: 创建pages/answer-result/index.vue答题结果页

## Phase 10: 页面开发 - 随机模式

- [x] Task 10: 创建随机模式相关页面
  - [x] SubTask 10.1: 创建pages/random-entry/index.vue随机模式入口页
  - [x] SubTask 10.2: 创建pages/random-answer/index.vue随机模式答题页
  - [x] SubTask 10.3: 创建pages/random-result/index.vue随机模式结果页

## Phase 11: 页面开发 - 商店和排行榜

- [x] Task 11: 创建商店和排行榜页
  - [x] SubTask 11.1: 创建pages/shop/index.vue商店页
  - [x] SubTask 11.2: 创建pages/rank/index.vue排行榜页

## Phase 12: 页面开发 - 个人中心

- [x] Task 12: 创建个人中心和设置页
  - [x] SubTask 12.1: 创建pages/profile/index.vue个人中心页
  - [x] SubTask 12.2: 创建pages/settings/index.vue设置页

## Phase 13: 应用入口

- [x] Task 13: 创建应用入口文件
  - [x] SubTask 13.1: 创建App.vue应用入口
  - [x] SubTask 13.2: 创建main.js主入口
  - [x] SubTask 13.3: 创建静态资源占位文件

# Task Dependencies

- \[Task 2] depends on \[Task 1]
- \[Task 3] depends on \[Task 2]
- \[Task 4] depends on \[Task 2, Task 3]
- \[Task 5] depends on \[Task 2, Task 4]
- \[Task 6] depends on \[Task 2, Task 5]
- \[Task 7] depends on \[Task 5, Task 6]
- \[Task 8] depends on \[Task 5, Task 6]
- \[Task 9] depends on \[Task 5, Task 6]
- \[Task 10] depends on \[Task 5, Task 6]
- \[Task 11] depends on \[Task 5, Task 6]
- \[Task 12] depends on \[Task 5, Task 6]
- \[Task 13] depends on \[Task 1-12]

