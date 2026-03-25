# 城迹小程序 - 前端代码开发指导及规范

## 一、文档概述

### 1.1 文档目的

本文档定义"城迹"微信小程序前端开发的技术标准、编码规范、目录结构及开发流程，为前端开发团队提供统一的开发指南，确保代码质量和项目可维护性。

### 1.2 适用范围

- 小程序前端开发人员
- 代码审查人员
- 技术负责人

### 1.3 技术栈确认

| 技术组件       | 版本   | 用途    |
| ---------- | ---- | ----- |
| UniApp     | 3.x  | 跨平台框架 |
| Vue 3      | 3.2+ | 前端框架  |
| Pinia      | 2.x  | 状态管理  |
| TypeScript | 5.0+ | 类型系统  |
| Vite       | 4.x  | 构建工具  |
| uni-ui     | 1.5+ | UI组件库 |

***

## 二、项目目录结构

### 2.1 标准目录结构

```
mini_program/
├── .vscode/                    # VS Code配置
│   ├── settings.json           # 编辑器配置
│   └── extensions.json         # 推荐插件
├── src/                        # 源代码目录
│   ├── pages/                   # 页面
│   │   ├── splash/              # 启动页
│   │   │   └── index.vue
│   │   ├── auth/                # 授权页
│   │   │   └── index.vue
│   │   ├── province-init/       # 省份初始化
│   │   │   └── index.vue
│   │   ├── home/                # 首页
│   │   │   └── index.vue
│   │   ├── level-map/           # 关卡地图
│   │   │   └── index.vue
│   │   ├── answer/              # 答题页
│   │   │   └── index.vue
│   │   ├── answer-result/       # 答题结果
│   │   │   └── index.vue
│   │   ├── random-entry/        # 随机模式入口
│   │   │   └── index.vue
│   │   ├── random-answer/       # 随机模式答题
│   │   │   └── index.vue
│   │   ├── random-result/       # 随机模式结果
│   │   │   └── index.vue
│   │   ├── shop/                # 商店
│   │   │   └── index.vue
│   │   ├── rank/                # 排行榜
│   │   │   └── index.vue
│   │   ├── profile/             # 个人中心
│   │   │   └── index.vue
│   │   └── settings/            # 设置
│   │       └── index.vue
│   │
│   ├── components/              # 组件
│   │   ├── question-card/       # 题目卡片
│   │   │   └── index.vue
│   │   ├── star-rating/         # 星级组件
│   │   │   └── index.vue
│   │   ├── health-bar/          # 血量条
│   │   │   └── index.vue
│   │   ├── ticket-display/      # 门票显示
│   │   │   └── index.vue
│   │   ├── level-card/          # 关卡卡片
│   │   │   └── index.vue
│   │   └── nav-bar/             # 导航栏
│   │       └── index.vue
│   │
│   ├── composables/             # 组合式函数
│   │   ├── useUser.js           # 用户状态
│   │   ├── useGame.js           # 游戏状态
│   │   ├── useTicket.js         # 门票状态
│   │   └── useRequest.js       # 请求封装
│   │
│   ├── stores/                  # Pinia状态管理
│   │   ├── user.js              # 用户Store
│   │   ├── game.js              # 游戏Store
│   │   └── shop.js              # 商店Store
│   │
│   ├── api/                     # API接口
│   │   ├── user.js              # 用户接口
│   │   ├── level.js             # 关卡接口
│   │   ├── answer.js            # 答题接口
│   │   ├── shop.js              # 商店接口
│   │   └── rank.js              # 排行榜接口
│   │
│   ├── utils/                   # 工具函数
│   │   ├── request.js           # 请求封装
│   │   ├── storage.js           # 本地存储
│   │   ├── question-generator.js # 题目生成器
│   │   ├── star-calculator.js   # 星级计算器
│   │   └── ticket-manager.js    # 门票管理器
│   │
│   ├── constants/               # 常量定义
│   │   ├── api.js               # API地址
│   │   ├── config.js            # 配置常量
│   │   └── enums.js             # 枚举定义
│   │
│   ├── static/                  # 静态资源
│   │   ├── images/              # 图片
│   │   ├── icons/               # 图标
│   │   └── audio/               # 音效
│   │
│   ├── styles/                  # 全局样式
│   │   ├── variables.scss      # 变量定义
│   │   ├── mixins.scss         # 混入样式
│   │   ├── common.scss          # 通用样式
│   │   └── reset.scss          # 样式重置
│   │
│   ├── App.vue                  # 应用入口
│   ├── main.js                  # 主入口
│   ├── manifest.json            # 应用配置
│   └── pages.json               # 页面配置
│
├── uni_modules/                 # uni-app插件
├── .env                        # 环境变量
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── package.json                # 项目配置
├── vite.config.js              # Vite配置
├── tsconfig.json               # TypeScript配置
└── README.md                   # 项目说明
```

