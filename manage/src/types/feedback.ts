export interface Feedback {
  id: string
  userId: string
  nickname: string
  avatar: string
  feedbackType: 'suggestion' | 'bug' | 'complaint' | 'other'
  content: string
  images: string[]
  status: 'pending' | 'processed' | 'closed'
  reply?: string
  createdAt: string
  updatedAt: string
}

export interface FeedbackQuery {
  page: number
  pageSize: number
  feedbackType?: string
  status?: string
  nickname?: string
}

export interface FeedbackUpdate {
  id: string
  status?: string
  reply?: string
}
