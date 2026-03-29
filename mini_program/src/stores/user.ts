/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/user'
import * as userApi from '@/api/user'
import { storage } from '@/utils/storage'

/** Token存储键 */
const TOKEN_KEY = 'token'

/** 用户信息存储键 */
const USER_INFO_KEY = 'user_info'

export const useUserStore = defineStore('user', () => {
  // ==========================================
  // 状态
  // ==========================================

  /** 用户Token */
  const token = ref<string>('')

  /** 用户信息 */
  const userInfo = ref<UserInfo | null>(null)

  /** 是否已登录 */
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  /** 用户名称 */
  const userName = computed(() => userInfo.value?.nickname || '')

  // ==========================================
  // 方法
  // ==========================================

  /**
   * 设置Token
   * @param newToken 新Token
   */
  const setToken = (newToken: string) => {
    token.value = newToken
    // 保存到本地存储
    storage.set(TOKEN_KEY, newToken)
  }

  /**
   * 设置用户信息
   * @param info 用户信息
   */
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    // 保存到本地存储
    storage.set(USER_INFO_KEY, info)
  }

  /**
   * 用户登录
   * @param code 微信登录凭证
   * @returns 登录结果
   */
  const login = async (code: string): Promise<boolean> => {
    try {
      const res = await userApi.login(code)
      
      if (res.code === 0 && res.data) {
        // 保存Token
        setToken(res.data.token)
        // 保存用户信息
        setUserInfo(res.data.user_info)
        return true
      }
      
      return false
    } catch (error) {
      console.error('登录失败', error)
      return false
    }
  }

  /**
   * 用户登出
   */
  const logout = () => {
    token.value = ''
    userInfo.value = null
    // 清除本地存储
    storage.remove(TOKEN_KEY)
    storage.remove(USER_INFO_KEY)
  }

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  const getUserInfo = async (): Promise<UserInfo | null> => {
    try {
      const res = await userApi.getUserInfo()
      
      if (res.code === 0 && res.data) {
        setUserInfo(res.data)
        return res.data
      }
      
      return null
    } catch (error) {
      console.error('获取用户信息失败', error)
      return null
    }
  }

  /**
   * 初始化省份
   * @param province 省份名称
   * @param method 初始化方式
   * @returns 是否成功
   */
  const initProvince = async (
    province: string,
    method: 'select' | 'location' = 'select'
  ): Promise<boolean> => {
    try {
      const res = await userApi.initProvince(province, method)
      
      if (res.code === 0 && res.data?.success) {
        // 更新用户信息中的省份
        if (userInfo.value) {
          userInfo.value = {
            ...userInfo.value,
            province: res.data.province
          }
          storage.set(USER_INFO_KEY, userInfo.value)
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('初始化省份失败', error)
      return false
    }
  }

  /**
   * 初始化用户状态
   * 从本地存储恢复Token和用户信息
   */
  const initUserState = () => {
    const savedToken = storage.get<string>(TOKEN_KEY)
    const savedUserInfo = storage.get<UserInfo>(USER_INFO_KEY)
    
    if (savedToken) {
      token.value = savedToken
    }
    
    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }
  }

  // 初始化用户状态
  initUserState()

  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,
    userName,
    // 方法
    setToken,
    setUserInfo,
    login,
    logout,
    getUserInfo,
    initProvince,
    initUserState
  }
})
