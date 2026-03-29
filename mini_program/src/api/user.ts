/**
 * 用户相关 API 接口
 */

import type { ApiResponse } from '@/types'
import type { UserInfo, LoginResult, UserTicket } from '@/types/user'

// ==========================================
// 虚拟数据
// ==========================================

const mockUserInfo: UserInfo = {
  user_id: 10001,
  openid: 'mock_openid_xxxxx',
  nickname: '旅行者小明',
  avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132',
  province: '广东省',
  total_stars: 156,
  level_count: 12,
  coins: 2580,
  created_at: '2024-01-15 10:30:00',
  updated_at: '2024-03-20 15:45:00'
}

const mockUserTicket: UserTicket = {
  adventure_tickets: 5,
  random_tickets: 3,
  adventure_last_recover: '2024-03-20 14:00:00'
}

// ==========================================
// API 接口实现
// ==========================================

/**
 * 微信登录
 * @param code 微信登录凭证
 * @returns 登录结果 {token, user_info}
 */
export function login(code: string): Promise<ApiResponse<LoginResult>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '登录成功',
        data: {
          token: 'mock_token_' + Date.now(),
          user_info: mockUserInfo
        }
      })
    }, 300)
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '获取成功',
        data: mockUserInfo
      })
    }, 200)
  })
}

/**
 * 更新用户信息
 * @param data 更新数据
 * @returns 更新后的用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedInfo = { ...mockUserInfo, ...data }
      resolve({
        code: 0,
        message: '更新成功',
        data: updatedInfo
      })
    }, 200)
  })
}

/**
 * 初始化省份
 * @param province 省份名称
 * @param method 初始化方式
 * @returns 初始化结果
 */
export function initProvince(
  province: string,
  method: 'select' | 'location'
): Promise<ApiResponse<{ province: string; success: boolean }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '省份初始化成功',
        data: {
          province,
          success: true
        }
      })
    }, 300)
  })
}

/**
 * 获取门票状态
 * @returns 门票信息
 */
export function getTicketStatus(): Promise<ApiResponse<UserTicket>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '获取成功',
        data: mockUserTicket
      })
    }, 150)
  })
}
