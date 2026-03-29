<template>
  <view class="auth-page">
    <!-- 品牌介绍 -->
    <view class="auth-content">
      <view class="logo-wrapper">
        <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      </view>
      <text class="app-name">城迹</text>
      <text class="app-slogan">记录你探索世界的足迹</text>
      <text class="app-desc">探索中国城市记忆，答题闯关学地理</text>
    </view>

    <!-- 授权按钮 -->
    <view class="auth-buttons">
      <button
        class="btn-auth"
        :loading="isLoading"
        :disabled="isLoading"
        @tap="onAuthLogin"
      >
        <text class="btn-text">微信授权登录</text>
      </button>
    </view>

    <!-- 用户协议 -->
    <view class="auth-protocol">
      <text class="protocol-text">登录即代表同意</text>
      <text class="protocol-link" @tap="onViewProtocol('user')">《用户协议》</text>
      <text class="protocol-text">和</text>
      <text class="protocol-link" @tap="onViewProtocol('privacy')">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

// ==========================================
// Store
// ==========================================

const userStore = useUserStore()

// ==========================================
// 状态
// ==========================================

/** 加载状态 */
const isLoading = ref(false)

// ==========================================
// 方法
// ==========================================

/**
 * 微信授权登录
 */
const onAuthLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true

  try {
    // 1. 调用 uni.login 获取微信登录凭证
    const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })

    if (!loginRes.code) {
      uni.showToast({
        title: '获取登录凭证失败',
        icon: 'none'
      })
      return
    }

    // 2. 调用 userApi.login 进行登录
    const success = await userStore.login(loginRes.code)

    if (success) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 3. 登录成功后跳转省份初始化页
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/province-init/index' })
      }, 500)
    } else {
      uni.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('登录失败', error)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

/**
 * 查看协议
 */
const onViewProtocol = (type: 'user' | 'privacy') => {
  // TODO: 跳转到协议页面
  const title = type === 'user' ? '用户协议' : '隐私政策'
  uni.showToast({
    title: `查看${title}`,
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: $color-bg-page;
  padding: $spacing-page-lg;
  padding-top: calc(200rpx + env(safe-area-inset-top));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

// ==========================================
// 品牌介绍
// ==========================================

.auth-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: auto;
}

.logo-wrapper {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: $spacing-element-lg;
  background-color: $color-bg-card;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-base;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 120rpx;
  height: 120rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-text;
}

.app-slogan {
  font-size: $font-size-base;
  color: $color-text-secondary;
  margin-bottom: $spacing-text-sm;
}

.app-desc {
  font-size: $font-size-sm;
  color: $color-text-placeholder;
}

// ==========================================
// 授权按钮
// ==========================================

.auth-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $spacing-element;
  margin-bottom: $spacing-module;
}

.btn-auth {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-primary;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }

  &[disabled] {
    background-color: $color-text-disabled;
  }
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}

// ==========================================
// 用户协议
// ==========================================

.auth-protocol {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.protocol-text {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.protocol-link {
  font-size: $font-size-xs;
  color: $color-primary;
}
</style>
