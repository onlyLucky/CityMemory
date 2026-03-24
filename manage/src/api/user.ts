import type { UserInfo, UserDetail, UserQuery, PageResult } from '@/types/user'

const mockUsers: UserInfo[] = Array.from({ length: 100 }, (_, i) => ({
  id: `U${String(i + 1).padStart(3, '0')}`,
  openid: `openid_${i}`,
  nickname: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'][i % 8] + (i > 7 ? i : ''),
  avatar: `https://cube.elemecdn.com/${i % 10}/${i % 10}/${i % 10}03b0d39583f48206768a7534e55bcpng`,
  province: ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南'][i % 8],
  totalStars: Math.floor(Math.random() * 200) + 50,
  levelCount: Math.floor(Math.random() * 50) + 10,
  coins: Math.floor(Math.random() * 5000) + 1000,
  adventureTickets: Math.floor(Math.random() * 10) + 5,
  randomTickets: Math.floor(Math.random() * 5) + 1,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
}))

export const userApi = {
  getList(params: UserQuery) {
    return new Promise<PageResult<UserInfo>>((resolve) => {
      setTimeout(() => {
        let filteredList = [...mockUsers]

        if (params.nickname) {
          filteredList = filteredList.filter(u => u.nickname.includes(params.nickname!))
        }
        if (params.province) {
          filteredList = filteredList.filter(u => u.province === params.province)
        }
        if (params.minStars !== undefined) {
          filteredList = filteredList.filter(u => u.totalStars >= params.minStars!)
        }
        if (params.maxStars !== undefined) {
          filteredList = filteredList.filter(u => u.totalStars <= params.maxStars!)
        }
        if (params.minLevels !== undefined) {
          filteredList = filteredList.filter(u => u.levelCount >= params.minLevels!)
        }
        if (params.maxLevels !== undefined) {
          filteredList = filteredList.filter(u => u.levelCount <= params.maxLevels!)
        }

        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const list = filteredList.slice(start, end)

        resolve({
          list,
          total: filteredList.length,
          page: params.page,
          pageSize: params.pageSize
        })
      }, 500)
    })
  },

  getDetail(id: string) {
    return new Promise<UserDetail>((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id)
        if (user) {
          resolve({
            ...user,
            progress: {
              unlockedLevels: ['江苏省-1', '江苏省-2', '北京市-1'],
              currentLevel: '江苏省-2',
              levelStars: {
                '江苏省-1': 5,
                '江苏省-2': 4,
                '北京市-1': 3
              },
              completedLevels: ['江苏省-1', '北京市-1']
            },
            statistics: {
              totalQuestions: Math.floor(Math.random() * 500) + 100,
              correctRate: Math.random() * 0.3 + 0.7,
              avgTime: Math.random() * 5 + 3,
              maxStars: 6
            },
            loginLogs: [
              {
                loginTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                device: 'iOS',
                ipAddress: '192.168.1.1'
              },
              {
                loginTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                device: 'Android',
                ipAddress: '192.168.1.2'
              }
            ]
          })
        }
      }, 300)
    })
  },

  exportData(params: UserQuery) {
    return new Promise<Blob>((resolve) => {
      setTimeout(() => {
        const csv = 'ID,昵称,省份,星星数,关卡数,注册时间\n' +
          mockUsers.map(u => `${u.id},${u.nickname},${u.province},${u.totalStars},${u.levelCount},${u.createdAt}`).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        resolve(blob)
      }, 1000)
    })
  }
}
