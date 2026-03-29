/**
 * 门票管理器
 * 管理闯关门票和随机门票
 */

import { TICKET_CONFIG } from '../constants/config'
import { storage } from './storage'

/** 门票状态接口 */
export interface TicketStatus {
  /** 冒险门票数量 */
  adventureTickets: number
  /** 随机门票数量 */
  randomTickets: number
  /** 冒险门票下次恢复时间（秒） */
  adventureRecoverTime: number
  /** 随机门票是否已用完 */
  randomTicketsExhausted: boolean
}

/** 门票存储数据接口 */
interface TicketStorage {
  /** 冒险门票数量 */
  adventureTickets: number
  /** 随机门票数量 */
  randomTickets: number
  /** 冒险门票上次恢复时间戳 */
  adventureLastRecover: number
  /** 随机门票上次重置日期（YYYY-MM-DD） */
  randomLastReset: string
}

/** 存储键名 */
const STORAGE_KEY = 'ticket_data'

/**
 * 获取当前日期字符串
 */
function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 门票管理器类
 */
class TicketManager {
  /** 门票数据 */
  private ticketData: TicketStorage

  constructor() {
    // 从本地存储加载门票数据
    this.ticketData = this.loadTicketData()
    // 初始化时检查恢复和重置
    this.checkRecovery()
    this.checkReset()
  }

  /**
   * 加载门票数据
   */
  private loadTicketData(): TicketStorage {
    const data = storage.get<TicketStorage>(STORAGE_KEY)
    
    if (data) {
      return data
    }

    // 默认数据
    const defaultData: TicketStorage = {
      adventureTickets: TICKET_CONFIG.ADVENTURE_TICKET_MAX,
      randomTickets: TICKET_CONFIG.RANDOM_TICKET_MAX,
      adventureLastRecover: Date.now(),
      randomLastReset: getCurrentDate(),
    }

    // 保存默认数据
    storage.set(STORAGE_KEY, defaultData)

    return defaultData
  }

  /**
   * 保存门票数据
   */
  private saveTicketData(): void {
    storage.set(STORAGE_KEY, this.ticketData)
  }

  /**
   * 检查冒险门票恢复
   */
  private checkRecovery(): void {
    const now = Date.now()
    const lastRecover = this.ticketData.adventureLastRecover
    const recoverTime = TICKET_CONFIG.ADVENTURE_RECOVER_TIME * 1000 // 转换为毫秒

    // 计算应该恢复的次数
    const elapsed = now - lastRecover
    const recoverCount = Math.floor(elapsed / recoverTime)

    if (recoverCount > 0 && this.ticketData.adventureTickets < TICKET_CONFIG.ADVENTURE_TICKET_MAX) {
      // 恢复门票（不超过最大值）
      const newTickets = Math.min(
        TICKET_CONFIG.ADVENTURE_TICKET_MAX,
        this.ticketData.adventureTickets + recoverCount
      )
      
      this.ticketData.adventureTickets = newTickets
      this.ticketData.adventureLastRecover = now
      this.saveTicketData()
    }
  }

  /**
   * 检查随机门票重置
   */
  private checkReset(): void {
    const currentDate = getCurrentDate()
    
    // 如果是新的一天，重置随机门票
    if (this.ticketData.randomLastReset !== currentDate) {
      this.ticketData.randomTickets = TICKET_CONFIG.RANDOM_TICKET_MAX
      this.ticketData.randomLastReset = currentDate
      this.saveTicketData()
    }
  }

  /**
   * 获取门票状态
   */
  getTicketStatus(): TicketStatus {
    // 检查恢复和重置
    this.checkRecovery()
    this.checkReset()

    // 计算下次恢复时间
    const now = Date.now()
    const lastRecover = this.ticketData.adventureLastRecover
    const recoverTime = TICKET_CONFIG.ADVENTURE_RECOVER_TIME * 1000
    const nextRecoverTime = Math.max(
      0,
      Math.ceil((recoverTime - (now - lastRecover)) / 1000)
    )

    return {
      adventureTickets: this.ticketData.adventureTickets,
      randomTickets: this.ticketData.randomTickets,
      adventureRecoverTime: this.ticketData.adventureTickets >= TICKET_CONFIG.ADVENTURE_TICKET_MAX 
        ? 0 
        : nextRecoverTime,
      randomTicketsExhausted: this.ticketData.randomTickets <= 0,
    }
  }

