<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-header">
      <view class="user-card">
        <image
          class="user-avatar"
          :src="userInfo?.avatar || '/static/images/default-avatar.png'"
          mode="aspectFill"
        />
        <text class="user-name">{{ userInfo?.nickname || '探索者' }}</text>
        <view class="user-stats">
          <view class="stat-item">
            <text class="stat-icon">&#11088;</text>
            <text class="stat-value">{{ userInfo?.total_stars || 0 }}</text>
            <text class="stat-label">星星</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-icon">&#127919;</text>
            <text class="stat-value">{{ userInfo?.level_count || 0 }}</text>
            <text class="stat-label">关卡</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">{{ stats.totalQuestions }}</text>
        <text class="stats-label">答题数</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <text class="stats-value">{{ stats.accuracy }}%</text>
        <text class="stats-label">正确率</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <text class="stats-value">{{ stats.rank }}</text>
        <text class="stats-label">排名</text>
      </view>
    </view>

    <!-- 功能入口列表 -->
    <view class="menu-section">
      <view class="menu-list">
        <view class="menu-item" @tap="onNavigateToSettings">
          <text class="menu-icon">&#9881;</text>
          <text class="menu-text">设置</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @tap="onFeedback">
          <text class="menu-icon">&#128172;</text>
          <text class="menu-text">意见反馈</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @tap="onAbout">
          <text class="menu-icon">&#8505;</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @tap="onViewProtocol('user')">
          <text class="menu-icon">&#128196;</text>
          <text class="menu-text">用户协议</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @tap="onViewProtocol('privacy')">
          <text class="menu-icon">&#128274;</text>
          <text class="menu-text">隐私政策</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// ==========================================
// 状态
// ==========================================

const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 数据统计
const stats = ref({
  totalQuestions: 128,
  accuracy: 85,
  rank: 156
})

// ==========================================
// 方法
// ==========================================

/**
 * 跳转到设置页
 */
const onNavigateToSettings = () => {
  uni.navigateTo({ url: '/pages/settings/index' })
}

/**
 * 意见反馈
 */
const onFeedback = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

/**
 * 关于我们
 */
const onAbout = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

/**
 * 查看协议
 * @param type 协议类型
 */
const onViewProtocol = (type: string) => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
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
.profile-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

// 用户信息卡片
.user-header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  padding: $spacing-page-lg $spacing-page;
  padding-top: calc($spacing-page-lg + env(safe-area-inset-top));
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-page 0;
}

.user-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: $border-radius-round;
  border: 6rpx solid rgba(255, 255, 255, 0.4);
  margin-bottom: $spacing-element;
}

.user-name {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-text-white;
  margin-bottom: $spacing-element;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: $spacing-element-lg;
  padding: $spacing-element $spacing-page;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: $border-radius-xl;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-text-sm;
}

.stat-icon {
  font-size: 32rpx;
}

.stat-value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

.stat-label {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1rpx;
  height: 40rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

// 数据统计
.stats-card {
  display: flex;
  align-items: center;
  margin: $spacing-page;
  padding: $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  margin-top: -$spacing-element-lg;
  box-shadow: $shadow-base;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  height: 64rpx;
  background-color: $color-border;
}

// 功能入口列表
.menu-section {
  margin: $spacing-page;
}

.menu-list {
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: $spacing-page;
  border-bottom: 1rpx solid $color-border-light;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: $color-bg-page;
  }
}

.menu-icon {
  font-size: 40rpx;
  margin-right: $spacing-element;
}

.menu-text {
  flex: 1;
  font-size: $font-size-base;
  color: $color-text-primary;
}

.menu-arrow {
  font-size: $font-size-base;
  color: $color-text-placeholder;
}
</style>
