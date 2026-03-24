import type { RequestOptions } from '@dcloudio/uni-app'
import { API_BASE_URL } from '@/constants/config'
import type { ApiResponse } from '@/types'

interface RequestConfig extends RequestOptions {
  showLoading?: boolean
  showError?: boolean
}

class Request {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private getHeader(): Record<string, string> {
    const token = uni.getStorageSync('token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Platform': 'miniprogram'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request<T>(options: RequestConfig): Promise<T> {
    const {
      url,
      method = 'GET',
      data,
      showLoading = true,
      showError = true
    } = options

    if (showLoading) {
      uni.showLoading({ title: '加载中', mask: true })
    }

    return new Promise((resolve, reject) => {
      uni.request({
        url: this.baseURL + url,
        method,
        data,
        header: this.getHeader(),
        success: (res: any) => {
          if (showLoading) {
            uni.hideLoading()
          }

          const response = res.data as ApiResponse<T>

          if (response.code === 0) {
            resolve(response.data)
          } else if (response.code === 1002) {
            uni.removeStorageSync('token')
            uni.reLaunch({ url: '/pages/auth/index' })
            reject(new Error(response.message))
          } else {
            if (showError) {
              uni.showToast({ title: response.message || '请求失败', icon: 'none' })
            }
            reject(new Error(response.message))
          }
        },
        fail: (error) => {
          if (showLoading) {
            uni.hideLoading()
          }
          if (showError) {
            uni.showToast({ title: '网络错误', icon: 'none' })
          }
          reject(error)
        }
      })
    })
  }

  get<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'GET', data })
  }

  post<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'POST', data })
  }

  put<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data })
  }

  delete<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', data })
  }
}

const request = new Request()

export default request