### 2.2 目录职责说明

| 目录          | 职责    | 说明             |
| ----------- | ----- | -------------- |
| pages       | 页面目录  | 小程序页面组件        |
| components  | 组件目录  | 公共组件和业务组件      |
| composables | 组合式函数 | 可复用的逻辑函数       |
| stores      | 状态管理  | Pinia状态管理      |
| api         | API接口 | 接口请求封装         |
| utils       | 工具函数  | 通用工具方法         |
| constants   | 常量定义  | API地址、配置常量、枚举值 |
| static      | 静态资源  | 图片、图标、音效等      |
| styles      | 全局样式  | 样式变量、混入、通用样式   |

***

## 三、命名规范

### 3.1 文件命名

| 类型           | 命名规范              | 示例                                   |
| ------------ | ----------------- | ------------------------------------ |
| Vue组件        | PascalCase        | `QuestionCard.vue`, `StarRating.vue` |
| TypeScript文件 | camelCase         | `useUser.ts`, `request.ts`           |
| 类型定义文件       | camelCase + .d.ts | `user.d.ts`, `api.d.ts`              |
| 样式文件         | kebab-case        | `variables.scss`, `common.scss`      |
| 图片资源         | kebab-case        | `logo-primary.png`, `icon-user.svg`  |
| 目录名          | kebab-case        | `question-card/`, `level-map/`       |

### 3.2 变量命名

| 类型   | 命名规范                   | 示例                                          |
| ---- | ---------------------- | ------------------------------------------- |
| 普通变量 | camelCase              | `userName`, `totalCount`                    |
| 常量   | UPPER\_SNAKE\_CASE     | `MAX_COUNT`, `API_BASE_URL`                 |
| 私有变量 | \_camelCase            | `_privateData`, `_internalState`            |
| 布尔值  | is/has/can + camelCase | `isLoading`, `hasPermission`, `canEdit`     |
| 数组   | 复数形式或List后缀            | `users`, `questionList`                     |
| 对象   | 单数形式                   | `user`, `question`                          |
| 函数   | 动词开头                   | `getUserList`, `handleSubmit`, `formatDate` |
| 异步函数 | async前缀或动词             | `asyncFetchData`, `loadUserData`            |
| 事件处理 | handle + 事件名           | `handleClick`, `handleSubmit`               |
| 回调函数 | on + 事件名               | `onSuccess`, `onError`                      |

### 3.3 组件命名

| 类型   | 命名规范       | 示例                           |
| ---- | ---------- | ---------------------------- |
| 页面组件 | 功能名 + Page | `HomePage`, `AnswerPage`     |
| 业务组件 | 功能描述       | `QuestionCard`, `StarRating` |
| 通用组件 | 功能描述       | `Pagination`, `SearchForm`   |

### 3.4 Props命名

| 类型   | 命名规范         | 示例                                  |
| ---- | ------------ | ----------------------------------- |
| 普通属性 | camelCase    | `userName`, `totalCount`            |
| 布尔属性 | is/has/can前缀 | `isVisible`, `hasBorder`, `canEdit` |
| 事件属性 | on前缀         | `onClick`, `onChange`               |
| 对象属性 | 具体名称         | `userInfo`, `config`                |

### 3.5 CSS命名（BEM规范）

