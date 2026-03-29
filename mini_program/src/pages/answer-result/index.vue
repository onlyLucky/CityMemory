<template>
  <view class="answer-result-page">
    <!-- 结果头部 -->
    <view class="result-header">
      <!-- 结果图标 -->
      <view class="result-icon">
        <text class="icon-emoji">{{ isPassed ? '🎉' : '😢' }}</text>
      </view>

      <!-- 结果标题 -->
      <text class="result-title">{{ isPassed ? '恭喜过关！' : '再接再厉！' }}</text>
      <text class="result-desc">{{ resultDesc }}</text>

      <!-- 星级展示 -->
      <view class="star-container">
        <star-rating
          :rating="starResult.finalStars"
          size="large"
          :star-color="'#FFD700'"
        />
      </view>
    </view>

    <!-- 统计数据卡片 -->
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">{{ gameStore.accuracy }}%</text>
        <text class="stats-label">正确率</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <text class="stats-value">{{ gameStore.avgTime }}s</text>
        <text class="stats-label">平均用时</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <text class="stats-value">{{ starResult.finalStars }}</text>
        <text class="stats-label">星级</text>
      </view>
    </view>

    <!-- 解锁提示 -->
    <view v-if="isPassed && unlockedProvince" class="unlock-tip">
      <view class="unlock-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </view>
      <text class="unlock-text">解锁新关卡: {{ unlockedProvince }}</text>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <!-- 成功时显示 -->
      <template v-if="isPassed">
        <button class="action-btn action-btn--primary" @tap="handleNextLevel">
          <text class="btn-text">下一关</text>
        </button>
        <button class="action-btn action-btn--secondary" @tap="handleShare">
          <text class="btn-text">分享成绩</text>
        </button>
        <button class="action-btn action-btn--outline" @tap="handleGoHome">
          <text class="btn-text">返回首页</text>
        </button>
      </template>

      <!-- 失败时显示 -->
      <template v-else>
        <button class="action-btn action-btn--primary" @tap="handleRetry">
          <text class="btn-text">重新挑战</text>
        </button>
        <button class="action-btn action-btn--outline" @tap="handleGoHome">
          <text class="btn-text">返回首页</text>
        </button>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useGameStore } from '@/stores/game'
import StarRating from '@/components/star-rating/index.vue'
import { calculateStarsFromStats, type StarResult } from '@/utils/star-calculator'

/**
 * 答题结果页面
 * 显示答题结果、统计数据、星级评价和操作按钮
 */

// ==========================================
// Store
// ==========================================

const gameStore = useGameStore()

// ==========================================
// 计算属性
// ==========================================

/** 是否通过（正确率>=60%） */
const isPassed = computed(() => {
  return gameStore.accuracy >= 60
})

/** 结果描述 */
const resultDesc = computed(() => {
  if (isPassed.value) {
    return '你已成功通过本关卡'
  }
  return '继续努力，下次一定能通过'
})

/** 星级计算结果 */
const starResult = computed<StarResult>(() => {
  const correctCount = gameStore.answers.filter(a => a.isCorrect).length
  const totalCount = gameStore.answers.length
  const totalTime = gameStore.answers.reduce((sum, a) => sum + a.timeUsed, 0)

  return calculateStarsFromStats(correctCount, totalCount, totalTime)
})

/** 解锁的省份名称 */
const unlockedProvince = ref<string>('浙江省')

// ==========================================
// 方法
// ==========================================

/**
 * 下一关
 */
const handleNextLevel = () => {
  // 获取下一关卡ID
  const nextLevel = gameStore.currentLevel + 1

  // 重置游戏状态并开始新关卡
  gameStore.resetGame()

  // 跳转到答题页（实际应先获取新关卡题目）
  uni.redirectTo({
    url: `/pages/answer/index?level=${nextLevel}`
  })
}

/**
 * 重新挑战
 */
const handleRetry = () => {
  // 获取当前关卡ID
  const currentLevel = gameStore.currentLevel

  // 重置游戏状态
  gameStore.resetGame()

  // 跳转到答题页重新开始
  uni.redirectTo({
    url: `/pages/answer/index?level=${currentLevel}`
  })
}

/**
 * 返回首页
 */
const handleGoHome = () => {
  // 重置游戏状态
  gameStore.resetGame()

  // 跳转到首页
  uni.switchTab({ url: '/pages/home/index' })
}

/**
 * 分享成绩
 */
const handleShare = () => {
  // 生成分享内容
  const shareText = `我在城迹小程序获得了${starResult.value.finalStars}星评价！正确率${gameStore.accuracy}%，平均用时${gameStore.avgTime}秒`

  // 显示分享菜单
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })

  // 或者生成分享海报
  uni.showToast({
    title: '请点击右上角分享',
    icon: 'none'
  })
}

// ==========================================
// 页面分享配置
// ==========================================

// 定义页面分享
onShareAppMessage(() => {
  return {
    title: `我在城迹获得了${starResult.value.finalStars}星评价！`,
    path: '/pages/home/index',
    imageUrl: '' // 分享图片URL
  }
})

onShareTimeline(() => {
  return {
    title: `我在城迹获得了${starResult.value.finalStars}星评价！正确率${gameStore.accuracy}%`,
    query: ''
  }
})
</script>

<style lang="scss" scoped>
.answer-result-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-page-lg;
  padding-top: calc($spacing-page-lg + env(safe-area-inset-top));
  padding-bottom: calc($spacing-page-lg + env(safe-area-inset-bottom));
}

.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: $spacing-module;
}

.result-icon {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-element;
}

.icon-emoji {
  font-size: 120rpx;
}

.result-title {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-text;
}

.result-desc {
  font-size: $font-size-base;
  color: $color-text-secondary;
  margin-bottom: $spacing-element-lg;
}

.star-container {
  display: flex;
  justify-content: center;
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 600rpx;
  padding: $spacing-element-lg $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
  margin-bottom: $spacing-module;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-value {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: $spacing-text-sm;
}

.stats-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.stats-divider {
  width: 1rpx;
  height: 60rpx;
  background-color: $color-border-light;
}

.unlock-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-element $spacing-page;
  background-color: rgba($color-star, 0.1);
  border-radius: $border-radius-base;
  border: 1rpx solid rgba($color-star, 0.3);
  margin-bottom: $spacing-module;
}

.unlock-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: $spacing-text;

  svg {
    width: 100%;
    height: 100%;
    color: $color-star;
  }
}

.unlock-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-star-dark;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: $spacing-element;
  width: 100%;
  max-width: 600rpx;
  margin-top: auto;
}

.action-btn {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }

  &--primary {
    background-color: $color-primary;

    .btn-text {
      color: $color-text-white;
    }
  }

  &--secondary {
    background-color: $color-accent;

    .btn-text {
      color: $color-text-white;
    }
  }

  &--outline {
    background-color: transparent;
    border: 2rpx solid $color-primary;

    .btn-text {
      color: $color-primary;
    }
  }

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
}
</style>
