export enum UserStatus {
  NORMAL = 0,
  BANNED = 1,
  DELETED = 2,
}

export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export enum RegionType {
  COUNTRY = 1,
  PROVINCE = 2,
  CITY = 3,
}

export enum LevelStatus {
  LOCKED = 0,
  UNLOCKED = 1,
  COMPLETED = 2,
}

export enum QuestionType {
  SINGLE_CHOICE = 1,
  MULTI_CHOICE = 2,
  TRUE_FALSE = 3,
  FILL_BLANK = 4,
  IMAGE_CHOICE = 5,
  AUDIO_CHOICE = 6,
}

export enum Difficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  EXPERT = 4,
}

export enum ItemType {
  TICKET = 1,
  HINT = 2,
  SKIP = 3,
  TIME_EXTEND = 4,
  SHIELD = 5,
}

export enum ItemStatus {
  OFF_SHELF = 0,
  ON_SHELF = 1,
  SOLD_OUT = 2,
}

export enum AdminStatus {
  NORMAL = 0,
  DISABLED = 1,
  DELETED = 2,
}

export enum RoleStatus {
  DISABLED = 0,
  ENABLED = 1,
}

export enum FeedbackStatus {
  PENDING = 0,
  PROCESSING = 1,
  RESOLVED = 2,
  CLOSED = 3,
}

export enum FeedbackType {
  BUG = 1,
  SUGGESTION = 2,
  COMPLAINT = 3,
  OTHER = 4,
}

export enum RecommendStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  EXPIRED = 2,
}

export enum ErrorCode {
  SUCCESS = 0,
  UNKNOWN_ERROR = 1000,
  PARAM_ERROR = 1001,
  UNAUTHORIZED = 1002,
  FORBIDDEN = 1003,
  NOT_FOUND = 1004,
  METHOD_NOT_ALLOWED = 1005,
  INTERNAL_ERROR = 1006,
  SERVICE_UNAVAILABLE = 1007,
  
  USER_NOT_FOUND = 2001,
  USER_BANNED = 2002,
  USER_EXISTS = 2003,
  LOGIN_FAILED = 2004,
  WECHAT_AUTH_FAILED = 2005,
  
  LEVEL_LOCKED = 3001,
  LEVEL_NOT_FOUND = 3002,
  LEVEL_COMPLETED = 3003,
  NO_TICKET = 3004,
  GAME_NOT_STARTED = 3005,
  GAME_ALREADY_ENDED = 3006,
  
  QUESTION_NOT_FOUND = 4001,
  ANSWER_ERROR = 4002,
  
  ITEM_NOT_FOUND = 5001,
  ITEM_SOLD_OUT = 5002,
  INSUFFICIENT_STARS = 5003,
  DAILY_LIMIT_EXCEEDED = 5004,
  
  ADMIN_NOT_FOUND = 6001,
  ADMIN_DISABLED = 6002,
  ADMIN_EXISTS = 6003,
  PASSWORD_ERROR = 6004,
  INVALID_CAPTCHA = 6005,
  
  DATABASE_ERROR = 7001,
  REDIS_ERROR = 7002,
  MONGODB_ERROR = 7003,
}

export const ErrorMessage: Record<number, string> = {
  [ErrorCode.SUCCESS]: '操作成功',
  [ErrorCode.UNKNOWN_ERROR]: '未知错误',
  [ErrorCode.PARAM_ERROR]: '参数错误',
  [ErrorCode.UNAUTHORIZED]: '未授权',
  [ErrorCode.FORBIDDEN]: '禁止访问',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.METHOD_NOT_ALLOWED]: '方法不允许',
  [ErrorCode.INTERNAL_ERROR]: '服务器内部错误',
  [ErrorCode.SERVICE_UNAVAILABLE]: '服务不可用',
  
  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.USER_BANNED]: '用户已被封禁',
  [ErrorCode.USER_EXISTS]: '用户已存在',
  [ErrorCode.LOGIN_FAILED]: '登录失败',
  [ErrorCode.WECHAT_AUTH_FAILED]: '微信授权失败',
  
  [ErrorCode.LEVEL_LOCKED]: '关卡未解锁',
  [ErrorCode.LEVEL_NOT_FOUND]: '关卡不存在',
  [ErrorCode.LEVEL_COMPLETED]: '关卡已完成',
  [ErrorCode.NO_TICKET]: '门票不足',
  [ErrorCode.GAME_NOT_STARTED]: '游戏未开始',
  [ErrorCode.GAME_ALREADY_ENDED]: '游戏已结束',
  
  [ErrorCode.QUESTION_NOT_FOUND]: '题目不存在',
  [ErrorCode.ANSWER_ERROR]: '答案错误',
  
  [ErrorCode.ITEM_NOT_FOUND]: '商品不存在',
  [ErrorCode.ITEM_SOLD_OUT]: '商品已售罄',
  [ErrorCode.INSUFFICIENT_STARS]: '星星不足',
  [ErrorCode.DAILY_LIMIT_EXCEEDED]: '超过每日购买限制',
  
  [ErrorCode.ADMIN_NOT_FOUND]: '管理员不存在',
  [ErrorCode.ADMIN_DISABLED]: '管理员已禁用',
  [ErrorCode.ADMIN_EXISTS]: '管理员已存在',
  [ErrorCode.PASSWORD_ERROR]: '密码错误',
  [ErrorCode.INVALID_CAPTCHA]: '验证码错误',
  
  [ErrorCode.DATABASE_ERROR]: '数据库错误',
  [ErrorCode.REDIS_ERROR]: 'Redis错误',
  [ErrorCode.MONGODB_ERROR]: 'MongoDB错误',
};
