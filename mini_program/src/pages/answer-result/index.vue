<template>
  <view class="answer-result-page">
    <view class="result-container">
      <view class="result-icon">{{ success ? '🎉' : '😢' }}</view>
      <view class="result-title">{{ success ? '闯关成功！' : '闯关失败' }}</view>

      <StarRating :stars="stars" :max="6" />

      <view class="stats-container">
        <view class="stat-item">
          <text class="stat-label">正确率</text>
          <text class="stat-value">{{ correctRate }}%</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均用时</text>
          <text class="stat-value">{{ averageTime }}秒</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">星级</text>
          <text class="stat-value">{{ stars }}星</text>
        </view>
      </view>

      <view v-if="success && unlockedLevel" class="unlock-message">
        <text class="unlock-icon">🎊</text>
        <text class="unlock-text">解锁新关卡: {{ unlockedLevel }}</text>
      </view>

      <view v-else class="encourage-message">
        <text class="encourage-icon">💡</text>
        <text class="encourage-text">再接再厉！</text>
      </view>
    </view>

    <view class="action-buttons">
      <button v-if="success" class="action-button primary" @tap="handleNextLevel">
        <text>下一关</text>
      </button>
      <button v-else class="action-button primary" @tap="handleRetry">
        <text>重新挑战</text>
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
import { ref, computed, onLoad } from '@dcloudio/uni-app'
import StarRating from '@/components/star-rating/index.vue'

const success = ref(true)
const stars = ref(0)
const correctRate = ref(0)
const averageTime = ref(0)
const unlockedLevel = ref('')

onLoad((options) => {
  success.value = options?.success === 'true'
  stars.value = parseFloat(options?.stars || '0')
  correctRate.value = parseFloat(options?.correctRate || '0')
  averageTime.value = parseFloat(options?.averageTime || '0')
  unlockedLevel.value = options?.unlockedLevel || ''
})

const handleNextLevel = () => {
  uni.redirectTo({ url: '/pages/level-map/index' })
}

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

.answer-result-page {
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

.unlock-message {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $radius-md;
  color: #fff;
  margin-bottom: $spacing-lg;
}

.unlock-icon {
  font-size: 40rpx;
}

.unlock-text {
  font-size: $font-size-md;
  font-weight: 500;
}

.encourage-message {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: rgba(255, 152, 0, 0.1);
  border-radius: $radius-md;
  color: $accent-color;
  margin-bottom: $spacing-lg;
}

.encourage-icon {
  font-size: 40rpx;
}

.encourage-text {
  font-size: $font-size-md;
  font-weight: 500;
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
