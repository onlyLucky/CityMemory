import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, TicketStatus } from '@/types'
import { userApi } from '@/api'
import storage from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(storage.get('token', ''))
  const userInfo = ref<UserInfo | null>(storage.get('userInfo', null))
  const ticketStatus = ref<TicketStatus | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.nickname || '游客')

  const setToken = (newToken: string) => {
    token.value = newToken
    storage.set('token', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    storage.set('userInfo', info)
  }

  const setTicketStatus = (status: TicketStatus) => {
    ticketStatus.value = status
  }

  const login = async (code: string) => {
    const result = await userApi.login(code)
    setToken(result.token)
    setUserInfo(result.user)
    return result
  }

  const getUserInfo = async () => {
    const info = await userApi.getUserInfo()
    setUserInfo(info)
    return info
  }

  const getTicketStatus = async () => {
    const status = await userApi.getTicketStatus()
    setTicketStatus(status)
    return status
  }

  const initProvince = async (province: string, method: string) => {
    const result = await userApi.initProvince(province, method)
    if (userInfo.value) {
      userInfo.value.province = result.province
      setUserInfo(userInfo.value)
    }
    return result
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    ticketStatus.value = null
    storage.remove('token')
    storage.remove('userInfo')
  }

  return {
    token,
    userInfo,
    ticketStatus,
    isLoggedIn,
    userName,
    setToken,
    setUserInfo,
    setTicketStatus,
    login,
    getUserInfo,
    getTicketStatus,
    initProvince,
    logout
  }
})