```scss
.block {}
.block__element {}
.block__modifier {}

.question_card {}
.question_card__title {}
.question_card__content {}
.question_card__featured {}
.question_card__title__highlighted {}
```

***

## 四、编码规范

### 4.1 Vue组件规范

#### 4.1.1 组件结构

```vue
<template>
  <view class="component-name">
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'submit'): void
}>()

const localData = ref<string>('')

const computedValue = computed(() => {
  return props.count * 2
})

const handleClick = () => {
  emit('update', computedValue.value)
}

onMounted(() => {
})
</script>

<style scoped lang="scss">
.component-name {
}
</style>
```

#### 4.1.2 组件编写顺序

```vue
<script setup lang="ts">
// 1. 导入语句
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import type { UserInfo } from '@/types/user'

// 2. Props定义
interface Props {
  userId: string
}
const props = defineProps<Props>()

// 3. Emits定义
const emit = defineEmits<{
  (e: 'update', value: UserInfo): void
}>()

// 4. 响应式数据
const loading = ref(false)
const userInfo = ref<UserInfo | null>(null)

// 5. 计算属性
const displayName = computed(() => {
  return userInfo.value?.nickname || '未知用户'
})

// 6. 监听器
watch(() => props.userId, (newId) => {
  fetchUserInfo(newId)
})

// 7. 方法
const fetchUserInfo = async (id: string) => {
  loading.value = true
  try {
    // ...
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  emit('update', userInfo.value!)
}

// 8. 生命周期
onMounted(() => {
  fetchUserInfo(props.userId)
})
</script>
```

### 4.2 TypeScript规范

#### 4.2.1 类型定义

```typescript
interface UserInfo {
  id: string
  nickname: string
  avatar: string
  province: string
  totalStars: number
  levelCount: number
  createdAt: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface PageParams {
  page: number
  pageSize: number
}

interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
```

#### 4.2.2 枚举定义

```typescript
enum QuestionType {
  CITY_TO_PROVINCE = 1,
  CITY_TO_COUNTRY = 2,
  ANCIENT_TO_MODERN = 3,
  FLAG_TO_COUNTRY = 4
}

enum QuestionStatus {
  ENABLED = 1,
  DISABLED = 0,
  PENDING = 2
}
```

### 4.3 API请求规范

#### 4.3.1 请求封装

```typescript
// utils/request.ts
import type { RequestOptions } from '@dcloudio/uni-app'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.citytrace.com/api/v1'

interface RequestConfig extends RequestOptions {
  showLoading?: boolean
  showError?: boolean
}

class Request {
  private baseURL: string

  constructor() {
    this.baseURL = BASE_URL
  }

  private getHeader(): Record<string, string> {
    const token = uni.getStorageSync('token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Platform': 'miniprogram'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request<T>(options: RequestConfig): Promise<T> {
    const {
      url,
      method = 'GET',
      data,
      showLoading = true,
      showError = true
    } = options

    if (showLoading) {
      uni.showLoading({ title: '加载中', mask: true })
    }

    return new Promise((resolve, reject) => {
      uni.request({
        url: this.baseURL + url,
        method,
        data,
        header: this.getHeader(),
        success: (res: any) => {
          if (showLoading) {
            uni.hideLoading()
          }

          const { code, message, data: responseData } = res.data

          if (code === 0) {
            resolve(responseData)
          } else if (code === 1002) {
            uni.removeStorageSync('token')
            uni.reLaunch({ url: '/pages/auth/index' })
            reject(new Error(message))
          } else {
            if (showError) {
              uni.showToast({ title: message || '请求失败', icon: 'none' })
            }
            reject(new Error(message))
          }
        },
        fail: (error) => {
          if (showLoading) {
            uni.hideLoading()
          }
          if (showError) {
            uni.showToast({ title: '网络错误', icon: 'none' })
          }
          reject(error)
        }
      })
    })
  }

  get<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'GET', data })
  }

  post<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'POST', data })
  }

  put<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data })
  }

  delete<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', data })
  }
}

const request = new Request()

export default request
```

#### 4.3.2 API模块定义

