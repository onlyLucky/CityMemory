/**
 * 用户相关类型定义
 */

/** 用户信息接口 */
export interface UserInfo {
  /** 用户ID */
  user_id: number
  /** 微信OpenID */
  openid: string
  /** 昵称 */
  nickname: string
  /** 头像URL */
  avatar: string
  /** 省份 */
  province?: string
  /** 总星数 */
  total_stars: number
  /** 已通关卡数 */
  level_count: number
  /** 金币 */
  coins: number
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/** 用户门票接口 */
export interface UserTicket {
  /** 冒险门票数量 */
  adventure_tickets: number
  /** 随机门票数量 */
  random_tickets: number
  /** 冒险门票上次恢复时间 */
  adventure_last_recover?: string
}

/** 用户道具接口 */
export interface UserItem {
  /** 用户道具ID */
  user_item_id: number
  /** 用户ID */
  user_id: number
  /** 道具ID */
  item_id: number
  /** 道具名称 */
  item_name: string
  /** 道具类型 */
  item_type: string
  /** 数量 */
  quantity: number
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/** 用户登录请求参数 */
export interface LoginParams {
  /** 微信登录凭证 */
  code: string
  /** 用户昵称 */
  nickname?: string
  /** 用户头像 */
  avatar?: string
}

/** 用户登录响应数据 */
export interface LoginResult {
  /** 登录凭证 */
  token: string
  /** 用户信息 */
  user_info: UserInfo
}

/** 用户进度接口 */
export interface UserProgress {
  /** 用户ID */
  user_id: number
  /** 当前关卡ID */
  current_level_id: number
  /** 总星数 */
  total_stars: number
  /** 已通关卡数 */
  completed_levels: number
  /** 总游戏次数 */
  total_games: number
  /** 正确率 */
  accuracy: number
}
