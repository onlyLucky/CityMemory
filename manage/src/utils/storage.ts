const TOKEN_KEY = 'token'
const ADMIN_INFO_KEY = 'admin_info'

export const storage = {
  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) || ''
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  getAdminInfo(): any {
    const info = localStorage.getItem(ADMIN_INFO_KEY)
    return info ? JSON.parse(info) : null
  },

  setAdminInfo(info: any): void {
    localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(info))
  },

  removeAdminInfo(): void {
    localStorage.removeItem(ADMIN_INFO_KEY)
  },

  clear(): void {
    localStorage.clear()
  }
}