```typescript
// api/user.ts
import request from '@/utils/request'
import type { UserInfo, PageParams, PageResult } from '@/types'

export const userApi = {
  login(code: string) {
    return request.post<{
      token: string
      user: UserInfo
    }>('/user/login', { code })
  },

  getUserInfo() {
    return request.get<UserInfo>('/user/info')
  },

  updateUserInfo(data: Partial<UserInfo>) {
    return request.put<UserInfo>('/user/info', data)
  },

  initProvince(province: string, method: string) {
    return request.post<{
      province: string
      unlockedLevel: string
    }>('/user/init-province', { province, method })
  },

  getTicketStatus() {
    return request.get<{
      adventureTickets: {
        current: number
        max: number
        nextRecoverIn: number
      }
      randomTickets: {
        current: number
        max: number
      }
    }>('/user/tickets')
  }
}
```

### 4.4 状态管理规范

#### 4.4.1 Store定义

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(uni.getStorageSync('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.nickname || '')

  const setToken = (newToken: string) => {
    token.value = newToken
    uni.setStorageSync('token', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const login = async (code: string) => {
    const result = await userApi.login(code)
    setToken(result.token)
    setUserInfo(result.user)
    return result
  }

  const getUserInfo = async () => {
    const info = await userApi.getUserInfo()
    setUserInfo(info)
    return info
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userName,
    setToken,
    setUserInfo,
    login,
    getUserInfo,
    logout
  }
})
```

### 4.5 样式规范

#### 4.5.1 样式变量

```scss
// styles/variables.scss
$primary-color: #2E7D32;
$primary-light: #4CAF50;
$accent-color: #FF9800;
$background-color: #F5F5F5;
$text-primary: #212121;
$text-secondary: #757575;
$success-color: #4CAF50;
$error-color: #F44336;
$star-color: #FFD700;

$spacing-xs: 8rpx;
$spacing-sm: 16rpx;
$spacing-md: 24rpx;
$spacing-lg: 32rpx;
$spacing-xl: 40rpx;

$radius-sm: 8rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;

$font-size-xs: 24rpx;
$font-size-sm: 28rpx;
$font-size-md: 32rpx;
$font-size-lg: 40rpx;
$font-size-xl: 48rpx;
```

#### 4.5.2 组件样式

```vue
<style scoped lang="scss">
@import '@/styles/variables.scss';

.question-card {
  padding: $spacing-lg;
  background: #fff;
  border-radius: $radius-lg;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $text-primary;
  }

  &__content {
    margin-bottom: $spacing-lg;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
```

***

## 五、页面开发规范

### 5.1 页面生命周期

```typescript
// pages/home/index.vue
<script setup lang="ts">
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { ref } from 'vue'

const loading = ref(false)
const dataList = ref([])

onLoad((options) => {
  console.log('页面加载', options)
  initData()
})

onShow(() => {
  console.log('页面显示')
  refreshData()
})

onPullDownRefresh(() => {
  refreshData().then(() => {
    uni.stopPullDownRefresh()
  })
})

onReachBottom(() => {
  console.log('触底加载')
  loadMore()
})

const initData = async () => {
  // 初始化逻辑
}

const refreshData = async () => {
  // 刷新逻辑
}

const loadMore = async () => {
  // 加载更多
}
</script>
```

### 5.2 页面配置

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/home/index",
      "style": {
        "navigationBarTitleText": "城迹",
        "navigationBarBackgroundColor": "#2E7D32",
        "navigationBarTextStyle": "white",
        "backgroundColor": "#F5F5F5",
        "enablePullDownRefresh": true,
        "onReachBottomDistance": 50
      }
    }
  ]
}
```

***

## 六、组件开发规范

### 6.1 组件Props定义

```typescript
// components/question-card/index.vue
<script setup lang="ts">
interface Props {
  question: Question
  showAnswer?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAnswer: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'select', option: string): void
}>()
</script>
```

### 6.2 组件事件

```vue
<template>
  <view class="question-card">
    <view
      class="option-item"
      v-for="option in question.options"
      :key="option.key"
      :class="{ selected: selectedOption === option.key }"
      @tap="handleOptionTap(option.key)"
    >
      <text class="option-key">{{ option.key }}</text>
      <text class="option-value">{{ option.value }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const selectedOption = ref<string>('')

const handleOptionTap = (key: string) => {
  if (props.disabled) return
  selectedOption.value = key
  emit('select', key)
}
</script>
```

***

## 七、工具函数规范

### 7.1 存储封装

```typescript
// utils/storage.ts
const PREFIX = 'city_trace_'

class Storage {
  private prefix: string

  constructor() {
    this.prefix = PREFIX
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T): void {
    uni.setStorageSync(this.getKey(key), value)
  }

  get<T>(key: string, defaultValue: T | null = null): T | null {
    const data = uni.getStorageSync(this.getKey(key))
    return data !== '' ? data : defaultValue
  }

  remove(key: string): void {
    uni.removeStorageSync(this.getKey(key))
  }

  clear(): void {
    const res = uni.getStorageInfoSync()
    res.keys.forEach((key: string) => {
      if (key.startsWith(this.prefix)) {
        uni.removeStorageSync(key)
      }
    })
  }
}

const storage = new Storage()

export default storage
```

### 7.2 题目生成器

```typescript
// utils/question-generator.ts
export class QuestionGenerator {
  private cityData: City[]
  private countryData: Country[]
  private ancientData: AncientData[]

  constructor(cityData: City[], countryData: Country[], ancientData: AncientData[]) {
    this.cityData = cityData
    this.countryData = countryData
    this.ancientData = ancientData
  }

  generate(config: QuestionConfig): Question[] {
    const { region, difficulty, questionTypes, count } = config
    const questions: Question[] = []
    const usedIds = new Set<string>()

    for (let i = 0; i < count; i++) {
      const type = this.getRandomType(questionTypes)
      let question: Question | null = null

      switch (type) {
        case QuestionType.CITY_TO_PROVINCE:
          question = this.generateCityToProvince(region, usedIds)
          break
        case QuestionType.CITY_TO_COUNTRY:
          question = this.generateCityToCountry(region, usedIds)
          break
        case QuestionType.ANCIENT_TO_MODERN:
          question = this.generateAncientToModern(region, usedIds)
          break
        case QuestionType.FLAG_TO_COUNTRY:
          question = this.generateFlagToCountry(region, usedIds)
          break
      }

      if (question) {
        questions.push(question)
      }
    }

    return questions
  }

  private getRandomType(types: number[]): number {
    return types[Math.floor(Math.random() * types.length)]
  }

  private generateCityToProvince(region: string, usedIds: Set<string>): Question | null {
    const cities = this.cityData.filter(c => c.province === region && !usedIds.has(c.city))
    if (cities.length === 0) return null

    const target = cities[Math.floor(Math.random() * cities.length)]
    usedIds.add(target.city)

    const wrongOptions = this.cityData
      .filter(c => c.province !== target.province)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options = [
      { key: 'A', value: target.province },
      ...wrongOptions.map((c, i) => ({ key: String.fromCharCode(66 + i), value: c.province }))
    ].sort(() => Math.random() - 0.5)

    return {
      id: `Q_${Date.now()}_${Math.random()}`,
      questionType: QuestionType.CITY_TO_PROVINCE,
      questionContent: `${target.city}属于哪个省份？`,
      options,
      correctAnswer: options.find(o => o.value === target.province)!.key,
      difficulty: 1,
      region
    }
  }

  private generateCityToCountry(region: string, usedIds: Set<string>): Question | null {
    const cities = this.cityData.filter(c => c.country === region && !usedIds.has(c.city))
    if (cities.length === 0) return null

    const target = cities[Math.floor(Math.random() * cities.length)]
    usedIds.add(target.city)

    const wrongOptions = this.cityData
      .filter(c => c.country !== target.country)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options = [
      { key: 'A', value: target.country },
      ...wrongOptions.map((c, i) => ({ key: String.fromCharCode(66 + i), value: c.country }))
    ].sort(() => Math.random() - 0.5)

    return {
      id: `Q_${Date.now()}_${Math.random()}`,
      questionType: QuestionType.CITY_TO_COUNTRY,
      questionContent: `${target.city}属于哪个国家？`,
      options,
      correctAnswer: options.find(o => o.value === target.country)!.key,
      difficulty: 2,
      region
    }
  }

  private generateAncientToModern(region: string, usedIds: Set<string>): Question | null {
    const ancientList = this.ancientData.filter(a => a.region === region && !usedIds.has(a.ancient))
    if (ancientList.length === 0) return null

    const target = ancientList[Math.floor(Math.random() * ancientList.length)]
    usedIds.add(target.ancient)

    const wrongOptions = this.ancientData
      .filter(a => a.region === region && a.modern !== target.modern)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options = [
      { key: 'A', value: target.modern },
      ...wrongOptions.map((a, i) => ({ key: String.fromCharCode(66 + i), value: a.modern }))
    ].sort(() => Math.random() - 0.5)

    return {
      id: `Q_${Date.now()}_${Math.random()}`,
      questionType: QuestionType.ANCIENT_TO_MODERN,
      questionContent: `${target.ancient}的今名是什么？`,
      options,
      correctAnswer: options.find(o => o.value === target.modern)!.key,
      difficulty: 2,
      region
    }
  }

  private generateFlagToCountry(region: string, usedIds: Set<string>): Question | null {
    const countries = this.countryData.filter(c => c.region === region && !usedIds.has(c.country))
    if (countries.length === 0) return null

    const target = countries[Math.floor(Math.random() * countries.length)]
    usedIds.add(target.country)

    const wrongOptions = this.countryData
      .filter(c => c.region === region && c.country !== target.country)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options = [
      { key: 'A', value: target.country },
      ...wrongOptions.map((c, i) => ({ key: String.fromCharCode(66 + i), value: c.country }))
    ].sort(() => Math.random() - 0.5)

    return {
      id: `Q_${Date.now()}_${Math.random()}`,
      questionType: QuestionType.FLAG_TO_COUNTRY,
      questionContent: '这是哪个国家的国旗？',
      questionImage: target.flag,
      options,
      correctAnswer: options.find(o => o.value === target.country)!.key,
      difficulty: 3,
      region
    }
  }
}

export default QuestionGenerator
```

***

## 八、代码注释规范

### 8.1 文件头注释

```typescript
/**
 * @file 用户状态管理
 * @description 管理用户登录状态、用户信息等
 * @author 开发者姓名
 * @date 2026-03-23
 */
```

### 8.2 函数注释

````typescript
/**
 * 获取用户列表数据
 * @param params 查询参数
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @param params.nickname 用户昵称（可选）
 * @returns 用户列表数据
 * @example
 * ```typescript
 * const result = await getUserList({ page: 1, pageSize: 20 })
 * ```
 */
async function getUserList(params: PageParams): Promise<PageResult<UserInfo>> {
  // ...
}
````

### 8.3 行内注释

```typescript
const value = calculate() // 计算结果

// TODO: 待优化逻辑
// FIXME: 修复此问题
// NOTE: 注意事项
// HACK: 临时解决方案
```

***

## 九、性能优化规范

### 9.1 列表优化

```vue
<template>
  <scroll-view scroll-y @scrolltolower="loadMore">
    <view
      class="list-item"
      v-for="item in visibleList"
      :key="item.id"
    >
      {{ item.name }}
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const allList = ref([])
const pageSize = 20
const currentPage = ref(1)

const visibleList = computed(() => {
  return allList.value.slice(0, currentPage.value * pageSize)
})

const loadMore = () => {
  currentPage.value++
}
</script>
```

### 9.2 图片优化

```vue
<template>
  <image
    :src="imageUrl"
    mode="aspectFill"
    lazy-load
    :webp="true"
  />
</template>
```

### 9.3 防抖节流

```typescript
// utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number | null = null

  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
```

***

## 十、错误处理规范

### 10.1 全局错误处理

```typescript
// main.ts
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)

  app.config.errorHandler = (err, instance, info) => {
    console.error('全局错误:', err, info)
    uni.showToast({
      title: '发生错误，请重试',
      icon: 'none'
    })
  }

  return {
    app
  }
}
```

### 10.2 接口错误处理

```typescript
// utils/request.ts
async request<T>(options: RequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      // ...
      fail: (error) => {
        console.error('请求失败:', error)
        reject(error)
      }
    })
  })
}
```

***

## 十一、测试规范

### 11.1 单元测试

```typescript
// tests/utils/question-generator.test.ts
import { describe, it, expect } from 'vitest'
import QuestionGenerator from '@/utils/question-generator'

describe('QuestionGenerator', () => {
  it('should generate correct number of questions', () => {
    const generator = new QuestionGenerator(cityData, countryData, ancientData)
    const questions = generator.generate({
      region: '江苏省',
      difficulty: 1,
      questionTypes: [1],
      count: 10
    })
    expect(questions.length).toBe(10)
  })

  it('should generate unique questions', () => {
    const generator = new QuestionGenerator(cityData, countryData, ancientData)
    const questions = generator.generate({
      region: '江苏省',
      difficulty: 1,
      questionTypes: [1],
      count: 10
    })
    const ids = questions.map(q => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})
```

***

## 十二、发布规范

### 12.1 版本管理

```json
// package.json
{
  "name": "citytrace-miniprogram",
  "version": "1.0.0",
  "description": "城迹微信小程序"
}
```

### 12.2 构建配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  build: {
    target: 'es6',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

***

## 十三、最佳实践

### 13.1 组件复用

```vue
<!-- 通用按钮组件 -->
<template>
  <button
    class="custom-button"
    :class="[`custom-button--${type}`, { 'custom-button--disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  if (props.disabled) return
  emit('click')
}
</script>
```

### 13.2 状态管理最佳实践

```typescript
// stores/game.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const currentLevel = ref<Level | null>(null)
  const currentQuestionIndex = ref(0)
  const answers = ref<Answer[]>([])
  const blood = ref(10)

  const isGameActive = computed(() => !!currentLevel.value)
  const currentQuestion = computed(() => {
    return currentLevel.value?.questions[currentQuestionIndex.value]
  })

  const startGame = (level: Level) => {
    currentLevel.value = level
    currentQuestionIndex.value = 0
    answers.value = []
    blood.value = 10
  }

  const submitAnswer = (answer: Answer) => {
    answers.value.push(answer)
    if (!answer.isCorrect) {
      blood.value--
    }
    currentQuestionIndex.value++
  }

  const endGame = () => {
    currentLevel.value = null
    currentQuestionIndex.value = 0
  }

  return {
    currentLevel,
    currentQuestionIndex,
    answers,
    blood,
    isGameActive,
    currentQuestion,
    startGame,
    submitAnswer,
    endGame
  }
})
```

***

## 十四、常见问题

### 14.1 跨平台兼容

```typescript
// 使用条件编译处理平台差异
// #ifdef MP-WEIXIN
wx.login({
  success: (res) => {
    console.log(res.code)
  }
})
// #endif

// #ifdef H5
console.log('H5平台')
// #endif
```

### 14.2 性能优化

```vue
<!-- 使用v-show代替v-if减少渲染 -->
<view v-show="isVisible">内容</view>

<!-- 使用key优化列表渲染 -->
<view
  v-for="item in list"
  :key="item.id"
>
  {{ item.name }}
</view>
```

***

## 十五、附录

### 15.1 相关文档

- [UniApp官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3官方文档](https://cn.vuejs.org/)
- [Pinia官方文档](https://pinia.vuejs.org/zh/)
- [TypeScript官方文档](https://www.typescriptlang.org/)

### 15.2 开发工具推荐

- HBuilderX：UniApp官方IDE
- VS Code：通用代码编辑器
- 微信开发者工具：微信小程序调试工具

### 15.3 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev:mp-weixin

# 构建生产版本
pnpm run build:mp-weixin

# 类型检查
pnpm run type-check

# 代码检查
pnpm run lint

# 代码格式化
pnpm run format
```

