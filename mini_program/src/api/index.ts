import type { UserInfo, TicketStatus, Question, Level, AnswerResult, ShopItem, RankItem } from '@/types'
import request from '@/utils/request'
import questionGenerator from '@/utils/question-generator'

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
    return request.get<TicketStatus>('/user/tickets')
  }
}

export const levelApi = {
  getLevelList(province?: string) {
    return request.get<Level[]>('/level/list', { province })
  },

  getLevelDetail(id: string) {
    return request.get<Level>(`/level/${id}`)
  },

  startLevel(id: string) {
    return request.post<{
      levelId: string
      questions: Question[]
    }>(`/level/${id}/start`)
  },

  submitAnswer(levelId: string, questionId: string, answer: string) {
    return request.post<AnswerResult>(`/level/${levelId}/answer`, {
      questionId,
      answer
    })
  },

  completeLevel(id: string, data: any) {
    return request.post<{
      levelId: string
      stars: number
      totalStars: number
      unlockedLevel: string
    }>(`/level/${id}/complete`, data)
  }
}

export const questionApi = {
  getRandomQuestions(region: string, difficulty: number, count: number) {
    return request.get<Question[]>('/question/random', { region, difficulty, count })
  },

  submitRandomAnswer(questionId: string, answer: string) {
    return request.post<{
      isCorrect: boolean
      correctAnswer: string
      currentScore: number
      totalQuestions: number
      completedQuestions: number
    }>('/question/random/answer', { questionId, answer })
  }
}

export const shopApi = {
  getShopItems() {
    return request.get<ShopItem[]>('/shop/items')
  },

  buyItem(id: string) {
    return request.post<{
      itemId: string
      itemName: string
      quantity: number
      remainingStars: number
      tickets: {
        adventureTickets: number
        randomTickets: number
      }
    }>(`/shop/items/${id}/buy`)
  }
}

export const rankApi = {
  getRankList(type: string, province?: string, page: number = 1, pageSize: number = 20) {
    return request.get<{
      list: RankItem[]
      total: number
      page: number
      pageSize: number
      myRank: {
        rank: number
        value: number
      }
    }>('/rank/list', { type, province, page, pageSize })
  }
}
