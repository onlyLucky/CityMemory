<template>
  <view class="settings-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="onGoBack">
        <text class="back-icon">&lt;</text>
        <text class="back-text">返回</text>
      </view>
      <text class="nav-title">设置</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 设置项列表 -->
    <view class="settings-section">
      <view class="section-header">
        <text class="section-title">声音设置</text>
      </view>
      <view class="settings-list">
        <view class="settings-item">
          <text class="settings-text">音效</text>
          <switch :checked="settings.soundEnabled" @change="onToggleSound" color="#2E7D32" />
        </view>
        <view class="settings-item">
          <text class="settings-text">背景音乐</text>
          <switch :checked="settings.musicEnabled" @change="onToggleMusic" color="#2E7D32" />
        </view>
        <view class="settings-item">
          <text class="settings-text">震动反馈</text>
          <switch :checked="settings.vibrationEnabled" @change="onToggleVibration" color="#2E7D32" />
        </view>
      </view>
    </view>

    <!-- 其他设置 -->
    <view class="settings-section">
      <view class="section-header">
        <text class="section-title">其他</text>
      </view>
      <view class="settings-list">
        <view class="settings-item" @tap="onClearCache">
          <text class="settings-text">清除缓存</text>
          <view class="settings-right">
            <text class="settings-value">{{ cacheSize }}</text>
            <text class="settings-arrow">></text>
          </view>
        </view>
        <view class="settings-item" @tap="onAbout">
          <text class="settings-text">关于我们</text>
          <text class="settings-arrow">></text>
        </view>
        <view class="settings-item" @tap="onViewProtocol('user')">
          <text class="settings-text">用户协议</text>
          <text class="settings-arrow">></text>
        </view>
        <view class="settings-item" @tap="onViewProtocol('privacy')">
          <text class="settings-text">隐私政策</text>
          <text class="settings-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="btn-logout" @tap="onLogout">
        <text class="logout-text">退出登录</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storage } from '@/utils/storage'

// ==========================================
// 常量
// ==========================================

/** 设置存储键 */
const SETTINGS_KEY = 'user_settings'

// ==========================================
// 状态
// ==========================================

const userStore = useUserStore()

// 缓存大小
const cacheSize = ref('0 KB')

// 设置项
const settings = reactive({
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true
})

// ==========================================
// 方法
// ==========================================

/**
 * 返回上一页
 */
const onGoBack = () => {
  uni.navigateBack()
}

/**
 * 切换音效开关
 */
const onToggleSound = (e: any) => {
  settings.soundEnabled = e.detail.value
  saveSettings()
}

/**
 * 切换背景音乐开关
 */
const onToggleMusic = (e: any) => {
  settings.musicEnabled = e.detail.value
  saveSettings()
}

/**
 * 切换震动反馈开关
 */
const onToggleVibration = (e: any) => {
  settings.vibrationEnabled = e.detail.value
  saveSettings()
}

/**
 * 保存设置到本地存储
 */
const saveSettings = () => {
  storage.set(SETTINGS_KEY, { ...settings })
}

/**
 * 从本地存储加载设置
 */
const loadSettings = () => {
  const savedSettings = storage.get<typeof settings>(SETTINGS_KEY)
  if (savedSettings) {
    Object.assign(settings, savedSettings)
  }
}

/**
 * 计算缓存大小
 */
const calculateCacheSize = () => {
  try {
    const info = uni.getStorageInfoSync()
    const sizeKB = info.currentSize
    if (sizeKB < 1024) {
      cacheSize.value = `${sizeKB} KB`
    } else {
      const sizeMB = (sizeKB / 1024).toFixed(1)
      cacheSize.value = `${sizeMB} MB`
    }
  } catch (error) {
    console.error('获取缓存大小失败', error)
    cacheSize.value = '0 KB'
  }
}

/**
 * 清除缓存
 */
const onClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清除中...' })
        setTimeout(() => {
          try {
            // 保留用户信息和设置
            const token = storage.get<string>('token')
            const userInfo = storage.get<any>('user_info')
            const savedSettings = storage.get<typeof settings>(SETTINGS_KEY)

            // 清除所有缓存
            storage.clear()

            // 恢复用户信息和设置
            if (token) storage.set('token', token)
            if (userInfo) storage.set('user_info', userInfo)
            if (savedSettings) storage.set(SETTINGS_KEY, savedSettings)

            uni.hideLoading()
            calculateCacheSize()
            uni.showToast({ title: '清除成功', icon: 'success' })
          } catch (error) {
            uni.hideLoading()
            uni.showToast({ title: '清除失败', icon: 'none' })
          }
        }, 500)
      }
    }
  })
}

/**
 * 关于我们
 */
const onAbout = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

/**
 * 查看协议
 * @param type 协议类型
 */
const onViewProtocol = (type: string) => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

/**
 * 退出登录
 */
const onLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户数据
        userStore.logout()
        // 跳转授权页
        uni.redirectTo({ url: '/pages/auth/index' })
      }
    }
  })
}

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  loadSettings()
  calculateCacheSize()
})
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  padding-bottom: calc($spacing-page-lg + env(safe-area-inset-bottom));
}

// 顶部导航栏
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 $spacing-page;
  padding-top: env(safe-area-inset-top);
  background-color: $color-bg-card;
  border-bottom: 1rpx solid $color-border-light;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: $spacing-text-sm;
  padding: $spacing-text $spacing-text-sm;
  margin-left: -$spacing-text-sm;

  &:active {
    opacity: 0.6;
  }
}

.back-icon {
  font-size: $font-size-xl;
  color: $color-text-primary;
}

.back-text {
  font-size: $font-size-base;
  color: $color-text-primary;
}

.nav-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.nav-placeholder {
  width: 100rpx;
}

// 设置项列表
.settings-section {
  margin: $spacing-page;
}

.section-header {
  margin-bottom: $spacing-element;
}

.section-title {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.settings-list {
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-page;
  border-bottom: 1rpx solid $color-border-light;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: $color-bg-page;
  }
}

.settings-text {
  font-size: $font-size-base;
  color: $color-text-primary;
}

.settings-right {
  display: flex;
  align-items: center;
}

.settings-value {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin-right: $spacing-text;
}

.settings-arrow {
  font-size: $font-size-base;
  color: $color-text-placeholder;
}

// 退出登录
.logout-section {
  margin: $spacing-page-lg $spacing-page;
}

.btn-logout {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 2rpx solid $color-error;

  &::after {
    display: none;
  }

  &:active {
    opacity: 0.8;
  }
}

.logout-text {
  font-size: $font-size-base;
  color: $color-error;
}
</style>
