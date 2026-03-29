/**
 * 请求封装
 * 封装 uni.request，支持自动添加 token、loading、错误处理
 */

import { BASE_URL } from '../constants/api'
import type { ApiResponse } from '../types/api'

/** 请求配置接口 */
export interface RequestOptions {
  /** 是否显示 loading */
  showLoading?: boolean
  /** loading 文字 */
  loadingText?: string
  /** 是否显示错误提示 */
  showError?: boolean
  /** 自定义请求头 */
  header?: Record<string, string>
  /** 超时时间 */
  timeout?: number
}

/** 响应错误码 */
const ErrorCode = {
  /** Token 过期 */
  TOKEN_EXPIRED: 1002,
  /** 未授权 */
  UNAUTHORIZED: 1001,
} as const

/** Token 存储键 */
const TOKEN_KEY = 'city_trace_token'

/**
 * Request 请求类
 */
class Request {
  /** 基础 URL */
  private baseURL: string = BASE_URL

  /**
   * 获取 Token
   */
  private getToken(): string {
    try {
      return uni.getStorageSync(TOKEN_KEY) || ''
    } catch {
      return ''
    }
  }

  /**
   * 设置 Token
   */
  setToken(token: string): void {
    try {
      uni.setStorageSync(TOKEN_KEY, token)
    } catch (e) {
      console.error('保存 Token 失败', e)
    }
  }

  /**
   * 清除 Token
   */
  clearToken(): void {
    try {
      uni.removeStorageSync(TOKEN_KEY)
    } catch (e) {
      console.error('清除 Token 失败', e)
    }
  }

  /**
   * 跳转到授权页
   */
  private navigateToAuth(): void {
    // 清除 Token
    this.clearToken()
    // 跳转到授权页
    uni.reLaunch({
      url: '/pages/auth/index'
    })
  }

  /**
   * 显示 Loading
   */
  private showLoading(title: string): void {
    uni.showLoading({
      title,
      mask: true
    })
  }

  /**
   * 隐藏 Loading
   */
  private hideLoading(): void {
    uni.hideLoading()
  }

  /**
   * 显示错误提示
   */
  private showError(message: string): void {
    uni.showToast({
      title: message || '请求失败',
      icon: 'none',
      duration: 2000
    })
  }

  /**
   * 核心请求方法
   */
  async request<T = unknown>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: Record<string, unknown>,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      showLoading: shouldShowLoading = false,
      loadingText = '加载中...',
      showError = true,
      header = {},
      timeout = 30000
    } = options

    // 显示 Loading
    if (shouldShowLoading) {
      this.showLoading(loadingText)
    }

    try {
      // 获取 Token
      const token = this.getToken()

      // 构建请求头
      const requestHeader: Record<string, string> = {
        'Content-Type': 'application/json',
        ...header
      }

      // 添加 Token 到请求头
      if (token) {
        requestHeader['Authorization'] = `Bearer ${token}`
      }

      // 发起请求
      const response = await new Promise<ApiResponse<T>>((resolve, reject) => {
        uni.request({
          url: `${this.baseURL}${url}`,
          method,
          data,
          header: requestHeader,
          timeout,
          success: (res) => {
            resolve(res.data as ApiResponse<T>)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })

      // 处理响应
      const { code, message, data: responseData } = response

      // Token 过期处理
      if (code === ErrorCode.TOKEN_EXPIRED || code === ErrorCode.UNAUTHORIZED) {
        this.navigateToAuth()
        throw new Error('登录已过期，请重新登录')
      }

      // 业务错误处理
      if (code !== 0) {
        if (showError) {
          this.showError(message)
        }
        throw new Error(message || '请求失败')
      }

      return responseData
    } catch (error) {
      // 网络错误处理
      if (error instanceof Error) {
        if (showError && !error.message.includes('登录已过期')) {
          this.showError(error.message || '网络请求失败')
        }
        throw error
      }

      // 未知错误
      const unknownError = new Error('网络请求失败')
      if (showError) {
        this.showError('网络请求失败')
      }
      throw unknownError
    } finally {
      // 隐藏 Loading
      if (shouldShowLoading) {
        this.hideLoading()
      }
    }
  }

  /**
   * GET 请求
   */
  get<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, 'GET', data, options)
  }

  /**
   * POST 请求
   */
  post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, 'POST', data, options)
  }

  /**
   * PUT 请求
   */
  put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, 'PUT', data, options)
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, 'DELETE', data, options)
  }
}

/** 导出请求实例 */
export const request = new Request()

/** 导出请求类 */
export default Request
