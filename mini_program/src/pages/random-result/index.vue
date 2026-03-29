<template>
  <view class="random-result-page">
    <!-- 结果图标 -->
    <view class="result-header">
      <view class="result-icon">
        <text class="icon-emoji">&#127918;</text>
      </view>
      <text class="result-title">挑战结束！</text>
    </view>

    <!-- 统计数据卡片 -->
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">{{ correctCount }}</text>
        <text class="stats-label">答对题数</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <view class="coin-value">
          <text class="coin-icon">&#127941;</text>
          <text class="coin-number">{{ earnedCoins }}</text>
        </view>
        <text class="stats-label">获得金币</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <view class="star-value">
          <text class="star-icon">&#11088;</text>
          <text class="star-number">{{ earnedStars }}</text>
        </view>
        <text class="stats-label">获得星星</text>
      </view>
    </view>

    <!-- 当前资产 -->
    <view class="assets-section">
      <view class="assets-card">
        <text class="assets-title">当前资产</text>
        <view class="assets-list">
          <view class="asset-item">
            <text class="asset-icon">&#127941;</text>
            <text class="asset-name">金币</text>
            <text class="asset-value">{{ currentCoins }}</text>
          </view>
          <view class="asset-item">
            <text class="asset-icon">&#11088;</text>
            <text class="asset-name">星星</text>
            <text class="asset-value">{{ currentStars }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="result-footer">
      <button class="btn-retry" @tap="handleRetry">
        <text class="btn-text">再来一次</text>
      </button>
      <button class="btn-home" @tap="handleGoHome">
        <text class="btn-text">返回首页</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { Difficulty } from '@/constants/enums'

// ==========================================
// 类型定义
// ==========================================

interface GameResult {
  correctCount: number
  totalQuestions: number
  coinMultiplier: number
  difficulty: Difficulty
}

// ==========================================
// 状态
// ==========================================

const userStore = useUserStore()
const gameStore = useGameStore()

/** 游戏结果 */
const gameResult = ref<GameResult | null>(null)

/** 答对题数 */
const correctCount = ref(0)

/** 当前金币 */
const currentCoins = ref(0)

/** 当前星星 */
const currentStars = ref(0)

// ==========================================
// 计算属性
// ==========================================

/** 获得金币 = 答对数 x 难度系数 x 10 */
const earnedCoins = computed(() => {
  if (!gameResult.value) return 0
  return Math.floor(correctCount.value * gameResult.value.coinMultiplier * 10)
})

/** 获得星星 = 答对数 x 0.1 */
const earnedStars = computed(() => {
  return Math.floor(correctCount.value * 0.1)
})

// ==========================================
// 方法
// ==========================================

/**
 * 初始化页面数据
 */
const initPageData = () => {
  // 从存储获取游戏结果
  const result = uni.getStorageSync('random_result') as GameResult
  if (result) {
    gameResult.value = result
    correctCount.value = result.correctCount
  }

  // 获取用户资产
  if (userStore.userInfo) {
    currentCoins.value = userStore.userInfo.coins + earnedCoins.value
    currentStars.value = userStore.userInfo.total_stars + earnedStars.value
  }

  // 清理存储
  uni.removeStorageSync('random_challenge')
  uni.removeStorageSync('random_result')

  // 重置游戏状态
  gameStore.resetGame()
}

/**
 * 再来一次
 */
const handleRetry = () => {
  uni.redirectTo({ url: '/pages/random-entry/index' })
}

/**
 * 返回首页
 */
const handleGoHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  initPageData()
})
</script>

<style lang="scss" scoped>
.random-result-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  padding-top: calc($spacing-page-lg + env(safe-area-inset-top));
  padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
}

// 结果头部
.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-page-lg 0;
}

.result-icon {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-primary-light 0%, $color-primary 100%);
  border-radius: $border-radius-round;
  margin-bottom: $spacing-element;
  box-shadow: $shadow-lg;
}

.icon-emoji {
  font-size: 96rpx;
}

.result-title {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

// 统计数据卡片
.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 $spacing-page $spacing-page;
  padding: $spacing-page-lg $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-text-sm;
}

.stats-value {
  font-size: $font-size-xxxl;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.stats-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.stats-divider {
  width: 1rpx;
  height: 80rpx;
  background-color: $color-border-light;
}

.coin-value,
.star-value {
  display: flex;
  align-items: center;
  gap: $spacing-text-sm;
}

.coin-icon,
.star-icon {
  font-size: $font-size-xl;
}

.coin-number,
.star-number {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
}

.coin-number {
  color: $color-accent;
}

.star-number {
  color: $color-star;
}

// 当前资产
.assets-section {
  padding: 0 $spacing-page;
}

.assets-card {
  padding: $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
}

.assets-title {
  display: block;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  margin-bottom: $spacing-element;
}

.assets-list {
  display: flex;
  gap: $spacing-element;
}

.asset-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $spacing-text;
  padding: $spacing-element;
  background-color: $color-bg-page;
  border-radius: $border-radius-base;
}

.asset-icon {
  font-size: $font-size-lg;
}

.asset-name {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  flex: 1;
}

.asset-value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

// 底部操作
.result-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: $spacing-element;
  padding: $spacing-page;
  padding-bottom: calc($spacing-page + env(safe-area-inset-bottom));
  background-color: $color-bg-card;
  border-top: 1rpx solid $color-border-light;
}

.btn-retry,
.btn-home {
  flex: 1;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }
}

.btn-retry {
  background-color: $color-primary;
}

.btn-home {
  background-color: $color-bg-page;
  border: 2rpx solid $color-border;
}

.btn-home .btn-text {
  color: $color-text-primary;
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}
</style>
