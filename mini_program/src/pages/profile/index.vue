<template>
  <view class="profile-page">
    <view class="profile-header">
      <image class="avatar" :src="userInfo?.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
      <view class="user-info">
        <text class="nickname">{{ userInfo?.nickname || '游客' }}</text>
        <text class="province">{{ userInfo?.province || '未设置' }}</text>
      </view>
      <view class="edit-button" @tap="handleEditProfile">
        <text>编辑</text>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-icon">⭐</text>
        <text class="stat-value">{{ userInfo?.totalStars || 0 }}</text>
        <text class="stat-label">总星星</text>
      </view>
      <view class="stat-card">
        <text class="stat-icon">🎯</text>
        <text class="stat-value">{{ userInfo?.levelCount || 0 }}</text>
        <text class="stat-label">通关卡数</text>
      </view>
      <view class="stat-card">
        <text class="stat-icon">💰</text>
        <text class="stat-value">{{ userCoins }}</text>
        <text class="stat-label">金币</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @tap="handleGoToSettings">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @tap="handleGoToHelp">
        <view class="menu-left">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助中心</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @tap="handleGoToFeedback">
        <view class="menu-left">
          <text class="menu-icon">💬</text>
          <text class="menu-text">意见反馈</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @tap="handleGoToAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="logout-section">
      <button class="logout-button" @tap="handleLogout">
        <text>退出登录</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const userCoins = ref(500)

onMounted(async () => {
  await loadUserData()
})

const loadUserData = async () => {
  try {
    await userStore.getUserInfo()
  } catch (error) {
    console.error('加载用户数据失败', error)
  }
}

const handleEditProfile = () => {
  uni.showToast({
    title: '编辑功能开发中',
    icon: 'none'
  })
}

const handleGoToSettings = () => {
  uni.navigateTo({ url: '/pages/settings/index' })
}

const handleGoToHelp = () => {
  uni.showToast({
    title: '帮助中心开发中',
    icon: 'none'
  })
}

const handleGoToFeedback = () => {
  uni.showToast({
    title: '意见反馈开发中',
    icon: 'none'
  })
}

const handleGoToAbout = () => {
  uni.showToast({
    title: '关于我们',
    icon: 'none'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.reLaunch({ url: '/pages/auth/index' })
      }
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.profile-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.profile-header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: $spacing-xl $spacing-lg;
  display: flex;
  align-items: center;
  color: #fff;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: $spacing-lg;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.nickname {
  font-size: $font-size-lg;
  font-weight: bold;
  margin-bottom: 4rpx;
}

.province {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.edit-button {
  padding: $spacing-sm $spacing-md;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-md;
  font-size: $font-size-sm;
  backdrop-filter: blur(10rpx);
}

.stats-section {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: #fff;
  margin: $spacing-lg;
  border-radius: $radius-lg;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.stat-icon {
  font-size: 48rpx;
}

.stat-value {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $primary-color;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.menu-section {
  background: #fff;
  margin: 0 $spacing-lg $spacing-lg;
  border-radius: $radius-lg;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: $background-color;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.menu-icon {
  font-size: 40rpx;
}

.menu-text {
  font-size: $font-size-md;
  color: $text-primary;
}

.menu-arrow {
  font-size: 48rpx;
  color: $text-secondary;
}

.logout-section {
  padding: $spacing-lg;
}

.logout-button {
  width: 100%;
  height: 96rpx;
  background: #fff;
  color: $error-color;
  border: 2rpx solid $error-color;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  font-weight: 500;

  &:active {
    background: rgba(244, 67, 54, 0.05);
  }
}
</style>
