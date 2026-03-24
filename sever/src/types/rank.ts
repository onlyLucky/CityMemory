export interface IRankItem {
  rank: number;
  userId: string;
  nickname: string;
  avatar: string;
  province: string;
  value: number;
  levelCount: number;
}

export interface IRankResult {
  list: IRankItem[];
  total: number;
  page: number;
  pageSize: number;
  myRank?: {
    rank: number;
    value: number;
  };
}
