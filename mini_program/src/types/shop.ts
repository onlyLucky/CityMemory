/**
 * 商店相关类型定义
 */

import { ItemType, CurrencyType } from '../constants/enums'

/** 商品接口 */
export interface ShopItem {
  /** 商品ID */
  id: number
  /** 商品名称 */
  name: string
  /** 商品描述 */
  description: string
  /** 价格 */
  price: number
  /** 货币类型 */
  currency_type: CurrencyType
  /** 道具类型 */
  item_type: ItemType
  /** 数量 */
  quantity: number
  /** 商品图标 */
  icon?: string
  /** 是否上架 */
  is_available: boolean
  /** 排序 */
  sort_order: number
}

/** 购买商品参数 */
export interface BuyItemParams {
  /** 商品ID */
  item_id: number
  /** 购买数量 */
  quantity: number
}

/** 购买商品结果 */
export interface BuyItemResult {
  /** 是否成功 */
  success: boolean
  /** 消耗金币 */
  cost_coins: number
  /** 消耗钻石 */
  cost_diamonds: number
  /** 剩余金币 */
  remaining_coins: number
  /** 剩余钻石 */
  remaining_diamonds: number
  /** 获得道具 */
  obtained_items: ObtainedItem[]
}

/** 获得道具接口 */
export interface ObtainedItem {
  /** 道具ID */
  item_id: number
  /** 道具名称 */
  item_name: string
  /** 道具类型 */
  item_type: ItemType
  /** 数量 */
  quantity: number
}

/** 商品列表参数 */
export interface ShopListParams {
  /** 道具类型筛选 */
  item_type?: ItemType
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/** 使用道具参数 */
export interface UseItemParams {
  /** 用户道具ID */
  user_item_id: number
  /** 使用场景 */
  scene: string
  /** 场景相关数据 */
  scene_data?: Record<string, unknown>
}

/** 使用道具结果 */
export interface UseItemResult {
  /** 是否成功 */
  success: boolean
  /** 剩余数量 */
  remaining_quantity: number
  /** 道具效果数据 */
  effect_data?: Record<string, unknown>
}
