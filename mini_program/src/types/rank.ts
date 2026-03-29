/**
 * 排行榜相关类型定义
 */

import { RankType } from '../constants/enums'

/** 排行榜项接口 */
export interface RankItem {
  /** 排名 */
  rank: number
  /** 用户ID */
  user_id: number
  /** 昵称 */
  nickname: string
  /** 头像URL */
  avatar: string
  /** 总星数 */
  total_stars: number
  /** 已通关卡数 */
  level_count: number
  /** 金币数 */
  coins?: number
}

/** 排行榜列表参数 */
export interface RankListParams {
  /** 排行榜类型 */
  type: RankType
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/** 排行榜数据接口 */
export interface RankData {
  /** 排行榜列表 */
  list: RankItem[]
  /** 当前用户排名 */
  my_rank?: RankItem
  /** 总数 */
  total: number
  /** 更新时间 */
  update_time: string
}

/** 周排行数据接口 */
export interface WeeklyRankData extends RankData {
  /** 周期开始时间 */
  week_start: string
  /** 周期结束时间 */
  week_end: string
}

/** 好友排行数据接口 */
export interface FriendsRankData extends RankData {
  /** 好友数量 */
  friends_count: number
}

/** 排名变化接口 */
export interface RankChange {
  /** 用户ID */
  user_id: number
  /** 旧排名 */
  old_rank: number
  /** 新排名 */
  new_rank: number
  /** 变化值（正数上升，负数下降） */
  change: number
}
