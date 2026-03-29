<template>
  <view class="splash-page">
    <!-- 首次进入：显示品牌Logo + Slogan -->
    <template v-if="isFirstEnter">
      <view class="splash-content">
        <view class="logo-wrapper">
          <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
        </view>
        <text class="app-name">城迹</text>
        <text class="app-slogan">记录你探索世界的足迹</text>
      </view>
    </template>

    <!-- 非首次进入：显示每日推荐卡片 -->
    <template v-else>
      <!-- 跳过按钮 -->
      <view class="skip-btn" @tap="onSkip">
        <text class="skip-text">跳过 {{ countdown }}s</text>
      </view>

      <!-- 每日推荐卡片 -->
      <view class="recommend-card" v-if="recommendData">
        <view class="card-image-wrapper">
          <image
            class="card-image"
            :src="recommendData.question.question_image || '/static/images/default-city.png'"
            mode="aspectFill"
          />
          <view class="card-tag">今日推荐</view>
        </view>

        <view class="card-content">
          <view class="card-header">
            <text class="city-name">{{ getCityName() }}</text>
            <text class="city-location">{{ getLocation() }}</text>
          </view>

          <view class="card-desc">
            <text class="desc-icon">📍</text>
            <text class="desc-text">{{ recommendData.reason || '探索城市记忆' }}</text>
          </view>

          <view class="card-knowledge" v-if="recommendData.question.knowledge_point">
            <text class="knowledge-text">{{ recommendData.question.knowledge_point }}</text>
          </view>
        </view>

        <view class="card-footer">
          <button class="btn-detail" @tap="onViewDetail">
            <text class="btn-text">查看详情</text>
          </button>
        </view>
      </view>

      <!-- 加载中状态 -->
      <view class="loading-wrapper" v-else>
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storage } from '@/utils/storage'
import * as recommendApi from '@/api/recommend'
import type { DailyRecommend } from '@/types/question'

// ==========================================
// 常量定义
// ==========================================

/** 首次进入标识存储键 */
const FIRST_ENTER_KEY = 'first_enter'

/** 首次进入倒计时（毫秒） */
const FIRST_ENTER_DELAY = 3000

/** 非首次进入倒计时（秒） */
const RECOMMEND_COUNTDOWN = 5

// ==========================================
// 状态
// ==========================================

/** 是否首次进入 */
const isFirstEnter = ref(true)

/** 倒计时 */
const countdown = ref(RECOMMEND_COUNTDOWN)

/** 每日推荐数据 */
const recommendData = ref<DailyRecommend | null>(null)

/** 倒计时定时器 */
let countdownTimer: number | null = null

/** 自动跳转定时器 */
let autoJumpTimer: number | null = null

// ==========================================
// 方法
// ==========================================

/**
 * 检查是否首次进入
 */
const checkFirstEnter = () => {
  const hasEntered = storage.get<boolean>(FIRST_ENTER_KEY)
  isFirstEnter.value = !hasEntered
}

/**
 * 标记已进入
 */
const markEntered = () => {
  storage.set(FIRST_ENTER_KEY, true)
}

/**
 * 获取今日推荐
 */
const fetchTodayRecommend = async () => {
  try {
    const res = await recommendApi.getTodayRecommend()
    if (res.code === 0 && res.data) {
      recommendData.value = res.data
    }
  } catch (error) {
    console.error('获取今日推荐失败', error)
  }
}

/**
 * 从题目内容中提取城市名称
 */
const getCityName = (): string => {
  if (!recommendData.value) return ''

  const question = recommendData.value.question
  const content = question.question_content

  // 根据题目类型提取城市名称
  if (question.province) {
    return question.province
  }

  // 尝试从题目内容中提取
  const cityMatch = content.match(/(.+?)属于哪个省份/)
  if (cityMatch) {
    return cityMatch[1].trim()
  }

  return '未知城市'
}

/**
 * 获取位置信息
 */
const getLocation = (): string => {
  if (!recommendData.value) return ''

  const question = recommendData.value.question
  const parts: string[] = []

  if (question.province) {
    parts.push(question.province)
  }
  if (question.country) {
    parts.push(question.country)
  }

  return parts.length > 0 ? parts.join(' | ') : '中国'
}

