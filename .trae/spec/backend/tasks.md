# 城迹后端服务 - 开发任务清单

## 一、项目初始化任务

### 1.1 项目基础搭建
- [x] 创建项目目录结构
- [x] 初始化package.json，配置项目依赖
- [x] 配置TypeScript（tsconfig.json, tsconfig.build.json）
- [x] 配置ESLint和Prettier
- [x] 创建环境变量配置文件（.env.example）
- [x] 创建.gitignore文件
- [x] 创建README.md文档

### 1.2 Docker环境配置
- [x] 创建Dockerfile
- [x] 创建docker-compose.yml
- [x] 创建MySQL初始化脚本
- [x] 创建MongoDB初始化脚本
- [x] 配置数据卷和网络

### 1.3 基础配置模块
- [x] 创建数据库配置（src/config/database.ts）
- [x] 创建Redis配置（src/config/redis.ts）
- [x] 创建MongoDB配置（src/config/mongodb.ts）
- [x] 创建JWT配置（src/config/jwt.ts）
- [x] 创建日志配置（src/config/logger.ts）

---

## 二、数据模型开发任务

### 2.1 MySQL模型开发
- [x] 创建用户模型（src/models/mysql/UserInfo.ts）
- [x] 创建用户门票模型（src/models/mysql/UserTicket.ts）
- [x] 创建用户道具模型（src/models/mysql/UserItem.ts）
- [x] 创建区域模型（src/models/mysql/RegionInfo.ts）
- [x] 创建国家模型（src/models/mysql/CountryInfo.ts）
- [x] 创建省份模型（src/models/mysql/ProvinceInfo.ts）
- [x] 创建城市模型（src/models/mysql/CityInfo.ts）
- [x] 创建关卡模型（src/models/mysql/LevelInfo.ts）
- [x] 创建题目模型（src/models/mysql/QuestionBank.ts）
- [x] 创建商店商品模型（src/models/mysql/ShopItem.ts）
- [x] 创建用户反馈模型（src/models/mysql/UserFeedback.ts）
- [x] 创建管理员模型（src/models/mysql/AdminInfo.ts）
- [x] 创建角色模型（src/models/mysql/RoleInfo.ts）
- [x] 创建操作日志模型（src/models/mysql/AdminLog.ts）
- [x] 创建每日推荐模型（src/models/mysql/DailyRecommend.ts）
- [x] 创建模型索引文件（src/models/mysql/index.ts）

### 2.2 MongoDB模型开发
- [x] 创建用户进度模型（src/models/mongodb/UserProgress.ts）
- [x] 创建游戏记录模型（src/models/mongodb/GameRecord.ts）
- [x] 创建关卡会话模型（src/models/mongodb/LevelSession.ts）
- [x] 创建答题失败记录模型（src/models/mongodb/AnswerFailRecord.ts）
- [x] 创建模型索引文件（src/models/mongodb/index.ts）

---

## 三、工具函数开发任务

### 3.1 核心工具
- [x] 创建JWT工具（src/utils/jwt.ts）
- [x] 创建加密工具（src/utils/crypto.ts）
- [x] 创建验证工具（src/utils/validator.ts）
- [x] 创建格式化工具（src/utils/formatter.ts）
- [x] 创建响应工具（src/utils/response.ts）
- [x] 创建日志工具（src/utils/logger.ts）

### 3.2 常量定义
- [x] 创建错误码常量（src/constants/error.ts）
- [x] 创建状态码常量（src/constants/status.ts）
- [x] 创建配置常量（src/constants/config.ts）
- [x] 创建常量索引文件（src/constants/index.ts）

### 3.3 类型定义
- [x] 创建用户类型（src/types/user.ts）
- [x] 创建关卡类型（src/types/level.ts）
- [x] 创建题目类型（src/types/question.ts）
- [x] 创建商店类型（src/types/shop.ts）
- [x] 创建排行榜类型（src/types/rank.ts）
- [x] 创建反馈类型（src/types/feedback.ts）
- [x] 创建通用类型（src/types/common.ts）
- [x] 创建类型索引文件（src/types/index.ts）

---

## 四、中间件开发任务

