import type { UserInfo, TicketStatus, Question, Level, AnswerResult, ShopItem, RankItem } from '@/types'

const PREFIX = 'city_trace_'

class Storage {
  private prefix: string

  constructor() {
    this.prefix = PREFIX
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T): void {
    uni.setStorageSync(this.getKey(key), value)
  }

  get<T>(key: string, defaultValue: T | null = null): T | null {
    const data = uni.getStorageSync(this.getKey(key))
    return data !== '' ? data : defaultValue
  }

  remove(key: string): void {
    uni.removeStorageSync(this.getKey(key))
  }

  clear(): void {
    uni.clearStorageSync()
  }
}

const storage = new Storage()

export default storage
