/**
 * 应用配置常量定义
 */

/** 门票配置 */
export const TICKET_CONFIG = {
  /** 冒险门票最大数量 */
  ADVENTURE_TICKET_MAX: 30,
  /** 冒险门票恢复时间（秒）- 10分钟 */
  ADVENTURE_RECOVER_TIME: 600,
  /** 随机门票最大数量 */
  RANDOM_TICKET_MAX: 3,
} as const

/** 星级配置 */
export const STAR_CONFIG = {
  /** 最大星数 */
  MAX_STARS: 6,
  /** 基础星数 */
  BASE_STARS: 5,
} as const

/** 血量配置 */
export const HEALTH_CONFIG = {
  /** 默认血量 */
  DEFAULT_HEALTH: 10,
  /** 血池加成 */
  BLOOD_POOL_BONUS: 3,
} as const

/** 题目配置 */
export const QUESTION_CONFIG = {
  /** 每关题目数量 */
  QUESTION_COUNT: 10,
} as const

/** 游戏配置 */
export const GAME_CONFIG = {
  /** 答题时间限制（秒） */
  ANSWER_TIME_LIMIT: 30,
  /** 每题基础分数 */
  BASE_SCORE_PER_QUESTION: 100,
  /** 连击加成倍率 */
  COMBO_MULTIPLIER: 0.1,
} as const

/** 积分配置 */
export const COIN_CONFIG = {
  /** 每日签到奖励 */
  DAILY_SIGN_REWARD: 10,
  /** 分享奖励 */
  SHARE_REWARD: 5,
  /** 完美通关奖励 */
  PERFECT_CLEAR_REWARD: 20,
} as const
