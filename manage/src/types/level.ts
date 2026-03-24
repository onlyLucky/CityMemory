export interface Level {
  id: string
  levelName: string
  province: string
  levelOrder: number
  questionCount: number
  difficulty: number
  status: number
  userStars?: number
  isUnlocked?: boolean
  isCompleted?: boolean
  userCount?: number
  completedCount?: number
  createdAt: string
  updatedAt: string
}

export interface LevelQuery {
  page: number
  pageSize: number
  province?: string
  status?: number
  difficulty?: number
}

export interface LevelCreate {
  levelName: string
  province: string
  levelOrder: number
  questionCount: number
  difficulty: number
  status: number
  questionIds: string[]
}

export interface LevelUpdate {
  id: string
  levelName?: string
  province?: string
  levelOrder?: number
  questionCount?: number
  difficulty?: number
  status?: number
  questionIds?: string[]
}
