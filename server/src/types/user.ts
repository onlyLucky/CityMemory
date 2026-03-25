export interface User {
  id: number;
  openid: string;
  unionid?: string;
  nickname: string;
  avatar: string;
  gender: number;
  province: string;
  city: string;
  country: string;
  ticketCount: number;
  starCount: number;
  currentLevel: number;
  status: number;
  lastLoginTime: Date;
  lastLoginIp: string;
  createTime: Date;
  updateTime: Date;
}

export interface UserLoginInput {
  code: string;
  nickname?: string;
  avatar?: string;
  gender?: number;
  province?: string;
  city?: string;
  country?: string;
}

export interface UserUpdateInput {
  nickname?: string;
  avatar?: string;
  gender?: number;
  province?: string;
  city?: string;
  country?: string;
}

export interface UserTicketRecord {
  id: number;
  userId: number;
  changeAmount: number;
  balance: number;
  changeType: number;
  remark: string;
  createTime: Date;
}

export interface UserItemInfo {
  id: number;
  userId: number;
  itemId: number;
  itemName?: string;
  itemType?: number;
  quantity: number;
  createTime: Date;
}

export interface UserProgressInfo {
  levelProgress: Record<string, LevelProgressData>;
  totalStars: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

export interface LevelProgressData {
  levelId: number;
  status: number;
  stars: number;
  bestTime: number;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  lastPlayTime: Date;
}

export interface UserRankingInfo {
  rank: number;
  userId: number;
  nickname: string;
  avatar: string;
  score: number;
  stars: number;
}
