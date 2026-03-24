import type { Admin } from '@/types/common'

export const adminApi = {
  login(username: string, password: string) {
    return new Promise<{ token: string; admin: Admin }>((resolve) => {
      setTimeout(() => {
        const admin = {
          id: 'admin001',
          username: username,
          nickname: '管理员',
          role: 'admin',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng',
          permissions: ['user:read', 'user:write', 'level:read', 'level:write', 'question:read', 'question:write'],
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-03-24T00:00:00Z'
        }
        resolve({
          token: 'mock_token_' + Date.now(),
          admin
        })
      }, 500)
    })
  },

  logout() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  },

  getInfo() {
    return new Promise<Admin>((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'admin001',
          username: 'admin',
          nickname: '管理员',
          role: 'admin',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng',
          permissions: ['user:read', 'user:write', 'level:read', 'level:write', 'question:read', 'question:write'],
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-03-24T00:00:00Z'
        })
      }, 300)
    })
  }
}
