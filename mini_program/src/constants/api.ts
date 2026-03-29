/**
 * API 地址常量定义
 */

/** API 基础地址 */
export const BASE_URL = 'https://api.citytrace.com/api/v1'

/** 用户模块 API 路径 */
export const USER_API = {
  /** 用户登录 */
  LOGIN: '/user/login',
  /** 获取用户信息 */
  GET_INFO: '/user/info',
  /** 更新用户信息 */
  UPDATE_INFO: '/user/update',
  /** 获取用户门票信息 */
  GET_TICKETS: '/user/tickets',
  /** 获取用户道具 */
  GET_ITEMS: '/user/items',
  /** 使用道具 */
  USE_ITEM: '/user/item/use',
} as const

/** 关卡模块 API 路径 */
export const LEVEL_API = {
  /** 获取关卡列表 */
  GET_LIST: '/level/list',
  /** 获取关卡详情 */
  GET_DETAIL: '/level/detail',
  /** 开始关卡 */
  START: '/level/start',
  /** 提交关卡答案 */
  SUBMIT: '/level/submit',
  /** 获取关卡进度 */
  GET_PROGRESS: '/level/progress',
} as const

/** 题目模块 API 路径 */
export const QUESTION_API = {
  /** 获取随机题目 */
  GET_RANDOM: '/question/random',
  /** 获取每日推荐 */
  GET_DAILY: '/question/daily',
  /** 提交答案 */
  SUBMIT: '/question/submit',
} as const

/** 商店模块 API 路径 */
export const SHOP_API = {
  /** 获取商品列表 */
  GET_LIST: '/shop/list',
  /** 购买商品 */
  BUY: '/shop/buy',
} as const

/** 排行榜模块 API 路径 */
export const RANK_API = {
  /** 获取总排行榜 */
  GET_TOTAL: '/rank/total',
  /** 获取周排行榜 */
  GET_WEEKLY: '/rank/weekly',
  /** 获取好友排行榜 */
  GET_FRIENDS: '/rank/friends',
} as const

/** 反馈模块 API 路径 */
export const FEEDBACK_API = {
  /** 提交反馈 */
  SUBMIT: '/feedback/submit',
  /** 获取反馈列表 */
  GET_LIST: '/feedback/list',
} as const