### 4.1 核心中间件
- [x] 创建认证中间件（src/middlewares/auth.middleware.ts）
- [x] 创建后台管理中间件（src/middlewares/admin.middleware.ts）
- [x] 创建错误处理中间件（src/middlewares/error.middleware.ts）
- [x] 创建日志中间件（src/middlewares/logger.middleware.ts）
- [x] 创建验证中间件（src/middlewares/validate.middleware.ts）

---

## 五、验证器开发任务

### 5.1 数据验证器
- [x] 创建用户验证器（src/validators/user.validator.ts）
- [x] 创建关卡验证器（src/validators/level.validator.ts）
- [x] 创建题目验证器（src/validators/question.validator.ts）
- [x] 创建验证器索引文件（src/validators/index.ts）

---

## 六、服务层开发任务

### 6.1 用户服务
- [x] 创建用户服务（src/services/user/user.service.ts）
  - [x] 微信登录功能
  - [x] 获取用户信息功能
  - [x] 更新用户信息功能
  - [x] 初始化省份功能
  - [x] 获取门票状态功能
  - [x] 门票恢复机制
- [x] 创建服务索引文件（src/services/user/index.ts）

### 6.2 关卡服务
- [x] 创建关卡服务（src/services/level/level.service.ts）
  - [x] 获取区域列表功能
  - [x] 获取国家列表功能
  - [x] 获取省份列表功能
  - [x] 获取城市列表功能
  - [x] 获取关卡列表功能
  - [x] 获取关卡详情功能
  - [x] 开始关卡功能
  - [x] 记录答题失败功能
  - [x] 完成关卡功能
  - [x] 放弃关卡功能
  - [x] 关卡解锁逻辑
- [x] 创建服务索引文件（src/services/level/index.ts）

### 6.3 题目服务
- [x] 创建题目服务（src/services/question/question.service.ts）
  - [x] 获取随机题目功能
  - [x] 提交随机题目答案功能
- [x] 创建服务索引文件（src/services/question/index.ts）

### 6.4 商店服务
- [x] 创建商店服务（src/services/shop/shop.service.ts）
  - [x] 获取商品列表功能
  - [x] 购买商品功能
  - [x] 星星兑换功能
- [x] 创建服务索引文件（src/services/shop/index.ts）

### 6.5 排行榜服务
- [x] 创建排行榜服务（src/services/rank/rank.service.ts）
  - [x] 获取排行榜功能
  - [x] 获取用户排名功能
- [x] 创建服务索引文件（src/services/rank/index.ts）

### 6.6 反馈服务
- [x] 创建反馈服务（src/services/feedback/feedback.service.ts）
  - [x] 提交反馈功能
- [x] 创建服务索引文件（src/services/feedback/index.ts）

### 6.7 后台管理服务
- [x] 创建后台认证服务（src/services/admin/auth.service.ts）
  - [x] 管理员登录功能
  - [x] 管理员登出功能
  - [x] 获取管理员信息功能
- [x] 创建后台用户服务（src/services/admin/user.service.ts）
  - [x] 获取用户列表功能
  - [x] 获取用户详情功能
  - [x] 创建用户功能
  - [x] 更新用户功能
  - [x] 删除用户功能
  - [x] 批量删除用户功能
- [x] 创建后台关卡服务（src/services/admin/level.service.ts）
  - [x] 获取关卡列表功能
  - [x] 获取关卡详情功能
  - [x] 创建关卡功能
  - [x] 更新关卡功能
  - [x] 删除关卡功能
  - [x] 批量删除关卡功能
  - [x] 更新关卡状态功能
  - [x] 获取答题失败统计功能
- [x] 创建后台区域服务（src/services/admin/region.service.ts）
  - [x] 获取区域列表功能
  - [x] 创建区域功能
  - [x] 更新区域功能
  - [x] 删除区域功能
- [x] 创建后台国家服务（src/services/admin/country.service.ts）
  - [x] 获取国家列表功能
  - [x] 创建国家功能
  - [x] 更新国家功能
  - [x] 删除国家功能
- [x] 创建后台省份服务（src/services/admin/province.service.ts）
  - [x] 获取省份列表功能
  - [x] 创建省份功能
  - [x] 更新省份功能
  - [x] 删除省份功能
