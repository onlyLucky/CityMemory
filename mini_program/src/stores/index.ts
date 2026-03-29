/**
 * 城迹小程序 - 状态管理
 * 导出所有 Pinia Store
 */

export { useUserStore } from './user'
export { useGameStore } from './game'
export { useShopStore } from './shop'

// 导出类型
export type { AnswerRecord, GameMode, ItemEffect } from './game'
export type { UserItem } from './shop'
