<template>
  <view class="auth-page">
    <view class="auth-container">
      <view class="brand-section">
        <view class="logo">🏙️</view>
        <view class="brand-name">城 迹</view>
        <view class="slogan">记录你探索世界的足迹</view>
      </view>

      <view class="auth-section">
        <view class="auth-description">
          欢迎来到城迹，开始你的地理知识探索之旅
        </view>

        <button class="auth-button" open-type="getUserInfo" @getuserinfo="handleGetUserInfo">
          <text class="button-icon">📱</text>
          <text class="button-text">微信授权登录</text>
        </button>

        <view class="agreement-section">
          <text class="agreement-text">登录即同意</text>
          <text class="agreement-link" @tap="handleAgreementClick">《用户协议》</text>
          <text class="agreement-text">和</text>
          <text class="agreement-link" @tap="handlePrivacyClick">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)

const handleGetUserInfo = async (e: any) => {
  if (e.detail.errMsg !== 'getUserInfo:ok') {
    uni.showToast({
      title: '需要授权才能使用',
      icon: 'none'
    })
    return
  }

  if (loading.value) return

  loading.value = true

  try {
    const { code } = await uni.login({ provider: 'weixin' })
    
    await userStore.login(code)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.redirectTo({ url: '/pages/province-init/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const handleAgreementClick = () => {
  uni.showToast({
    title: '用户协议',
    icon: 'none'
  })
}

const handlePrivacyClick = () => {
  uni.showToast({
    title: '隐私政策',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.auth-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.auth-container {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 120rpx;
  color: #fff;
}

.logo {
  font-size: 120rpx;
  margin-bottom: $spacing-lg;
}

.brand-name {
  font-size: $font-size-xl;
  font-weight: bold;
  margin-bottom: $spacing-md;
}

.slogan {
  font-size: $font-size-md;
  opacity: 0.9;
  text-align: center;
}

.auth-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-description {
  color: #fff;
  font-size: $font-size-md;
  text-align: center;
  margin-bottom: $spacing-xl;
  opacity: 0.95;
  line-height: 1.6;
}

.auth-button {
  width: 100%;
  height: 96rpx;
  background: #fff;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-lg;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  }
}

.button-icon {
  font-size: 40rpx;
  margin-right: $spacing-sm;
}

.button-text {
  font-size: $font-size-md;
  font-weight: 500;
  color: $primary-color;
}

.agreement-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: $font-size-sm;
}

.agreement-text {
  margin: 0 4rpx;
}

.agreement-link {
  color: #fff;
  text-decoration: underline;
  margin: 0 4rpx;
}
</style>
