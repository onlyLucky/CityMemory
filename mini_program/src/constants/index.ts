// ==========================================
// 城迹小程序 - 常量定义
// ==========================================

// 应用信息
export const APP_INFO = {
  name: '城迹',
  version: '1.0.0',
  description: '探索中国城市记忆'
}

// 存储键名
export const STORAGE_KEYS = {
  USER_INFO: 'city_memory_user_info',
  USER_TOKEN: 'city_memory_user_token',
  GAME_PROGRESS: 'city_memory_game_progress',
  SETTINGS: 'city_memory_settings'
}

// 题目类型
export const QUESTION_TYPES = {
  GEOGRAPHY: 'geography',
  HISTORY: 'history',
  CULTURE: 'culture',
  FOOD: 'food'
} as const

export const QUESTION_TYPE_NAMES: Record<string, string> = {
  [QUESTION_TYPES.GEOGRAPHY]: '地理知识',
  [QUESTION_TYPES.HISTORY]: '历史人文',
  [QUESTION_TYPES.CULTURE]: '文化风俗',
  [QUESTION_TYPES.FOOD]: '美食特产'
}

// 游戏模式
export const GAME_MODES = {
  LEVEL: 'level',      // 关卡模式
  QUICK: 'quick',      // 快速挑战
  ENDLESS: 'endless',  // 无尽模式
  TOPIC: 'topic'       // 专题挑战
} as const

// 排行榜类型
export const RANK_TYPES = {
  TOTAL: 'total',      // 总榜
  WEEKLY: 'weekly',    // 周榜
  PROVINCE: 'province' // 省榜
} as const

// 奖励配置
export const REWARDS = {
  LEVEL_COMPLETE: {
    stars: 50,
    exp: 100
  },
  QUESTION_CORRECT: {
    exp: 10
  },
  DAILY_LOGIN: {
    stars: 20,
    tickets: 1
  }
}

// 关卡配置
export const LEVEL_CONFIG = {
  PASS_SCORE: 60,        // 及格分数
  QUESTION_COUNT: 10,    // 每关题目数
  TIME_PER_QUESTION: 30  // 每题时间（秒）
}

// 随机模式配置
export const RANDOM_CONFIG = {
  QUICK_COUNT: 10,       // 快速模式题目数
  TIME_PER_QUESTION: 30  // 每题时间（秒）
}

// 等级配置
export const LEVEL_EXP = [
  0,      // Lv.1
  100,    // Lv.2
  300,    // Lv.3
  600,    // Lv.4
  1000,   // Lv.5
  1500,   // Lv.6
  2100,   // Lv.7
  2800,   // Lv.8
  3600,   // Lv.9
  4500    // Lv.10
]

// 省份列表
export const PROVINCES = [
  { id: 1, name: '北京市' },
  { id: 2, name: '天津市' },
  { id: 3, name: '河北省' },
  { id: 4, name: '山西省' },
  { id: 5, name: '内蒙古自治区' },
  { id: 6, name: '辽宁省' },
  { id: 7, name: '吉林省' },
  { id: 8, name: '黑龙江省' },
  { id: 9, name: '上海市' },
  { id: 10, name: '江苏省' },
  { id: 11, name: '浙江省' },
  { id: 12, name: '安徽省' },
  { id: 13, name: '福建省' },
  { id: 14, name: '江西省' },
  { id: 15, name: '山东省' },
  { id: 16, name: '河南省' },
  { id: 17, name: '湖北省' },
  { id: 18, name: '湖南省' },
  { id: 19, name: '广东省' },
  { id: 20, name: '广西壮族自治区' },
  { id: 21, name: '海南省' },
  { id: 22, name: '重庆市' },
  { id: 23, name: '四川省' },
  { id: 24, name: '贵州省' },
  { id: 25, name: '云南省' },
  { id: 26, name: '西藏自治区' },
  { id: 27, name: '陕西省' },
  { id: 28, name: '甘肃省' },
  { id: 29, name: '青海省' },
  { id: 30, name: '宁夏回族自治区' },
  { id: 31, name: '新疆维吾尔自治区' },
  { id: 32, name: '台湾省' },
  { id: 33, name: '香港特别行政区' },
  { id: 34, name: '澳门特别行政区' }
]
