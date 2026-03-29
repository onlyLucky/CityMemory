<template>
  <view class="home-page">
    <!-- 顶部用户信息栏 -->
    <view class="user-header">
      <view class="user-info">
        <image
          class="user-avatar"
          :src="userInfo?.avatar || '/static/images/default-avatar.png'"
          mode="aspectFill"
        />
        <view class="user-detail">
          <text class="user-nickname">{{ userInfo?.nickname || '探索者' }}</text>
          <view class="user-stats">
            <view class="stat-item">
              <svg viewBox="0 0 24 24" fill="currentColor" class="stat-icon stat-icon--star">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <text class="stat-value">{{ userInfo?.total_stars || 0 }}</text>
              <text class="stat-label">星星</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <svg viewBox="0 0 24 24" fill="currentColor" class="stat-icon stat-icon--level">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
              </svg>
              <text class="stat-value">{{ userInfo?.level_count || 0 }}</text>
              <text class="stat-label">关卡</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 门票显示 -->
    <view class="ticket-section">
      <ticket-display
        :adventure-tickets="adventureTickets"
        :random-tickets="randomTickets"
        :max-adventure-tickets="30"
        :adventure-recover-seconds="adventureRecoverSeconds"
        :random-reset-seconds="randomResetSeconds"
      />
    </view>

    <!-- 层级进度 -->
    <view class="level-progress-section">
      <view class="section-header">
        <text class="section-title">当前进度</text>
        <text class="section-level">第{{ currentLevel }}层</text>
      </view>
      <view class="progress-container">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: levelProgressPercent + '%' }"></view>
        </view>
        <text class="progress-text">{{ levelProgressText }}</text>
      </view>
    </view>

    <!-- 区域主题展示 -->
    <view class="region-section">
      <view class="section-header">
        <text class="section-title">已解锁区域</text>
        <text class="section-more" @tap="onNavigateToLevelMap">查看全部</text>
      </view>
      <scroll-view class="region-scroll" scroll-x>
        <view class="region-list">
          <view
            v-for="region in unlockedRegions"
            :key="region.theme"
            class="region-card"
            :style="{ backgroundColor: region.color }"
            @tap="onRegionTap(region)"
          >
            <text class="region-name">{{ region.name }}</text>
            <text class="region-progress">{{ region.completed }}/{{ region.total }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 核心入口 -->
    <view class="action-section">
      <button class="btn-start" @tap="onNavigateToLevelMap">
        <text class="btn-text">开始答题</text>
      </button>
      <button class="btn-random" @tap="onNavigateToRandom">
        <text class="btn-text">随机模式</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import TicketDisplay from '@/components/ticket-display/index.vue'
import { RegionTheme } from '@/constants/enums'

// ==========================================
// 状态
// ==========================================

const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 门票数据（模拟）
const adventureTickets = ref(28)
const randomTickets = ref(2)
const adventureRecoverSeconds = ref(300) // 5分钟后恢复
const randomResetSeconds = ref(3600) // 1小时后重置

// 当前层级（模拟）
const currentLevel = ref(3)
const levelProgressPercent = ref(65)
const levelProgressText = computed(() => `${levelProgressPercent.value}% 已解锁`)

// 已解锁区域
const unlockedRegions = ref([
  { theme: RegionTheme.ASIA, name: '亚洲', color: '#4CAF50', completed: 12, total: 15 },
  { theme: RegionTheme.MIDDLE_EAST, name: '中东', color: '#FF9800', completed: 5, total: 10 },
  { theme: RegionTheme.EUROPE, name: '欧洲', color: '#03A9F4', completed: 3, total: 12 }
])

// ==========================================
// 方法
// ==========================================

/**
 * 跳转到关卡地图页
 */
const onNavigateToLevelMap = () => {
  uni.navigateTo({ url: '/pages/level-map/index' })
}

/**
 * 跳转到随机模式入口页
 */
const onNavigateToRandom = () => {
  uni.navigateTo({ url: '/pages/random-entry/index' })
}

/**
 * 点击区域卡片
 */
const onRegionTap = (region: { theme: RegionTheme; name: string }) => {
  uni.navigateTo({
    url: `/pages/level-map/index?region=${encodeURIComponent(region.theme)}`
  })
}

// ==========================================
// 生命周期
// ==========================================

onMounted(async () => {
  // 获取用户信息
  if (userStore.isLoggedIn) {
    await userStore.getUserInfo()
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

// 用户信息栏
.user-header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  padding: $spacing-page-lg $spacing-page;
  padding-top: calc($spacing-page-lg + env(safe-area-inset-top));
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: $border-radius-round;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: $spacing-element;
}

.user-detail {
  flex: 1;
}

.user-nickname {
  display: block;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-white;
  margin-bottom: $spacing-text;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: $spacing-element;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-text-sm;
}

.stat-icon {
  width: 32rpx;
  height: 32rpx;

  &--star {
    color: $color-star;
  }

  &--level {
    color: rgba(255, 255, 255, 0.9);
  }
}

.stat-value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

.stat-label {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1rpx;
  height: 32rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

// 门票显示
.ticket-section {
  margin: $spacing-page;
  padding: $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  margin-top: -$spacing-element;
}

// 层级进度
.level-progress-section {
  margin: 0 $spacing-page $spacing-page;
  padding: $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-element;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.section-level {
  font-size: $font-size-sm;
  color: $color-primary;
  font-weight: $font-weight-medium;
}

.section-more {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: $spacing-text;
}

.progress-bar {
  flex: 1;
  height: 20rpx;
  background-color: $color-border-light;
  border-radius: 10rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-primary 0%, $color-primary-light 100%);
  border-radius: 10rpx;
  transition: width $transition-base;
}

.progress-text {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  white-space: nowrap;
}

// 区域主题展示
.region-section {
  margin: 0 $spacing-page $spacing-page;
}

.region-scroll {
  white-space: nowrap;
}

.region-list {
  display: inline-flex;
  gap: $spacing-element;
  padding: $spacing-text-sm 0;
}

.region-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180rpx;
  height: 160rpx;
  border-radius: $border-radius-lg;
  padding: $spacing-element;
  box-shadow: $shadow-sm;
  transition: transform $transition-base;

  &:active {
    transform: scale(0.95);
  }
}

.region-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-white;
  margin-bottom: $spacing-text-sm;
}

.region-progress {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.9);
}

// 核心入口
.action-section {
  margin: $spacing-page-lg $spacing-page;
  display: flex;
  flex-direction: column;
  gap: $spacing-element;
}

.btn-start {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  border-radius: $border-radius-lg;
  border: none;
  box-shadow: $shadow-base;
  transition: all $transition-base;

  &::after {
    display: none;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-sm;
  }
}

.btn-random {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-light 100%);
  border-radius: $border-radius-lg;
  border: none;
  box-shadow: $shadow-sm;
  transition: all $transition-base;

  &::after {
    display: none;
  }

  &:active {
    transform: scale(0.98);
  }
}

.btn-text {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}
</style>
