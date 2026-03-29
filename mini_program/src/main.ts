import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  
  app.use(pinia)
  
  app.config.errorHandler = (err, instance, info) => {
    console.error('全局错误:', err, info)
    uni.showToast({
      title: '发生错误，请重试',
      icon: 'none'
    })
  }
  
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('全局警告:', msg, trace)
  }
  
  return {
    app,
    pinia
  }
}
