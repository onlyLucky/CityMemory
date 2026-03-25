---
alwaysApply: false
globs: 
  - 'server/**/*'
---
后端服务开发核心规范如下：

## 技术栈
Node.js 18.x+ + Koa 2.x + TypeScript 5.0+ + MySQL 8.0+ + Redis 7.0+ + MongoDB 6.0+ + Sequelize 6.x + Mongoose 7.x + JWT 9.x + Winston 3.x + Joi 17.x

## 目录结构
- config/：配置文件
- controllers/：控制器层
- services/：业务逻辑层
- models/：数据模型层
- middlewares/：中间件
- routes/：路由层
- utils/：工具函数
- types/：类型定义
- constants/：常量定义
- validators/：验证器

## 命名规范
- TS文件：kebab-case（user.controller.ts）
- 变量：camelCase（userName）
- 常量：UPPER_SNAKE_CASE（MAX_COUNT）
- 类名：PascalCase（UserService）
- 数据库表名：snake_case（user_info）
- 数据库字段名：snake_case（user_id）

## 控制器编写顺序
导入语句 → 类定义 → 私有属性 → 构造函数 → 公共方法（按功能分组）

## API设计
RESTful API设计，统一响应格式：{ code, message, data }

## 中间件
认证中间件（JWT验证）、权限中间件（admin验证）、验证中间件（Joi验证）、错误处理中间件、日志中间件

## 数据库规范
表名和字段名使用snake_case，主键使用UUID，为常用查询字段创建索引，使用外键保证数据完整性

## 验证器
使用Joi进行请求数据验证，定义清晰的验证规则和错误消息

## 性能优化
使用索引查询、分页查询、Redis缓存、只查询需要的字段、使用关联查询

## 错误处理
全局错误处理中间件，业务逻辑中抛出具体错误，统一错误码定义

## 安全规范
输入验证（Joi）、SQL注入防护（参数化查询）、XSS防护（xss库）、JWT认证

## 日志规范
使用Winston记录日志，区分日志级别（error、info、debug），日志文件持久化

## 测试规范
单元测试（Vitest）、集成测试（supertest），覆盖核心业务逻辑