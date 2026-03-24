import type { Level, LevelCreate, LevelUpdate, PageResult } from '@/types/level'

const mockLevels: Level[] = Array.from({ length: 50 }, (_, i) => ({
  id: `L${String(i + 1).padStart(3, '0')}`,
  levelName: ['江苏省关卡', '北京市关卡', '上海市关卡', '广东省关卡', '浙江省关卡'][i % 5] + (Math.floor(i / 5) + 1),
  province: ['江苏省', '北京市', '上海市', '广东省', '浙江省'][i % 5],
  levelOrder: i + 1,
  questionCount: 10,
  difficulty: (i % 5) + 1,
  status: i % 10 === 0 ? 0 : 1,
  userCount: Math.floor(Math.random() * 1000) + 100,
  completedCount: Math.floor(Math.random() * 800) + 50,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

export const levelApi = {
  getList(params: { page: number; pageSize: number; province?: string; status?: number }) {
    return new Promise<PageResult<Level>>((resolve) => {
      setTimeout(() => {
        let filteredList = [...mockLevels]

        if (params.province) {
          filteredList = filteredList.filter(l => l.province === params.province)
        }
        if (params.status !== undefined) {
          filteredList = filteredList.filter(l => l.status === params.status)
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
    return new Promise<Level & { questions: any[] }>((resolve) => {
      setTimeout(() => {
        const level = mockLevels.find(l => l.id === id)
        if (level) {
          resolve({
            ...level,
            questions: Array.from({ length: 10 }, (_, i) => ({
              id: `Q${String(i + 1).padStart(3, '0')}`,
              questionType: 1,
              questionContent: `测试题目${i + 1}`,
              options: [
                { key: 'A', value: '选项A' },
                { key: 'B', value: '选项B' },
                { key: 'C', value: '选项C' },
                { key: 'D', value: '选项D' }
              ],
              correctAnswer: 'A',
              difficulty: 1,
              region: level.province
            }))
          })
        }
      }, 300)
    })
  },

  create(data: LevelCreate) {
    return new Promise<Level>((resolve) => {
      setTimeout(() => {
        const newLevel: Level = {
          id: `L${String(mockLevels.length + 1).padStart(3, '0')}`,
          levelName: data.levelName,
          province: data.province,
          levelOrder: mockLevels.length + 1,
          questionCount: data.questionCount,
          difficulty: data.difficulty,
          status: 1,
          userCount: 0,
          completedCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockLevels.push(newLevel)
        resolve(newLevel)
      }, 500)
    })
  },

  update(data: LevelUpdate) {
    return new Promise<Level>((resolve) => {
      setTimeout(() => {
        const index = mockLevels.findIndex(l => l.id === data.id)
        if (index !== -1) {
          mockLevels[index] = { ...mockLevels[index], ...data, updatedAt: new Date().toISOString() }
          resolve(mockLevels[index])
        }
      }, 500)
    })
  },

  delete(id: string) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = mockLevels.findIndex(l => l.id === id)
        if (index !== -1) {
          mockLevels.splice(index, 1)
        }
        resolve()
      }, 300)
    })
  },

  batchDelete(ids: string[]) {
    return new Promise<{ deletedCount: number }>((resolve) => {
      setTimeout(() => {
        let count = 0
        ids.forEach(id => {
          const index = mockLevels.findIndex(l => l.id === id)
          if (index !== -1) {
            mockLevels.splice(index, 1)
            count++
          }
        })
        resolve({ deletedCount: count })
      }, 500)
    })
  }
}
