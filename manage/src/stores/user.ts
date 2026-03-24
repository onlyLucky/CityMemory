import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Admin } from '@/types/common'
import { adminApi } from '@/api/admin'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(storage.getToken())
  const adminInfo = ref<Admin | null>(storage.getAdminInfo())

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => adminInfo.value?.nickname || '')
  const userAvatar = computed(() => adminInfo.value?.avatar || '')
  const permissions = computed(() => adminInfo.value?.permissions || [])

  const setToken = (newToken: string) => {
    token.value = newToken
    storage.setToken(newToken)
  }

  const setAdminInfo = (info: Admin) => {
    adminInfo.value = info
    storage.setAdminInfo(info)
  }

  const login = async (username: string, password: string) => {
    const result = await adminApi.login(username, password)
    setToken(result.token)
    setAdminInfo(result.admin)
    return result
  }

  const getInfo = async () => {
    const info = await adminApi.getInfo()
    setAdminInfo(info)
    return info
  }

  const logout = async () => {
    try {
      await adminApi.logout()
    } finally {
      token.value = ''
      adminInfo.value = null
      storage.removeToken()
      storage.removeAdminInfo()
    }
  }

  const hasPermission = (permission: string) => {
    return permissions.value.includes(permission)
  }

  return {
    token,
    adminInfo,
    isLoggedIn,
    userName,
    userAvatar,
    permissions,
    setToken,
    setAdminInfo,
    login,
    getInfo,
    logout,
    hasPermission
  }
})
