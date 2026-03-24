export interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatar: string
  province: string
  totalStars: number
  levelCount: number
  coins: number
  adventureTickets: number
  randomTickets: number
  createdAt: string
  updatedAt: string
}

export interface UserQuery {
  page: number
  pageSize: number
  nickname?: string
  province?: string
  minStars?: number
  maxStars?: number
  minLevel?: number
  maxLevel?: number
  registerStartTime?: string
  registerEndTime?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface UserDetail {
  userInfo: UserInfo
  progress: {
    unlockedLevels: string[]
    currentLevel: string
    levelStars: Record<string, number>
    completedLevels: string[]
  }
  statistics: {
    totalQuestions: number
    correctRate: number
    avgTime: number
    maxStars: number
  }
  loginLogs: LoginLog[]
}

export interface LoginLog {
  loginTime: string
  device: string
  ipAddress: string
}
