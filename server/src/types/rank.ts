export interface RankingItem {
  rank: number;
  userId: number;
  nickname: string;
  avatar: string;
  score: number;
  stars: number;
}

export interface RankingList {
  list: RankingItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserRanking {
  globalRank: number;
  levelRank?: number;
  totalStars: number;
  accuracy: number;
}

export interface RankingQuery {
  type: 'global' | 'level';
  levelId?: number;
  page?: number;
  pageSize?: number;
}
