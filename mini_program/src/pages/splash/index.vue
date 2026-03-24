<template>
  <view class="splash-page">
    <view v-if="isFirstVisit" class="brand-container">
      <view class="logo">🏙️</view>
      <view class="brand-name">城 迹</view>
      <view class="slogan">记录你探索世界的足迹</view>
    </view>

    <view v-else class="recommendation-container">
      <view class="skip-button" @tap="handleSkip">
        <text>跳过 {{ countdown }}s</text>
      </view>

      <view class="recommendation-card">
        <view class="city-image">🏯</view>
        <view class="recommendation-label">今日推荐</view>
        <view class="city-name">{{ dailyRecommendation.name }} {{ dailyRecommendation.emoji }}</view>
        <view class="city-info">
          <text>{{ dailyRecommendation.province }} | {{ dailyRecommendation.country }}</text>
        </view>
        <view class="city-tag">📍 {{ dailyRecommendation.tag }}</view>
        <view class="city-description">{{ dailyRecommendation.description }}</view>
        <view class="detail-button" @tap="handleViewDetail">
          <text>查看详情</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isFirstVisit = ref(true)
const countdown = ref(5)
const timer = ref<number | null>(null)

const dailyRecommendation = ref({
  name: '苏州',
  emoji: '🏮',
  province: '江苏省',
  country: '中国',
  tag: '东方威尼斯',
  description: '苏州，古称姑苏，是江南水乡的代表城市，以园林和水乡风光闻名于世。'
})

onLoad(() => {
  checkFirstVisit()
})

onMounted(() => {
  if (!isFirstVisit.value) {
    startCountdown()
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const checkFirstVisit = () => {
  const visited = uni.getStorageSync('has_visited')
  if (visited) {
    isFirstVisit.value = false
    setTimeout(() => {
      navigateToNext()
    }, 3000)
  } else {
    setTimeout(() => {
      uni.setStorageSync('has_visited', true)
      navigateToNext()
    }, 3000)
  }
}

const startCountdown = () => {
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer.value) {
        clearInterval(timer.value)
      }
      navigateToNext()
    }
  }, 1000)
}

const handleSkip = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  navigateToNext()
}

const handleViewDetail = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToNext = () => {
  if (userStore.isLoggedIn) {
    uni.reLaunch({ url: '/pages/home/index' })
  } else {
    uni.reLaunch({ url: '/pages/auth/index' })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.splash-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.brand-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.recommendation-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.skip-button {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  padding: $spacing-sm $spacing-md;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-md;
  color: #fff;
  font-size: $font-size-sm;
  backdrop-filter: blur(10rpx);
}

.recommendation-card {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.city-image {
  font-size: 120rpx;
  margin-bottom: $spacing-lg;
}

.recommendation-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.city-name {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.city-info {
  font-size: $font-size-md;
  color: $text-secondary;
  margin-bottom: $spacing-md;
}

.city-tag {
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  margin-bottom: $spacing-md;
}

.city-description {
  font-size: $font-size-md;
  color: $text-primary;
  text-align: center;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
}

.detail-button {
  width: 100%;
  padding: $spacing-md;
  background: $primary-color;
  color: #fff;
  border-radius: $radius-md;
  text-align: center;
  font-size: $font-size-md;
  font-weight: 500;
}
</style>
