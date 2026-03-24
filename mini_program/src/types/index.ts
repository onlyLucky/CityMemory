export interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatar: string
  province: string
  totalStars: number
  levelCount: number
  coins: number
  createdAt: string
  updatedAt: string
}

export interface TicketStatus {
  adventureTickets: {
    current: number
    max: number
    nextRecoverIn: number
  }
  randomTickets: {
    current: number
    max: number
  }
}

export interface Question {
  id: string
  questionType: number
  questionContent: string
  questionImage?: string
  options: Array<{
    key: string
    value: string
  }>
  correctAnswer: string
  difficulty: number
  region: string
}

export interface Level {
  id: string
  levelName: string
  province: string
  levelOrder: number
  questionCount: number
  difficulty: number
  status: number
  userStars: number
  isUnlocked: boolean
  isCompleted: boolean
}

export interface AnswerResult {
  isCorrect: boolean
  correctAnswer: string
  blood: number
  stars: number
  isLevelCompleted: boolean
  nextQuestion?: Question
}

export interface ShopItem {
  id: string
  itemName: string
  itemType: string
  price: number
  quantity: number
  icon: string
  description: string
}

export interface RankItem {
  rank: number
  userId: string
  nickname: string
  avatar: string
  province: string
  value: number
  levelCount: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
