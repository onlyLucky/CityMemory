// ==========================================
// 城迹小程序 - 类型定义
// ==========================================

// 导出 API 类型
export * from './api'

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 用户信息
export interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatar: string
  phone?: string
  province: string
  level: number
  exp: number
  stars: number
  tickets: number
  createdAt: string
  updatedAt: string
}

// 关卡信息
export interface LevelInfo {
  id: number
  name: string
  description: string
  provinceIds: number[]
  totalCities: number
  completedCities: number
  status: 'locked' | 'current' | 'completed'
  reward: {
    stars: number
    exp: number
  }
}

// 题目信息
export interface Question {
  id: number
  type: 'geography' | 'history' | 'culture' | 'food'
  cityId: number
  cityName: string
  provinceName: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

// 答题记录
export interface AnswerRecord {
  questionId: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  answeredAt: string
}

// 游戏进度
export interface GameProgress {
  currentLevel: number
  completedLevels: number[]
  totalQuestions: number
  correctQuestions: number
  maxStreak: number
}

// 排行榜用户
export interface RankUser {
  id: string
  nickname: string
  avatar: string
  score: number
  province?: string
  rank: number
}

// 商店商品
export interface ShopItem {
  id: number
  name: string
  description: string
  icon: string
  price: number
  category: 'ticket' | 'item' | 'skin'
  stock?: number
}

// 用户道具
export interface UserItem {
  id: number
  itemId: number
  name: string
  icon: string
  count: number
}

// 答题结果
export interface AnswerResult {
  isCorrect: boolean
  correctAnswer: string
  explanation?: string
  reward?: {
    exp: number
    stars?: number
  }
}

// 关卡结果
export interface LevelResult {
  levelId: number
  totalQuestions: number
  correctCount: number
  accuracy: number
  isPassed: boolean
  reward: {
    stars: number
    exp: number
  }
  details: AnswerRecord[]
}

// 随机挑战结果
export interface RandomResult {
  mode: 'quick' | 'endless' | 'topic'
  totalQuestions: number
  correctCount: number
  maxStreak: number
  accuracy: number
  reward: {
    stars: number
    exp: number
  }
  rank?: number
  beatPercent?: number
}

// 分页参数
export interface PaginationParams {
  page: number
  size: number
}

// 分页响应
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
  hasMore: boolean
}
