# CityMemory Website — 城市猜猜猜 Web 端

## 项目概览
"城市猜猜猜" 是一款地理知识问答对战游戏的 Web 端，支持桌面端和移动端自适应布局。从 Figma 设计稿导出，使用 Figma Make Kit 生成基础代码。

## 技术栈
- **框架**: React 18 + TypeScript
- **构建**: Vite 6.3 + `@vitejs/plugin-react`
- **样式**: TailwindCSS 4.1 + Emotion (MUI)
- **UI 库**: MUI 7 + Radix UI (shadcn 风格组件) + Lucide Icons
- **路由**: 无 react-router，使用自定义 Screen 状态切换
- **动画**: Motion (framer-motion v12)
- **表单**: react-hook-form
- **图表**: Recharts
- **其他**: canvas-confetti, embla-carousel, react-dnd, sonner (toast)

## 目录结构
```
website/
├── CLAUDE.md                    # 本文件
├── AGENTS.md                    # Hermes Agent 指引
├── package.json                 # pnpm 管理
├── vite.config.ts               # Vite 配置 (含 figma asset resolver)
├── postcss.config.mjs
├── index.html                   # 入口 HTML
├── default_shadcn_theme.css     # 默认 shadcn 主题
├── guidelines/                  # Figma Make Kit 设计规范
│   └── Guidelines.md
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── app/
│   │   ├── App.tsx              # 主应用组件 (路由/导航/布局)
│   │   └── components/
│   │       ├── game-data.ts     # 游戏数据 (国家/省份/消息 MOCK)
│   │       ├── ThemeProvider.tsx # 暗色/亮色主题切换
│   │       ├── figma/           # Figma 工具组件
│   │       │   └── ImageWithFallback.tsx
│   │       ├── ui/              # shadcn/radix UI 基础组件 (~40个)
│   │       │   ├── button.tsx, card.tsx, dialog.tsx ...
│   │       │   └── utils.ts     # cn() 工具函数
│   │       └── [Screen 组件]    # 页面级组件 (见下方清单)
│   ├── imports/                 # Figma 导入的图片资源
│   │   ├── HighFidelityChekout/
│   │   └── Daccord-3/
│   └── styles/
│       ├── index.css            # 全局样式入口
│       ├── tailwind.css         # Tailwind 配置
│       ├── theme.css            # 主题变量
│       ├── fonts.css            # 字体定义
│       └── globals.css          # 全局基础样式
```

## 页面/组件清单

### 应用流程
```
SplashScreen → AuthScreen → [主界面]
```

### 主导航 (底部 Tab)
| Tab | 组件 | 说明 |
|-----|------|------|
| 首页 | HomeScreen | 地图选择 + 对战入口 |
| 排行 | LeaderboardScreen | 排行榜 |
| 消息 | MessagesScreen | 消息列表 |
| 我的 | ProfileScreen | 个人中心 |

### 子页面
| 组件 | 入口 | 说明 |
|------|------|------|
| BattleFlow | 首页"开始对战" | 答题对战流程 |
| SettingsScreen | 个人中心→设置 | 设置页 |
| FriendsScreen | 个人中心→好友 | 好友列表 |
| EditProfileScreen | 个人中心→编辑 | 编辑资料 |
| UserDetailScreen | 排行/好友点击用户 | 用户详情 |
| BattleDetailScreen | 个人中心→对战详情 | 对战记录详情 |
| AchievementsScreen | 个人中心→成就 | 成就系统 |
| AboutScreen | 设置→关于 | 关于页面 |
| ServiceAgreementScreen | 关于→服务协议 | 服务条款 |
| PrivacyPolicyScreen | 关于→隐私政策 | 隐私政策 |
| RateUsScreen | 关于→评分 | 评分页 |
| DesktopDashboard | 桌面端首页 | 桌面端 Dashboard |

## 导航/路由机制
- **无 react-router**，使用 `useState<Screen>` 手动切换页面
- `AppPhase`: `splash` → `auth` → `main`
- `Screen` 类型: `'home' | 'leaderboard' | 'messages' | 'profile' | 'settings' | 'friends' | ...`
- 桌面端 (md+) 使用左侧边栏 + DesktopDashboard
- 移动端使用底部 pill 样式导航栏
- 对战为全屏覆盖层 (`battleActive`)

## 状态管理
- **无 Redux/Zustand**，全部使用 React `useState` + props 传递
- 主要状态: phase, screen, battleActive, selectedCountry, userScore, userName, litProvinces, messages
- 主题状态: `ThemeProvider` Context (`useTheme`)
- 所有数据目前为 MOCK 数据 (`game-data.ts`)

## 样式方案
- **TailwindCSS 4.1** 为主要样式方案
- shadcn/ui CSS 变量体系 (hsl 主题色)
- `cn()` 工具函数: `clsx` + `tailwind-merge`
- 暗色模式: `ThemeProvider` 通过 class 切换
- MUI 仅用于少量复杂组件 (通过 `@emotion`)

## 开发命令
```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器 (Vite)
pnpm build        # 生产构建
```

## 代码规范
- 函数式组件 + Hooks
- 组件文件: PascalCase (如 `HomeScreen.tsx`)
- UI 组件放在 `src/app/components/ui/`
- 页面组件放在 `src/app/components/`
- 路径别名: `@` → `./src`
- Figma 资源导入: `figma:asset/xxx.png` (通过 vite 插件解析)

## 注意事项
- 当前所有数据为 MOCK，未对接后端 API
- 后端位于同级 `../server/` 目录 (Koa + TypeORM + PostgreSQL)
- 小程序位于同级 `../mini_program/` 目录 (Vue 3 + uni-app)
- 图片资源在 `src/imports/` 目录，使用 figma asset resolver 导入
- 项目名 `@figma/my-make-file` 表明从 Figma Make 导出，需逐步重构
