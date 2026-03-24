import type { DashboardOverview, DashboardTrend, DashboardDistribution } from '@/types/common'

export const dashboardApi = {
  getOverview() {
    return new Promise<DashboardOverview>((resolve) => {
      setTimeout(() => {
        resolve({
          todayNewUsers: Math.floor(Math.random() * 100) + 50,
          totalUsers: Math.floor(Math.random() * 10000) + 10000,
          todayActiveUsers: Math.floor(Math.random() * 500) + 500,
          todayQuestions: Math.floor(Math.random() * 2000) + 2000,
          yesterdayRetentionRate: Math.random() * 0.1 + 0.3,
          weekRetentionRate: Math.random() * 0.1 + 0.2
        })
      }, 300)
    })
  },

  getTrend(days: number = 7) {
    return new Promise<DashboardTrend[]>((resolve) => {
      setTimeout(() => {
        const trends: DashboardTrend[] = []
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          trends.push({
            date: date.toISOString().split('T')[0],
            newUsers: Math.floor(Math.random() * 100) + 50,
            activeUsers: Math.floor(Math.random() * 500) + 500,
            questions: Math.floor(Math.random() * 2000) + 2000
          })
        }
        resolve(trends)
      }, 500)
    })
  },

  getDistribution() {
    return new Promise<DashboardDistribution[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { region: '江苏省', count: 2500, percentage: 0.2 },
          { region: '北京市', count: 2000, percentage: 0.16 },
          { region: '上海市', count: 1800, percentage: 0.144 },
          { region: '广东省', count: 1500, percentage: 0.12 },
          { region: '浙江省', count: 1200, percentage: 0.096 },
          { region: '四川省', count: 1000, percentage: 0.08 },
          { region: '其他', count: 2500, percentage: 0.2 }
        ])
      }, 300)
    })
  }
}
