# 城迹小程序初始化开发 Spec

## Why
城迹是一款地理知识答题小程序，需要基于UniApp框架进行微信小程序开发。当前mini_program目录为空，需要从零开始搭建完整的小程序项目，实现用户系统、答题系统、商店系统、排行榜等核心功能。

## What Changes
- 创建UniApp项目基础结构，配置TypeScript + Vue 3 + Pinia技术栈
- 实现13个页面：启动页、授权页、省份初始化页、首页、关卡地图页、答题页、答题结果页、随机模式入口页、随机模式答题页、随机模式结果页、商店页、排行榜页、个人中心页、设置页
- 创建6个核心组件：题目卡片、星级组件、血量条、门票显示、关卡卡片、导航栏
- 实现状态管理：用户Store、游戏Store、商店Store
- 封装API接口层和工具函数
- 使用虚拟数据占位，数据结构与需求文档接口规范保持一致

## Impact
- Affected specs: 用户系统、答题系统、门票系统、星级系统、商店系统、随机模式系统、排行榜系统
- Affected code: mini_program目录下所有代码

## ADDED Requirements

### Requirement: 项目初始化
系统SHALL创建UniApp项目，使用Vue 3 + TypeScript + Pinia + Vite技术栈。

#### Scenario: 项目创建成功
- **WHEN** 执行项目初始化
- **THEN** 项目目录结构符合前端开发规范，包含pages、components、stores、api、utils、constants、static、styles等目录

### Requirement: 页面开发
系统SHALL实现所有页面，遵循用户交互设计规范中的页面布局和交互逻辑。

#### Scenario: 启动页实现
- **WHEN** 用户打开小程序
- **THEN** 显示品牌Logo（首次）或每日推荐卡片（非首次），支持倒计时跳转

#### Scenario: 授权页实现
- **WHEN** 未登录用户进入
- **THEN** 显示微信授权登录按钮，授权成功后跳转省份初始化页

#### Scenario: 省份初始化页实现
- **WHEN** 首次登录用户进入
- **THEN** 支持自动定位和手动选择省份，确认后跳转首页

#### Scenario: 首页实现
- **WHEN** 用户进入首页
- **THEN** 显示用户信息、门票状态、层级进度、区域主题、开始答题和随机模式入口

#### Scenario: 关卡地图页实现
- **WHEN** 用户点击开始答题
- **THEN** 显示关卡列表，支持区域主题切换，点击关卡可开始答题

#### Scenario: 答题页实现
- **WHEN** 用户开始闯关
- **THEN** 显示题目和选项，支持即时反馈正确/错误，完成后跳转结果页

#### Scenario: 答题结果页实现
- **WHEN** 用户完成答题
- **THEN** 显示星级评价、统计数据、解锁提示，支持重试/下一关/分享

#### Scenario: 随机模式入口页实现
- **WHEN** 用户点击随机模式
- **THEN** 显示3个随机选项（题目类型/商店/血池），支持选择后开始挑战

#### Scenario: 随机模式答题页实现
- **WHEN** 用户开始随机模式
- **THEN** 显示血量、答对题数、题目，答错扣血，血量为0结束

#### Scenario: 随机模式结果页实现
- **WHEN** 随机模式结束
- **THEN** 显示答对题数、获得金币、获得星星

#### Scenario: 商店页实现
- **WHEN** 用户进入商店
- **THEN** 显示门票兑换和道具购买列表，支持星星/金币兑换

#### Scenario: 排行榜页实现
- **WHEN** 用户进入排行榜
- **THEN** 显示星级榜/关卡榜切换，前三名特殊展示，底部显示我的排名

#### Scenario: 个人中心页实现
- **WHEN** 用户进入个人中心
- **THEN** 显示用户信息、数据统计、功能入口列表

#### Scenario: 设置页实现
- **WHEN** 用户进入设置
- **THEN** 显示设置选项列表

### Requirement: 组件开发
系统SHALL创建可复用的业务组件。

#### Scenario: 题目卡片组件
- **WHEN** 答题页/随机模式答题页使用
- **THEN** 显示题目内容、选项，支持选择交互和正确/错误反馈

#### Scenario: 星级组件
- **WHEN** 显示星级评价
- **THEN** 支持半星显示，支持0.5-6星范围

#### Scenario: 血量条组件
- **WHEN** 随机模式答题页使用
- **THEN** 显示当前血量，支持血量变化动画

#### Scenario: 门票显示组件
- **WHEN** 首页/关卡地图页使用
- **THEN** 显示闯关门票和随机门票数量及恢复状态

#### Scenario: 关卡卡片组件
- **WHEN** 关卡地图页使用
- **THEN** 显示关卡名称、星级、解锁状态

#### Scenario: 导航栏组件
- **WHEN** 需要自定义导航栏的页面使用
- **THEN** 显示标题、返回按钮，支持自定义样式

### Requirement: 状态管理
系统SHALL使用Pinia进行状态管理。

#### Scenario: 用户Store
- **WHEN** 需要用户状态
- **THEN** 提供token、userInfo、isLoggedIn等状态和login/logout等方法

#### Scenario: 游戏Store
- **WHEN** 需要游戏状态
- **THEN** 提供当前关卡、题目列表、答案记录、血量等状态

#### Scenario: 商店Store
- **WHEN** 需要商店状态
- **THEN** 提供商品列表、购买方法等

### Requirement: API接口封装
系统SHALL封装所有API接口，使用虚拟数据占位。

#### Scenario: 用户接口
- **WHEN** 调用用户相关API
- **THEN** 返回符合接口规范的虚拟数据

#### Scenario: 答题接口
- **WHEN** 调用答题相关API
- **THEN** 返回符合接口规范的虚拟数据

#### Scenario: 商店接口
- **WHEN** 调用商店相关API
- **THEN** 返回符合接口规范的虚拟数据

#### Scenario: 排行榜接口
- **WHEN** 调用排行榜相关API
- **THEN** 返回符合接口规范的虚拟数据

### Requirement: 样式规范
系统SHALL遵循用户交互设计规范中的色彩、字体、间距规范。

#### Scenario: 色彩规范
- **WHEN** 应用样式
- **THEN** 主色调#2E7D32，辅助色#4CAF50，强调色#FF9800，背景色#F5F5F5

#### Scenario: 字体规范
- **WHEN** 应用字体
- **THEN** 大标题24px，标题20px，正文16px，辅助文字14px，小字12px

#### Scenario: 间距规范
- **WHEN** 应用间距
- **THEN** 页面边距32rpx，模块间距40rpx，元素间距24rpx，文字间距16rpx

### Requirement: 工具函数
系统SHALL提供通用工具函数。

#### Scenario: 请求封装
- **WHEN** 发起API请求
- **THEN** 自动添加token、处理错误、显示loading

#### Scenario: 本地存储
- **WHEN** 存储数据
- **THEN** 支持带前缀的存储、获取、删除、清空操作

#### Scenario: 题目生成器
- **WHEN** 需要生成题目
- **THEN** 根据区域、难度、题型生成符合规范的题目

#### Scenario: 星级计算器
- **WHEN** 需要计算星级
- **THEN** 根据正确率和平均用时计算星级

#### Scenario: 门票管理器
- **WHEN** 需要管理门票
- **THEN** 支持门票恢复、消耗、获取状态等操作
