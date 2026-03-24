<template>
  <view class="random-result-page">
    <view class="result-container">
      <view class="result-icon">{{ blood > 0 ? '🎉' : '😢' }}</view>
      <view class="result-title">{{ blood > 0 ? '挑战完成！' : '挑战失败' }}</view>

      <view class="stats-container">
        <view class="stat-item">
          <text class="stat-label">得分</text>
          <text class="stat-value">{{ score }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">获得星星</text>
          <text class="stat-value">{{ stars }}⭐</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">剩余血量</text>
          <text class="stat-value">{{ blood }}❤️</text>
        </view>
      </view>

      <view class="rewards-section">
        <view class="reward-title">获得奖励</view>
        <view class="reward-item">
          <text class="reward-icon">⭐</text>
          <text class="reward-value">+{{ stars }} 星星</text>
        </view>
        <view class="reward-item">
          <text class="reward-icon">💰</text>
          <text class="reward-value">+{{ Math.floor(score * 1.5) }} 金币</text>
        </view>
      </view>
    </view>

    <view class="action-buttons">
      <button class="action-button primary" @tap="handleRetry">
        <text>再次挑战</text>
      </button>
      <button class="action-button secondary" @tap="handleShare">
        <text>分享成绩</text>
      </button>
      <button class="action-button outline" @tap="handleBackHome">
        <text>返回首页</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onLoad } from '@dcloudio/uni-app'

const score = ref(0)
const stars = ref(0)
const blood = ref(0)

onLoad((options) => {
  score.value = parseInt(options?.score || '0')
  stars.value = parseInt(options?.stars || '0')
  blood.value = parseInt(options?.blood || '0')
})

const handleRetry = () => {
  uni.navigateBack()
}

const handleShare = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

const handleBackHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.random-result-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.result-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.result-icon {
  font-size: 160rpx;
  margin-bottom: $spacing-lg;
}

.result-title {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

.stats-container {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-lg;
  background: #fff;
  border-radius: $radius-md;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  min-width: 160rpx;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.stat-value {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $primary-color;
}

.rewards-section {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.reward-title {
  font-size: $font-size-md;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  text-align: center;
}

.reward-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: rgba(46, 125, 50, 0.05);
  border-radius: $radius-md;
  margin-bottom: $spacing-md;

  &:last-child {
    margin-bottom: 0;
  }
}

.reward-icon {
  font-size: 40rpx;
}

.reward-value {
  font-size: $font-size-md;
  font-weight: 500;
  color: $primary-color;
}

.action-buttons {
  padding: $spacing-lg;
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.action-button {
  width: 100%;
  height: 96rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;

  &.primary {
    background: $primary-color;
    color: #fff;

    &:active {
      background: $primary-light;
    }
  }

  &.secondary {
    background: $primary-light;
    color: #fff;

    &:active {
      background: $primary-color;
    }
  }

  &.outline {
    background: transparent;
    border: 2rpx solid $primary-color;
    color: $primary-color;

    &:active {
      background: rgba(46, 125, 50, 0.05);
    }
  }
}
</style>
