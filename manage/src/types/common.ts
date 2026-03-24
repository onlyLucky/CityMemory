export interface Admin {
  id: string
  username: string
  nickname: string
  role: string
  avatar: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  roleName: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface AdminLog {
  id: string
  adminId: string
  adminName: string
  actionType: string
  module: string
  content: string
  ipAddress: string
  createdAt: string
}

export interface DashboardOverview {
  todayNewUsers: number
  totalUsers: number
  todayActiveUsers: number
  todayQuestions: number
  retentionRate1Day: number
  retentionRate7Day: number
}

export interface DashboardTrend {
  date: string
  newUsers: number
  activeUsers: number
  questions: number
}

export interface DashboardDistribution {
  region: string
  count: number
  percentage: number
}
