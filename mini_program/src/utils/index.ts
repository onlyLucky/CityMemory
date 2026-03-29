// ==========================================
// 城迹小程序 - 工具函数
// ==========================================

/**
 * 格式化时间
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn(...args)
    }
  }
}

/**
 * 深拷贝
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T
  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * 生成随机数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 打乱数组
 */
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 存储数据到本地
 */
export const setStorage = <T>(key: string, value: T): void => {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
  } catch (e) {
    console.error('存储数据失败', e)
  }
}

/**
 * 从本地获取数据
 */
export const getStorage = <T>(key: string): T | null => {
  try {
    const value = uni.getStorageSync(key)
    return value ? JSON.parse(value) : null
  } catch (e) {
    console.error('获取数据失败', e)
    return null
  }
}

/**
 * 移除本地存储
 */
export const removeStorage = (key: string): void => {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('移除数据失败', e)
  }
}

/**
 * 显示加载
 */
export const showLoading = (title = '加载中...'): void => {
  uni.showLoading({ title, mask: true })
}

/**
 * 隐藏加载
 */
export const hideLoading = (): void => {
  uni.hideLoading()
}

/**
 * 显示提示
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'none' = 'none'): void => {
  uni.showToast({ title, icon, duration: 2000 })
}

/**
 * 显示确认弹窗
 */
export const showConfirm = (title: string, content: string): Promise<boolean> => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

// ==========================================
// 导出核心工具模块
// ==========================================

/** 请求封装 */
export { request, Request, type RequestOptions } from './request'

/** 本地存储封装 */
export { storage, Storage } from './storage'

/** 题目生成器 */
export { questionGenerator, QuestionGenerator, type QuestionGeneratorParams } from './question-generator'

/** 星级计算器 */
export {
  calculateStars,
  calculateTimeBonus,
  calculateFinalStars,
  calculateStarsFromStats,
  starsToText,
  getStarLevel,
  type StarResult
} from './star-calculator'

/** 门票管理器 */
export { ticketManager, TicketManager, type TicketStatus } from './ticket-manager'