  /**
   * 消耗冒险门票
   * @param count 消耗数量，默认1
   * @returns 是否消耗成功
   */
  consumeAdventureTicket(count: number = 1): boolean {
    // 检查恢复
    this.checkRecovery()

    // 检查数量是否足够
    if (this.ticketData.adventureTickets < count) {
      return false
    }

    // 消耗门票
    this.ticketData.adventureTickets -= count
    this.saveTicketData()

    return true
  }

  /**
   * 消耗随机门票
   * @param count 消耗数量，默认1
   * @returns 是否消耗成功
   */
  consumeRandomTicket(count: number = 1): boolean {
    // 检查重置
    this.checkReset()

    // 检查数量是否足够
    if (this.ticketData.randomTickets < count) {
      return false
    }

    // 消耗门票
    this.ticketData.randomTickets -= count
    this.saveTicketData()

    return true
  }

  /**
   * 消耗门票（统一接口）
   * @param type 门票类型：'adventure' | 'random'
   * @param count 消耗数量，默认1
   * @returns 是否消耗成功
   */
  consumeTicket(type: 'adventure' | 'random', count: number = 1): boolean {
    if (type === 'adventure') {
      return this.consumeAdventureTicket(count)
    } else {
      return this.consumeRandomTicket(count)
    }
  }

  /**
   * 手动恢复冒险门票
   * @param count 恢复数量
   * @returns 恢复后的数量
   */
  recoverAdventureTickets(count: number): number {
    // 检查恢复
    this.checkRecovery()

    // 恢复门票（不超过最大值）
    const newTickets = Math.min(
      TICKET_CONFIG.ADVENTURE_TICKET_MAX,
      this.ticketData.adventureTickets + count
    )

    this.ticketData.adventureTickets = newTickets
    this.saveTicketData()

    return newTickets
  }

  /**
   * 手动恢复随机门票
   * @param count 恢复数量
   * @returns 恢复后的数量
   */
  recoverRandomTickets(count: number): number {
    // 检查重置
    this.checkReset()

    // 恢复门票（不超过最大值）
    const newTickets = Math.min(
      TICKET_CONFIG.RANDOM_TICKET_MAX,
      this.ticketData.randomTickets + count
    )

    this.ticketData.randomTickets = newTickets
    this.saveTicketData()

    return newTickets
  }

  /**
   * 恢复门票（统一接口）
   * @param type 门票类型：'adventure' | 'random'
   * @param count 恢复数量
   * @returns 恢复后的数量
   */
  recoverTickets(type: 'adventure' | 'random', count: number): number {
    if (type === 'adventure') {
      return this.recoverAdventureTickets(count)
    } else {
      return this.recoverRandomTickets(count)
    }
  }

  /**
   * 检查是否有足够的门票
   * @param type 门票类型：'adventure' | 'random'
   * @param count 需要的数量，默认1
   * @returns 是否有足够的门票
   */
  hasEnoughTickets(type: 'adventure' | 'random', count: number = 1): boolean {
    const status = this.getTicketStatus()
    
    if (type === 'adventure') {
      return status.adventureTickets >= count
    } else {
      return status.randomTickets >= count
    }
  }

  /**
   * 重置所有门票（用于测试或特殊情况）
   */
  resetAllTickets(): void {
    this.ticketData = {
      adventureTickets: TICKET_CONFIG.ADVENTURE_TICKET_MAX,
      randomTickets: TICKET_CONFIG.RANDOM_TICKET_MAX,
      adventureLastRecover: Date.now(),
      randomLastReset: getCurrentDate(),
    }
    this.saveTicketData()
  }

  /**
   * 获取冒险门票恢复进度
   * @returns 恢复进度（0-1）
   */
  getAdventureRecoverProgress(): number {
    // 如果已满，返回1
    if (this.ticketData.adventureTickets >= TICKET_CONFIG.ADVENTURE_TICKET_MAX) {
      return 1
    }

    const now = Date.now()
    const lastRecover = this.ticketData.adventureLastRecover
    const recoverTime = TICKET_CONFIG.ADVENTURE_RECOVER_TIME * 1000
    const elapsed = now - lastRecover

    return Math.min(1, elapsed / recoverTime)
  }

  /**
   * 格式化恢复时间为显示文本
   * @param seconds 秒数
   * @returns 格式化后的文本
   */
  formatRecoverTime(seconds: number): string {
    if (seconds <= 0) {
      return '已满'
    }

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    if (mins > 0) {
      return `${mins}分${secs}秒`
    } else {
      return `${secs}秒`
    }
  }
}

/** 导出门票管理器实例 */
export const ticketManager = new TicketManager()

/** 导出门票管理器类 */
export default TicketManager
