/**
 * 星级计算器
 * 根据正确率和答题时间计算最终星级
 */

import { STAR_CONFIG } from '../constants/config'

/** 星级计算结果 */
export interface StarResult {
  /** 基础星级 */
  baseStars: number
  /** 时间加成 */
  timeBonus: number
  /** 最终星级 */
  finalStars: number
}

/**
 * 根据正确率计算基础星级
 * @param accuracy 正确率（0-100）
 * @returns 基础星级（0.5-5）
 */
export function calculateStars(accuracy: number): number {
  // 确保正确率在有效范围内
  const validAccuracy = Math.max(0, Math.min(100, accuracy))

  // 根据正确率区间返回对应星级
  if (validAccuracy >= 100) {
    return 5
  } else if (validAccuracy >= 90) {
    return 4.5
  } else if (validAccuracy >= 80) {
    return 4
  } else if (validAccuracy >= 70) {
    return 3.5
  } else if (validAccuracy >= 60) {
    return 3
  } else if (validAccuracy >= 50) {
    return 2.5
  } else if (validAccuracy >= 40) {
    return 2
  } else if (validAccuracy >= 30) {
    return 1.5
  } else if (validAccuracy >= 20) {
    return 1
  } else {
    return 0.5
  }
}

/**
 * 根据平均答题时间计算时间加成
 * @param avgTime 平均答题时间（秒）
 * @returns 时间加成星级（0-1）
 */
export function calculateTimeBonus(avgTime: number): number {
  // 确保时间在有效范围内
  const validTime = Math.max(0, avgTime)

  // 根据时间返回加成
  if (validTime <= 5) {
    return 1
  } else if (validTime <= 10) {
    return 0.5
  } else {
    return 0
  }
}

/**
 * 计算最终星级
 * @param accuracy 正确率（0-100）
 * @param avgTime 平均答题时间（秒）
 * @returns 星级计算结果
 */
export function calculateFinalStars(accuracy: number, avgTime: number): StarResult {
  // 计算基础星级
  const baseStars = calculateStars(accuracy)

  // 计算时间加成
  const timeBonus = calculateTimeBonus(avgTime)

  // 计算最终星级（最大不超过配置的最大星数）
  const finalStars = Math.min(
    STAR_CONFIG.MAX_STARS,
    Math.round((baseStars + timeBonus) * 2) / 2 // 保留0.5星精度
  )

  return {
    baseStars,
    timeBonus,
    finalStars,
  }
}

/**
 * 批量计算星级
 * @param correctCount 正确数量
 * @param totalCount 总数量
 * @param totalTime 总用时（秒）
 * @returns 星级计算结果
 */
export function calculateStarsFromStats(
  correctCount: number,
  totalCount: number,
  totalTime: number
): StarResult {
  // 计算正确率
  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0

  // 计算平均用时
  const avgTime = correctCount > 0 ? totalTime / correctCount : 0

  return calculateFinalStars(accuracy, avgTime)
}

/**
 * 星级转显示文本
 * @param stars 星级数
 * @returns 显示文本
 */
export function starsToText(stars: number): string {
  // 确保星级在有效范围内
  const validStars = Math.max(0, Math.min(STAR_CONFIG.MAX_STARS, stars))

  // 整数部分
  const fullStars = Math.floor(validStars)
  // 是否有半星
  const hasHalfStar = validStars - fullStars >= 0.5

  // 构建显示文本
  let text = '★'.repeat(fullStars)
  if (hasHalfStar) {
    text += '☆'
  }

  return text
}

/**
 * 获取星级等级描述
 * @param stars 星级数
 * @returns 等级描述
 */
export function getStarLevel(stars: number): string {
  if (stars >= 6) {
    return '完美'
  } else if (stars >= 5) {
    return '优秀'
  } else if (stars >= 4) {
    return '良好'
  } else if (stars >= 3) {
    return '及格'
  } else if (stars >= 2) {
    return '加油'
  } else if (stars >= 1) {
    return '继续努力'
  } else {
    return '再接再厉'
  }
}

/**
 * 导出默认对象
 */
export default {
  calculateStars,
  calculateTimeBonus,
  calculateFinalStars,
  calculateStarsFromStats,
  starsToText,
  getStarLevel,
}
