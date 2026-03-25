---
alwaysApply: false
globs: 
  - 'manage/**/*'
---

前端后台管理端，核心规范如下：

## 技术栈
Vue 3.2+ + TypeScript 5.0+ + Vite 4.x + Vue Router 4.x + Pinia 2.x + Element Plus 2.x + Axios 1.x + ECharts 5.x

## 目录结构
- views/：页面视图
- components/：组件
- router/：路由配置
- stores/：Pinia状态管理
- api/：API接口
- utils/：工具函数
- composables/：组合式函数
- types/：类型定义
- assets/：静态资源

## 命名规范
- Vue组件：PascalCase（DataTable.vue）
- TS文件：camelCase（request.ts）
- 变量：camelCase（userName）
- 常量：UPPER_SNAKE_CASE（MAX_COUNT）
- 布尔值：is/has/can前缀（isLoading）
- CSS：BEM规范（.data_table__header）

## 组件编写顺序
导入语句 → Props定义 → Emits定义 → 路由和Store → 响应式数据 → 计算属性 → 监听器 → 方法 → 生命周期

## API请求
使用axios封装，支持loading提示、token认证、错误处理，通过localStorage持久化token

## 路由规范
使用Vue Router，路由懒加载，路由守卫控制权限（requiresAuth）

## 状态管理
使用Pinia，包含用户、应用、设置等Store

## 样式规范
使用SCSS，定义变量（$primary_color、$spacing_md），BEM命名，px单位

## 性能优化
路由懒加载、组件懒加载、防抖节流、代码分割

## 错误处理
全局错误处理（app.config.errorHandler），接口错误统一提示（ElMessage）