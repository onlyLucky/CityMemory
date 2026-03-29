/**
 * 本地存储封装
 * 使用前缀 'city_trace_' 避免键名冲突
 */

/** 存储前缀 */
const STORAGE_PREFIX = 'city_trace_'

/**
 * Storage 存储类
 */
class Storage {
  /**
   * 构建完整的存储键
   * @param key 原始键名
   * @returns 带前缀的完整键名
   */
  private buildKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`
  }

  /**
   * 存储数据
   * @param key 键名
   * @param value 值
   */
  set<T>(key: string, value: T): void {
    try {
      const fullKey = this.buildKey(key)
      const serialized = JSON.stringify(value)
      uni.setStorageSync(fullKey, serialized)
    } catch (error) {
      console.error(`存储数据失败 [${key}]`, error)
      throw new Error('存储数据失败')
    }
  }

  /**
   * 获取数据
   * @param key 键名
   * @returns 存储的值，不存在则返回 null
   */
  get<T>(key: string): T | null {
    try {
      const fullKey = this.buildKey(key)
      const value = uni.getStorageSync(fullKey)
      
      if (!value) {
        return null
      }
      
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`获取数据失败 [${key}]`, error)
      return null
    }
  }

  /**
   * 移除数据
   * @param key 键名
   */
  remove(key: string): void {
    try {
      const fullKey = this.buildKey(key)
      uni.removeStorageSync(fullKey)
    } catch (error) {
      console.error(`移除数据失败 [${key}]`, error)
      throw new Error('移除数据失败')
    }
  }

  /**
   * 清除所有带前缀的数据
   */
  clear(): void {
    try {
      const keys = uni.getStorageInfoSync().keys
      const prefixKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX))
      
      prefixKeys.forEach(key => {
        uni.removeStorageSync(key)
      })
    } catch (error) {
      console.error('清除数据失败', error)
      throw new Error('清除数据失败')
    }
  }

  /**
   * 检查键是否存在
   * @param key 键名
   * @returns 是否存在
   */
  has(key: string): boolean {
    try {
      const fullKey = this.buildKey(key)
      const value = uni.getStorageSync(fullKey)
      return value !== '' && value !== null && value !== undefined
    } catch {
      return false
    }
  }

  /**
   * 获取所有键名
   * @returns 键名列表（不含前缀）
   */
  keys(): string[] {
    try {
      const allKeys = uni.getStorageInfoSync().keys
      const prefixKeys = allKeys.filter(key => key.startsWith(STORAGE_PREFIX))
      
      return prefixKeys.map(key => key.replace(STORAGE_PREFIX, ''))
    } catch (error) {
      console.error('获取键名列表失败', error)
      return []
    }
  }

  /**
   * 获取存储信息
   * @returns 存储信息
   */
  getInfo(): { keys: string[]; currentSize: number; limitSize: number } {
    try {
      const info = uni.getStorageInfoSync()
      const prefixKeys = info.keys.filter(key => key.startsWith(STORAGE_PREFIX))
      
      return {
        keys: prefixKeys.map(key => key.replace(STORAGE_PREFIX, '')),
        currentSize: info.currentSize,
        limitSize: info.limitSize
      }
    } catch (error) {
      console.error('获取存储信息失败', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    }
  }
}

/** 导出存储实例 */
export const storage = new Storage()

/** 导出存储类 */
export default Storage
