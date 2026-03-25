import Koa from 'koa';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JwtPayload {
  userId: string;
  openid?: string;
  type: 'user' | 'admin';
  iat: number;
  exp: number;
}

export interface WechatSessionResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

export interface UserInfo {
  id: number;
  openid: string;
  nickname: string;
  avatar: string;
  gender: number;
  province: string;
  city: string;
  country: string;
  ticketCount: number;
  starCount: number;
  currentLevel: number;
  lastLoginTime: Date;
  createTime: Date;
  updateTime: Date;
}

export interface LevelInfo {
  id: number;
  levelNumber: number;
  regionId: number;
  regionType: number;
  regionName: string;
  difficulty: number;
  questionCount: number;
  starReward: number;
  unlockCondition: string;
  description: string;
  createTime: Date;
}

export interface QuestionInfo {
  id: number;
  levelId: number;
  questionType: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  imageUrl: string;
  audioUrl: string;
  difficulty: number;
  createTime: Date;
}

export interface ShopItemInfo {
  id: number;
  itemType: number;
  itemName: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  effect: string;
  stock: number;
  dailyLimit: number;
  status: number;
  sortOrder: number;
  createTime: Date;
}

export interface UserProgress {
  _id: string;
  userId: number;
  levelProgress: Map<string, LevelProgress>;
  totalStars: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  createTime: Date;
  updateTime: Date;
}

export interface LevelProgress {
  levelId: number;
  status: number;
  stars: number;
  bestTime: number;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  lastPlayTime: Date;
}

export interface GameRecord {
  _id: string;
  userId: number;
  levelId: number;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  stars: number;
  isCompleted: boolean;
  answers: AnswerRecord[];
  createTime: Date;
}

export interface AnswerRecord {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface AdminInfo {
  id: number;
  username: string;
  password: string;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  roleId: number;
  status: number;
  lastLoginTime: Date;
  lastLoginIp: string;
  createTime: Date;
  updateTime: Date;
}

export interface RoleInfo {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  permissions: string[];
  status: number;
  createTime: Date;
  updateTime: Date;
}

export interface AdminLog {
  id: number;
  adminId: number;
  adminName: string;
  action: string;
  module: string;
  target: string;
  detail: string;
  ip: string;
  userAgent: string;
  createTime: Date;
}

export interface DashboardStats {
  totalUsers: number;
  todayNewUsers: number;
  activeUsers: number;
  totalGames: number;
  todayGames: number;
  avgAccuracy: number;
  totalQuestions: number;
  totalLevels: number;
}

export interface UserState extends Koa.DefaultState {
  user?: JwtPayload;
  admin?: JwtPayload;
}

export type UserContext = Koa.Context<UserState>;
