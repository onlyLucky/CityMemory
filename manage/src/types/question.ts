export enum QuestionType {
  CITY_TO_PROVINCE = 1,
  CITY_TO_COUNTRY = 2,
  ANCIENT_TO_MODERN = 3,
  FLAG_TO_COUNTRY = 4
}

export enum QuestionStatus {
  DISABLED = 0,
  ENABLED = 1,
  PENDING = 2
}

export interface Question {
  id: string
  questionType: QuestionType
  questionContent: string
  questionImage?: string
  options: Option[]
  correctAnswer: string
  difficulty: number
  region: string
  status: QuestionStatus
  usedCount: number
  correctRate: number
  createdAt: string
  updatedAt: string
}

export interface Option {
  key: string
  value: string
}

export interface QuestionQuery {
  page: number
  pageSize: number
  questionType?: QuestionType
  region?: string
  status?: QuestionStatus
  difficulty?: number
  content?: string
}

export interface QuestionCreate {
  questionType: QuestionType
  questionContent: string
  questionImage?: string
  options: Option[]
  correctAnswer: string
  difficulty: number
  region: string
  status: QuestionStatus
}

export interface QuestionUpdate {
  id: string
  questionType?: QuestionType
  questionContent?: string
  questionImage?: string
  options?: Option[]
  correctAnswer?: string
  difficulty?: number
  region?: string
  status?: QuestionStatus
}
