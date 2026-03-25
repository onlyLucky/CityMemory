---
alwaysApply: false
globs: 
  - 'mini_program/**/*'
---
uniapp小程序端开发，核心规范如下：

## 技术栈
UniApp + Vue + Pinia + TypeScript + Vite + uni-ui

## 目录结构
- pages/：页面
- components/：组件
- composables/：组合式函数
- stores/：Pinia状态管理
- api/：API接口
- utils/：工具函数
- constants/：常量定义
- static/：静态资源
- styles/：全局样式

## 命名规范
- Vue组件：PascalCase（QuestionCard.vue）
- TS文件：camelCase（useUser.ts）
- 变量：camelCase（userName）
- 常量：UPPER_SNAKE_CASE（MAX_COUNT）
- 布尔值：is/has/can前缀（isLoading）
- CSS：BEM规范（.question_card__title）

## 组件编写顺序
导入语句 → Props定义 → Emits定义 → 响应式数据 → 计算属性 → 监听器 → 方法 → 生命周期

## API请求
使用uni.request封装，支持loading提示、token认证、错误处理，通过uni.setStorageSync持久化token

## 页面生命周期
onLoad（初始化）→ onShow（刷新）→ onPullDownRefresh（下拉刷新）→ onReachBottom（触底加载）

## 性能优化
列表分页、图片lazy-load、防抖节流、v-show代替v-if、key优化列表

## 样式规范
使用SCSS，定义变量（$primary_color、$spacing_md），BEM命名，rpx单位

## 错误处理
全局错误处理（app.config.errorHandler），接口错误统一提示