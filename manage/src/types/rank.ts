export interface RankItem {
  rank: number
  userId: string
  nickname: string
  avatar: string
  province: string
  value: number
  levelCount: number
  createdAt: string
}

export interface RankQuery {
  page: number
  pageSize: number
  type: 'star' | 'level'
  province?: string
}

export interface RankResult {
  list: RankItem[]
  total: number
  page: number
  pageSize: number
  myRank?: {
    rank: number
    value: number
  }
}
