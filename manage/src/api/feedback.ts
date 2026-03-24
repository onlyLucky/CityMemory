import type { Feedback, FeedbackQuery, FeedbackUpdate, PageResult } from '@/types/feedback'

const mockFeedbacks: Feedback[] = Array.from({ length: 50 }, (_, i) => ({
  id: `F${String(i + 1).padStart(3, '0')}`,
  userId: `U${String(i + 1).padStart(3, '0')}`,
  nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
  avatar: `https://cube.elemecdn.com/${i % 10}/${i % 10}/${i % 10}03b0d39583f48206768a7534e55bcpng`,
  feedbackType: ['suggestion', 'bug', 'complaint', 'other'][i % 4] as any,
  content: `这是第${i + 1}条反馈内容，描述了一个${['建议', 'bug', '投诉', '其他'][i % 4]}问题`,
  images: i % 3 === 0 ? ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'] : [],
  status: ['pending', 'processed', 'closed'][i % 3] as any,
  reply: i % 3 === 1 ? '感谢您的反馈，我们会尽快处理' : '',
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
}))

export const feedbackApi = {
  getList(params: FeedbackQuery) {
    return new Promise<PageResult<Feedback>>((resolve) => {
      setTimeout(() => {
        let filteredList = [...mockFeedbacks]

        if (params.feedbackType) {
          filteredList = filteredList.filter(f => f.feedbackType === params.feedbackType)
        }
        if (params.status) {
          filteredList = filteredList.filter(f => f.status === params.status)
        }
        if (params.nickname) {
          filteredList = filteredList.filter(f => f.nickname.includes(params.nickname!))
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

  update(data: FeedbackUpdate) {
    return new Promise<Feedback>((resolve) => {
      setTimeout(() => {
        const index = mockFeedbacks.findIndex(f => f.id === data.id)
        if (index !== -1) {
          mockFeedbacks[index] = { ...mockFeedbacks[index], ...data, updatedAt: new Date().toISOString() }
          resolve(mockFeedbacks[index])
        }
      }, 500)
    })
  }
}
