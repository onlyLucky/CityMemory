import type { Question, QuestionCreate, QuestionUpdate, PageResult, QuestionType, QuestionStatus } from '@/types/question'

const mockQuestions: Question[] = Array.from({ length: 200 }, (_, i) => ({
  id: `Q${String(i + 1).padStart(3, '0')}`,
  questionType: ((i % 4) + 1) as QuestionType,
  questionContent: `测试题目${i + 1}：${['南京市', '北京市', '上海市', '广州市'][i % 4]}属于哪个${['省份', '国家'][i % 2]}？`,
  questionImage: i % 4 === 3 ? 'https://example.com/flag.jpg' : '',
  options: [
    { key: 'A', value: '选项A' },
    { key: 'B', value: '选项B' },
    { key: 'C', value: '选项C' },
    { key: 'D', value: '选项D' }
  ],
  correctAnswer: ['A', 'B', 'C', 'D'][i % 4],
  difficulty: (i % 5) + 1,
  region: ['江苏省', '北京市', '上海市', '广东省'][i % 4],
  status: (i % 10 === 0 ? 0 : (i % 10 === 1 ? 2 : 1)) as QuestionStatus,
  usedCount: Math.floor(Math.random() * 1000) + 100,
  correctRate: Math.random() * 0.3 + 0.7,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

export const questionApi = {
  getList(params: { page: number; pageSize: number; questionType?: QuestionType; difficulty?: number; region?: string; status?: QuestionStatus }) {
    return new Promise<PageResult<Question>>((resolve) => {
      setTimeout(() => {
        let filteredList = [...mockQuestions]

        if (params.questionType) {
          filteredList = filteredList.filter(q => q.questionType === params.questionType)
        }
        if (params.difficulty) {
          filteredList = filteredList.filter(q => q.difficulty === params.difficulty)
        }
        if (params.region) {
          filteredList = filteredList.filter(q => q.region === params.region)
        }
        if (params.status !== undefined) {
          filteredList = filteredList.filter(q => q.status === params.status)
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
    return new Promise<Question>((resolve) => {
      setTimeout(() => {
        const question = mockQuestions.find(q => q.id === id)
        if (question) {
          resolve(question)
        }
      }, 300)
    })
  },

  create(data: QuestionCreate) {
    return new Promise<Question>((resolve) => {
      setTimeout(() => {
        const newQuestion: Question = {
          id: `Q${String(mockQuestions.length + 1).padStart(3, '0')}`,
          questionType: data.questionType,
          questionContent: data.questionContent,
          questionImage: data.questionImage || '',
          options: data.options!,
          correctAnswer: data.correctAnswer!,
          difficulty: data.difficulty,
          region: data.region,
          status: 2,
          usedCount: 0,
          correctRate: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockQuestions.push(newQuestion)
        resolve(newQuestion)
      }, 500)
    })
  },

  update(data: QuestionUpdate) {
    return new Promise<Question>((resolve) => {
      setTimeout(() => {
        const index = mockQuestions.findIndex(q => q.id === data.id)
        if (index !== -1) {
          mockQuestions[index] = { ...mockQuestions[index], ...data, updatedAt: new Date().toISOString() }
          resolve(mockQuestions[index])
        }
      }, 500)
    })
  },

  delete(id: string) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = mockQuestions.findIndex(q => q.id === id)
        if (index !== -1) {
          mockQuestions.splice(index, 1)
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
          const index = mockQuestions.findIndex(q => q.id === id)
          if (index !== -1) {
            mockQuestions.splice(index, 1)
            count++
          }
        })
        resolve({ deletedCount: count })
      }, 500)
    })
  },

  updateStatus(id: string, status: QuestionStatus) {
    return new Promise<Question>((resolve) => {
      setTimeout(() => {
        const index = mockQuestions.findIndex(q => q.id === id)
        if (index !== -1) {
          mockQuestions[index] = { ...mockQuestions[index], status, updatedAt: new Date().toISOString() }
          resolve(mockQuestions[index])
        }
      }, 300)
    })
  },

  importQuestions(file: File) {
    return new Promise<{ successCount: number; failedCount: number; failedItems: any[] }>((resolve) => {
      setTimeout(() => {
        resolve({
          successCount: Math.floor(Math.random() * 50) + 10,
          failedCount: Math.floor(Math.random() * 5),
          failedItems: []
        })
      }, 1500)
    })
  },

  exportQuestions(params: any) {
    return new Promise<Blob>((resolve) => {
      setTimeout(() => {
        const csv = 'ID,题型,题目内容,正确答案,难度,区域,状态\n' +
          mockQuestions.map(q => `${q.id},${q.questionType},${q.questionContent},${q.correctAnswer},${q.difficulty},${q.region},${q.status}`).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        resolve(blob)
      }, 1000)
    })
  }
}