- [x] 创建后台城市服务（src/services/admin/city.service.ts）
  - [x] 获取城市列表功能
  - [x] 创建城市功能
  - [x] 更新城市功能
  - [x] 删除城市功能
  - [x] 批量导入城市功能
  - [x] 获取导入进度功能
- [x] 创建后台题目服务（src/services/admin/question.service.ts）
  - [x] 获取题目列表功能
  - [x] 获取题目详情功能
  - [x] 创建题目功能
  - [x] 更新题目功能
  - [x] 删除题目功能
  - [x] 批量删除题目功能
  - [x] 批量导入题目功能
  - [x] 批量导出题目功能
- [x] 创建后台商店服务（src/services/admin/shop.service.ts）
  - [x] 获取商品列表功能
  - [x] 创建商品功能
  - [x] 更新商品功能
  - [x] 删除商品功能
- [x] 创建后台排行榜服务（src/services/admin/rank.service.ts）
  - [x] 获取排行榜功能
- [x] 创建后台反馈服务（src/services/admin/feedback.service.ts）
  - [x] 获取反馈列表功能
  - [x] 获取反馈详情功能
  - [x] 回复反馈功能
  - [x] 删除反馈功能
- [x] 创建后台统计服务（src/services/admin/dashboard.service.ts）
  - [x] 获取仪表盘数据功能
- [x] 创建服务索引文件（src/services/admin/index.ts）

---

## 七、控制器开发任务

### 7.1 小程序端控制器
- [x] 创建用户控制器（src/controllers/user/user.controller.ts）
- [x] 创建关卡控制器（src/controllers/level/level.controller.ts）
- [x] 创建题目控制器（src/controllers/question/question.controller.ts）
- [x] 创建商店控制器（src/controllers/shop/shop.controller.ts）
- [x] 创建排行榜控制器（src/controllers/rank/rank.controller.ts）
- [x] 创建反馈控制器（src/controllers/feedback/feedback.controller.ts）

### 7.2 后台管理端控制器
- [x] 创建后台认证控制器（src/controllers/admin/auth.controller.ts）
- [x] 创建后台用户控制器（src/controllers/admin/user.controller.ts）
- [x] 创建后台关卡控制器（src/controllers/admin/level.controller.ts）
- [x] 创建后台区域控制器（src/controllers/admin/region.controller.ts）
- [x] 创建后台国家控制器（src/controllers/admin/country.controller.ts）
- [x] 创建后台省份控制器（src/controllers/admin/province.controller.ts）
- [x] 创建后台城市控制器（src/controllers/admin/city.controller.ts）
- [x] 创建后台题目控制器（src/controllers/admin/question.controller.ts）
- [x] 创建后台商店控制器（src/controllers/admin/shop.controller.ts）
- [x] 创建后台排行榜控制器（src/controllers/admin/rank.controller.ts）
- [x] 创建后台反馈控制器（src/controllers/admin/feedback.controller.ts）
- [x] 创建后台统计控制器（src/controllers/admin/dashboard.controller.ts）

---

## 八、路由开发任务

### 8.1 小程序端路由
- [x] 创建用户路由（src/routes/user.routes.ts）
- [x] 创建关卡路由（src/routes/level.routes.ts）
- [x] 创建题目路由（src/routes/question.routes.ts）
- [x] 创建商店路由（src/routes/shop.routes.ts）
- [x] 创建排行榜路由（src/routes/rank.routes.ts）
- [x] 创建反馈路由（src/routes/feedback.routes.ts）

### 8.2 后台管理端路由
- [x] 创建后台认证路由（src/routes/admin/auth.routes.ts）
- [x] 创建后台用户路由（src/routes/admin/user.routes.ts）
- [x] 创建后台关卡路由（src/routes/admin/level.routes.ts）
- [x] 创建后台区域路由（src/routes/admin/region.routes.ts）
- [x] 创建后台国家路由（src/routes/admin/country.routes.ts）
- [x] 创建后台省份路由（src/routes/admin/province.routes.ts）
- [x] 创建后台城市路由（src/routes/admin/city.routes.ts）
- [x] 创建后台题目路由（src/routes/admin/question.routes.ts）
- [x] 创建后台商店路由（src/routes/admin/shop.routes.ts）
- [x] 创建后台排行榜路由（src/routes/admin/rank.routes.ts）
- [x] 创建后台反馈路由（src/routes/admin/feedback.routes.ts）
- [x] 创建后台统计路由（src/routes/admin/dashboard.routes.ts）

