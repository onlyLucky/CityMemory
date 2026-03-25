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

export interface AdminInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roleId: number;
  status: number;
  lastLoginTime?: Date;
  lastLoginIp?: string;
  createTime: Date;
  updateTime: Date;
}

export interface RoleInfo {
  id: number;
  roleName: string;
  roleCode: string;
  description?: string;
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
  target?: string;
  detail?: string;
  ip?: string;
  userAgent?: string;
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

export interface DailyTrend {
  date: string;
  newUsers: number;
  games: number;
}
