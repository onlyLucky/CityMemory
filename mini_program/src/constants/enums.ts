/**
 * 枚举定义
 */

/** 题目类型枚举 */
export enum QuestionType {
  /** 城市对应省份 */
  CITY_TO_PROVINCE = 1,
  /** 城市对应国家 */
  CITY_TO_COUNTRY = 2,
  /** 古称对应今称 */
  ANCIENT_TO_MODERN = 3,
  /** 国旗对应国家 */
  FLAG_TO_COUNTRY = 4,
}

/** 关卡状态枚举 */
export enum LevelStatus {
  /** 锁定 */
  LOCKED = 0,
  /** 已解锁 */
  UNLOCKED = 1,
  /** 已完成 */
  COMPLETED = 2,
}

/** 区域主题枚举 */
export enum RegionTheme {
  /** 亚洲 */
  ASIA = '亚洲',
  /** 中东 */
  MIDDLE_EAST = '中东',
  /** 欧洲 */
  EUROPE = '欧洲',
  /** 非洲 */
  AFRICA = '非洲',
  /** 美洲 */
  AMERICAS = '美洲',
}

/** 道具类型枚举 */
export enum ItemType {
  /** 选项排除 */
  EXCLUDE_OPTION = '选项排除',
  /** 题目跳过 */
  SKIP_QUESTION = '题目跳过',
  /** 血瓶 */
  BLOOD_BOTTLE = '血瓶',
  /** 护盾 */
  SHIELD = '护盾',
}

/** 货币类型枚举 */
export enum CurrencyType {
  /** 金币 */
  COINS = 'coins',
  /** 钻石 */
  DIAMONDS = 'diamonds',
}

/** 难度等级枚举 */
export enum Difficulty {
  /** 简单 */
  EASY = 1,
  /** 普通 */
  NORMAL = 2,
  /** 困难 */
  HARD = 3,
}

/** 排行榜类型枚举 */
export enum RankType {
  /** 总排行 */
  TOTAL = 'total',
  /** 周排行 */
  WEEKLY = 'weekly',
  /** 好友排行 */
  FRIENDS = 'friends',
}

/** 反馈状态枚举 */
export enum FeedbackStatus {
  /** 待处理 */
  PENDING = 0,
  /** 已处理 */
  PROCESSED = 1,
  /** 已关闭 */
  CLOSED = 2,
}

/** 反馈类型枚举 */
export enum FeedbackType {
  /** Bug反馈 */
  BUG = 'bug',
  /** 功能建议 */
  FEATURE = 'feature',
  /** 内容纠错 */
  CORRECTION = 'correction',
  /** 其他 */
  OTHER = 'other',
}
