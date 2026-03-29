# 城迹小程序

## 开发环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 安装依赖

```bash
pnpm install
```

## 开发命令

```bash
# 微信小程序开发
pnpm dev:mp-weixin

# H5 开发
pnpm dev:h5
```

## 构建命令

```bash
# 构建微信小程序
pnpm build:mp-weixin

# 构建 H5
pnpm build:h5
```

## 项目结构

```
mini_program/
├── src/
│   ├── api/              # API 接口
│   ├── components/       # 公共组件
│   ├── constants/        # 常量定义
│   ├── pages/            # 页面
│   ├── static/           # 静态资源
│   ├── stores/           # 状态管理
│   ├── styles/           # 样式文件
│   ├── types/            # 类型定义
│   ├── utils/            # 工具函数
│   ├── App.vue           # 应用入口
│   ├── main.ts           # 主入口
│   ├── manifest.json     # 应用配置
│   ├── pages.json        # 页面配置
│   └── uni.scss          # 全局样式变量
├── index.html            # H5 入口
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.js        # Vite 配置
```