/**
 * 开始倒计时
 */
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      navigateToHome()
    }
  }, 1000)
}

/**
 * 跳转到首页
 */
const navigateToHome = () => {
  clearTimers()
  uni.switchTab({ url: '/pages/home/index' })
}

/**
 * 跳转到授权页
 */
const navigateToAuth = () => {
  uni.redirectTo({ url: '/pages/auth/index' })
}

/**
 * 点击跳过
 */
const onSkip = () => {
  navigateToHome()
}

/**
 * 查看详情
 */
const onViewDetail = () => {
  // TODO: 跳转到推荐详情页
  navigateToHome()
}

/**
 * 清除定时器
 */
const clearTimers = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  if (autoJumpTimer) {
    clearTimeout(autoJumpTimer)
    autoJumpTimer = null
  }
}

// ==========================================
// 生命周期
// ==========================================

onMounted(async () => {
  checkFirstEnter()

  if (isFirstEnter.value) {
    // 首次进入：显示品牌Logo，3秒后跳转授权页
    markEntered()
    autoJumpTimer = setTimeout(() => {
      navigateToAuth()
    }, FIRST_ENTER_DELAY)
  } else {
    // 非首次进入：获取今日推荐，开始倒计时
    await fetchTodayRecommend()
    startCountdown()
  }
})

onUnmounted(() => {
  clearTimers()
})
</script>

<style lang="scss" scoped>
.splash-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(180deg, $color-primary 0%, $color-primary-light 100%);
  padding: $spacing-page-lg;
  padding-top: calc(200rpx + env(safe-area-inset-top));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

// ==========================================
// 首次进入样式
// ==========================================

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200rpx;
}

.logo-wrapper {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: $spacing-element-lg;
}

.logo {
  width: 100%;
  height: 100%;
}

.app-name {
  font-size: 56rpx;
  font-weight: $font-weight-bold;
  color: $color-text-white;
  margin-bottom: $spacing-text;
}

.app-slogan {
  font-size: $font-size-lg;
  color: rgba(255, 255, 255, 0.9);
}

// ==========================================
// 非首次进入样式
// ==========================================

.skip-btn {
  position: absolute;
  top: calc($spacing-page + env(safe-area-inset-top));
  right: $spacing-page;
  padding: $spacing-text-sm $spacing-element;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: $border-radius-xl;
}

.skip-text {
  font-size: $font-size-sm;
  color: $color-text-white;
}

.recommend-card {
  width: 100%;
  background-color: $color-bg-card;
  border-radius: $border-radius-xl;
  overflow: hidden;
  margin-top: 80rpx;
  box-shadow: $shadow-lg;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 400rpx;
}

.card-image {
  width: 100%;
  height: 100%;
}

.card-tag {
  position: absolute;
  top: $spacing-element;
  left: $spacing-element;
  padding: $spacing-text-sm $spacing-element;
  background-color: $color-primary;
  border-radius: $border-radius-base;
  font-size: $font-size-sm;
  color: $color-text-white;
}

.card-content {
  padding: $spacing-page;
}

.card-header {
  display: flex;
  align-items: baseline;
  margin-bottom: $spacing-element;
}

.city-name {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-right: $spacing-text;
}

.city-location {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.card-desc {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-element;
}

.desc-icon {
  font-size: $font-size-lg;
  margin-right: $spacing-text-sm;
}

.desc-text {
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.card-knowledge {
  padding: $spacing-element;
  background-color: $color-bg-page;
  border-radius: $border-radius-base;
}

.knowledge-text {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: $line-height-normal;
}

.card-footer {
  padding: $spacing-page;
  padding-top: 0;
}

.btn-detail {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-primary;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}

// ==========================================
// 加载状态样式
// ==========================================

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 200rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: $color-text-white;
  border-radius: $border-radius-round;
  animation: spin 0.8s linear infinite;
  margin-bottom: $spacing-element;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: $font-size-base;
  color: rgba(255, 255, 255, 0.8);
}
</style>