### 8.3 路由入口
- [x] 创建路由入口文件（src/routes/index.ts）

---

## 九、应用入口开发任务

### 9.1 应用实例
- [x] 创建应用实例（src/app.ts）
  - [x] 配置Koa应用
  - [x] 配置中间件
  - [x] 配置路由
  - [x] 配置错误处理
  - [x] 配置CORS

### 9.2 服务器入口
- [x] 创建服务器入口（src/server.ts）
  - [x] 连接数据库
  - [x] 连接Redis
  - [x] 连接MongoDB
  - [x] 启动HTTP服务器
  - [x] 配置优雅关闭

---

## 十、测试开发任务

### 10.1 单元测试
- [ ] 创建测试配置（vitest.config.ts）
- [ ] 编写用户服务单元测试（tests/unit/user.service.test.ts）
- [ ] 编写关卡服务单元测试（tests/unit/level.service.test.ts）
- [ ] 编写题目服务单元测试（tests/unit/question.service.test.ts）
- [ ] 编写商店服务单元测试（tests/unit/shop.service.test.ts）
- [ ] 编写排行榜服务单元测试（tests/unit/rank.service.test.ts）
- [ ] 编写工具函数单元测试（tests/unit/utils.test.ts）

### 10.2 集成测试
- [ ] 编写用户接口集成测试（tests/integration/user.test.ts）
- [ ] 编写关卡接口集成测试（tests/integration/level.test.ts）
- [ ] 编写题目接口集成测试（tests/integration/question.test.ts）
- [ ] 编写商店接口集成测试（tests/integration/shop.test.ts）
- [ ] 编写排行榜接口集成测试（tests/integration/rank.test.ts）
- [ ] 编写后台管理接口集成测试（tests/integration/admin.test.ts）

---

## 十一、数据库初始化任务

### 11.1 MySQL初始化
- [x] 创建数据库初始化SQL脚本（docker/mysql/init/01_create_tables.sql）
- [x] 创建初始数据SQL脚本（docker/mysql/init/02_insert_data.sql）
  - [x] 初始化区域数据
  - [x] 初始化国家数据
  - [x] 初始化省份数据
  - [x] 初始化城市数据
  - [x] 初始化关卡数据
  - [x] 初始化商品数据
  - [x] 初始化角色数据
  - [x] 初始化管理员数据

### 11.2 MongoDB初始化
- [x] 创建索引初始化脚本（docker/mongodb/init/indexes.js）

---

## 十二、文档完善任务

### 12.1 API文档
- [ ] 创建API文档（docs/api.md）

### 12.2 部署文档
- [ ] 创建部署文档（docs/deployment.md）

### 12.3 开发文档
- [ ] 创建开发文档（docs/development.md）

---

## 十三、代码质量任务

### 13.1 代码检查
- [ ] 运行ESLint检查
- [ ] 修复ESLint错误
- [ ] 运行TypeScript类型检查
- [ ] 修复类型错误

### 13.2 代码优化
- [ ] 优化数据库查询
- [ ] 添加缓存机制
- [ ] 优化接口响应时间

---

## 十四、功能验证任务

### 14.1 小程序端功能验证
- [ ] 验证用户登录功能
- [ ] 验证用户信息功能
- [ ] 验证关卡功能
- [ ] 验证题目功能
- [ ] 验证商店功能
- [ ] 验证排行榜功能
- [ ] 验证反馈功能

### 14.2 后台管理端功能验证
- [ ] 验证管理员登录功能
- [ ] 验证用户管理功能
- [ ] 验证关卡管理功能
- [ ] 验证数据管理功能
- [ ] 验证题目管理功能
- [ ] 验证商店管理功能
- [ ] 验证排行榜管理功能
- [ ] 验证反馈管理功能
- [ ] 验证数据统计功能

### 14.3 Docker环境验证
- [ ] 验证Docker镜像构建
- [ ] 验证Docker Compose启动
- [ ] 验证数据库连接
- [ ] 验证Redis连接
- [ ] 验证MongoDB连接
- [ ] 验证服务启动
