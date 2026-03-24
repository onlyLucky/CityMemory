<template>
  <view class="home-page">
    <view class="user-info-section">
      <view class="user-basic">
        <image class="avatar" :src="userInfo?.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
        <view class="user-details">
          <text class="nickname">{{ userInfo?.nickname || '游客' }}</text>
          <view class="stats-row">
            <text class="stat-item">⭐ {{ userInfo?.totalStars || 0 }}</text>
            <text class="stat-item">🎯 关卡: {{ userInfo?.levelCount || 0 }}</text>
          </view>
        </view>
      </view>
      <view class="ticket-status">
        <view class="ticket-item">
          <text class="ticket-icon">🎫</text>
          <text class="ticket-text">闯关: {{ ticketStatus?.adventureTickets.current || 0 }}/{{ ticketStatus?.adventureTickets.max || 30 }}</text>
        </view>
        <view class="ticket-item">
          <text class="ticket-icon">🎲</text>
          <text class="ticket-text">随机: {{ ticketStatus?.randomTickets.current || 0 }}/{{ ticketStatus?.randomTickets.max || 3 }}</text>
        </view>
      </view>
    </view>

    <view class="level-progress-section">
      <view class="section-header">
        <text class="section-title">当前层级：第{{ currentLevel }}层</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
      <view class="unlocked-regions">
        <text class="region-label">已解锁区域：</text>
        <view class="region-tags">
          <text v-for="region in unlockedRegions" :key="region" class="region-tag">
            {{ region }}
          </text>
        </view>
      </view>
    </view>

    <view class="action-buttons-section">
      <view class="main-action-button" @tap="handleStartAdventure">
        <text class="button-icon">🎯</text>
        <text class="button-text">开始答题</text>
      </view>

      <view class="main-action-button" @tap="handleStartRandom">
        <text class="button-icon">🎲</text>
        <text class="button-text">随机模式</text>
      </view>
    </view>

    <view class="quick-access-section">
      <view class="quick-access-item" @tap="handleGoToShop">
        <text class="quick-icon">🏪</text>
        <text class="quick-text">商店</text>
      </view>
      <view class="quick-access-item" @tap="handleGoToRank">
        <text class="quick-icon">🏆</text>
        <text class="quick-text">排行榜</text>
      </view>
      <view class="quick-access-item" @tap="handleGoToProfile">
        <text class="quick-icon">👤</text>
        <text class="quick-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const ticketStatus = computed(() => userStore.ticketStatus)

const currentLevel = ref(3)
const progressPercent = ref(60)
const unlockedRegions = ref(['🌏亚洲', '🌍中东', '🌏欧洲'])

onMounted(async () => {
  await loadUserData()
})

const loadUserData = async () => {
  try {
    await userStore.getUserInfo()
    await userStore.getTicketStatus()
  } catch (error) {
    console.error('加载用户数据失败', error)
  }
}

const handleStartAdventure = () => {
  uni.navigateTo({ url: '/pages/level-map/index' })
}

const handleStartRandom = () => {
  uni.navigateTo({ url: '/pages/random-entry/index' })
}

const handleGoToShop = () => {
  uni.switchTab({ url: '/pages/shop/index' })
}

const handleGoToRank = () => {
  uni.switchTab({ url: '/pages/rank/index' })
}

const handleGoToProfile = () => {
  uni.switchTab({ url: '/pages/profile/index' })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.home-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  padding: $spacing-lg;
}

.user-info-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
  color: #fff;
}

.user-basic {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: $spacing-lg;
}

.user-details {
  flex: 1;
}

.nickname {
  font-size: $font-size-lg;
  font-weight: bold;
  margin-bottom: $spacing-sm;
  display: block;
}

.stats-row {
  display: flex;
  gap: $spacing-lg;
}

.stat-item {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.ticket-status {
  display: flex;
  gap: $spacing-lg;
}

.ticket-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  backdrop-filter: blur(10rpx);
}

.ticket-icon {
  font-size: 32rpx;
  margin-right: $spacing-xs;
}

.ticket-text {
  font-size: $font-size-sm;
}

.level-progress-section {
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: $spacing-lg;
}

.section-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
}

.progress-bar {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: $spacing-lg;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-color 0%, $primary-light 100%);
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

.unlocked-regions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.region-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-right: $spacing-sm;
}

.region-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.region-tag {
  padding: $spacing-xs $spacing-sm;
  background: rgba(46, 125, 50, 0.1);
  color: $primary-color;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
}

.action-buttons-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.main-action-button {
  height: 120rpx;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(46, 125, 50, 0.3);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(46, 125, 50, 0.3);
  }
}

.button-icon {
  font-size: 48rpx;
  margin-right: $spacing-md;
}

.button-text {
  font-size: $font-size-lg;
  font-weight: bold;
}

.quick-access-section {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.quick-access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.quick-icon {
  font-size: 48rpx;
}

.quick-text {
  font-size: $font-size-sm;
  color: $text-primary;
}
</style>
