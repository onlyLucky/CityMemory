<template>
  <view class="level-map-page">
    <!-- 顶部导航栏 -->
    <nav-bar title="关卡地图" :show-back="true" />

    <!-- 层级指示器 -->
    <view class="level-indicator">
      <view class="level-indicator__content">
        <text class="level-indicator__text">当前层级</text>
        <view class="level-indicator__badge">
          <text class="level-indicator__number">{{ currentLevel }}</text>
        </view>
      </view>
      <view class="level-indicator__progress">
        <view class="level-indicator__bar">
          <view class="level-indicator__fill" :style="{ width: levelProgress + '%' }"></view>
        </view>
        <text class="level-indicator__label">{{ completedLevels }}/{{ totalLevels }} 关卡</text>
      </view>
    </view>

    <!-- 区域主题切换Tab -->
    <scroll-view class="region-tabs" scroll-x>
      <view class="region-tabs__list">
        <view
          v-for="region in regions"
          :key="region.theme"
          class="region-tabs__item"
          :class="{ 'region-tabs__item--active': activeRegion === region.theme }"
          :style="activeRegion === region.theme ? { backgroundColor: region.color, borderColor: region.color } : {}"
          @tap="onRegionChange(region.theme)"
        >
          <text
            class="region-tabs__text"
            :class="{ 'region-tabs__text--active': activeRegion === region.theme }"
          >
            {{ region.name }}
          </text>
        </view>
      </view>
    </scroll-view>

    <!-- 关卡列表 -->
    <scroll-view class="level-list-container" scroll-y>
      <view class="level-list">
        <view
          v-for="level in filteredLevels"
          :key="level.level_id"
          class="level-item"
        >
          <level-card
            :level="level"
            :unlocked="isLevelUnlocked(level)"
            :user-progress="getUserProgress(level.level_id)"
            @click="onLevelClick"
          />
        </view>

        <!-- 空状态 -->
        <view v-if="filteredLevels.length === 0" class="empty-state">
          <text class="empty-state__text">暂无关卡</text>
        </view>
      </view>
    </scroll-view>

    <!-- 关卡详情弹窗 -->
    <view
      v-if="showDetailPopup"
      class="popup-mask"
      @tap="onCloseDetailPopup"
    >
      <view class="popup-container" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">{{ selectedLevel?.level_name }}</text>
          <view class="popup-close" @tap="onCloseDetailPopup">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </view>
        </view>

        <view class="popup-content">
          <!-- 关卡信息 -->
          <view class="level-info">
            <text class="level-info__region">{{ selectedLevel?.region }}</text>
            <text class="level-info__desc">{{ selectedLevel?.description }}</text>
          </view>

          <!-- 星级显示 -->
          <view class="level-stars">
            <text class="level-stars__label">获得星级</text>
            <star-rating
              :rating="getUserProgress(selectedLevel?.level_id || 0)?.stars || 0"
              size="large"
              star-color="#FFD700"
            />
          </view>

          <!-- 题目数量 -->
          <view class="level-meta">
            <view class="level-meta__item">
              <text class="level-meta__value">{{ selectedLevel?.question_count || 0 }}</text>
              <text class="level-meta__label">题目数量</text>
            </view>
            <view class="level-meta__item">
              <text class="level-meta__value">{{ getDifficultyText(selectedLevel?.difficulty) }}</text>
              <text class="level-meta__label">难度等级</text>
            </view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="popup-actions">
          <button class="btn-start" @tap="onStartLevel">
            <text class="btn-start__text">开始答题</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 门票不足提示弹窗 -->
    <view
      v-if="showTicketPopup"
      class="popup-mask"
      @tap="onCloseTicketPopup"
    >
      <view class="popup-container popup-container--small" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">门票不足</text>
        </view>

        <view class="popup-content">
          <view class="ticket-warning">
            <svg viewBox="0 0 24 24" fill="currentColor" class="ticket-warning__icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <text class="ticket-warning__text">
              您的闯关门票不足，请等待恢复或前往商店购买
            </text>
            <view class="ticket-warning__count">
              <text class="ticket-warning__label">当前门票：</text>
              <text class="ticket-warning__value">{{ adventureTickets }}/{{ maxAdventureTickets }}</text>
            </view>
          </view>
        </view>

        <view class="popup-actions">
          <button class="btn-cancel" @tap="onCloseTicketPopup">
            <text class="btn-cancel__text">取消</text>
          </button>
          <button class="btn-shop" @tap="onNavigateToShop">
            <text class="btn-shop__text">前往商店</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import NavBar from '@/components/nav-bar/index.vue'
import LevelCard from '@/components/level-card/index.vue'
import StarRating from '@/components/star-rating/index.vue'
import { getLevelList } from '@/api/level'
import { RegionTheme, LevelStatus, Difficulty } from '@/constants/enums'
import type { Level, UserLevel } from '@/types/level'

// ==========================================
// 类型定义
// ==========================================

interface RegionItem {
  theme: RegionTheme
  name: string
  color: string
}

// ==========================================
// 状态
// ==========================================

const userStore = useUserStore()

// 区域列表
const regions: RegionItem[] = [
  { theme: RegionTheme.ASIA, name: '亚洲', color: '#4CAF50' },
  { theme: RegionTheme.MIDDLE_EAST, name: '中东', color: '#FF9800' },
  { theme: RegionTheme.EUROPE, name: '欧洲', color: '#03A9F4' },
  { theme: RegionTheme.AFRICA, name: '非洲', color: '#795548' },
  { theme: RegionTheme.AMERICAS, name: '美洲', color: '#9C27B0' }
]

// 当前选中的区域
const activeRegion = ref<RegionTheme>(RegionTheme.ASIA)

// 层级数据
const currentLevel = ref(3)
const levelProgress = ref(65)
const completedLevels = ref(8)
const totalLevels = ref(15)

// 关卡列表
const levelList = ref<Level[]>([])
const userProgressMap = ref<Map<number, UserLevel>>(new Map())

// 门票数据
const adventureTickets = ref(28)
const maxAdventureTickets = ref(30)

// 弹窗状态
const showDetailPopup = ref(false)
const showTicketPopup = ref(false)
const selectedLevel = ref<Level | null>(null)

// ==========================================
// 计算属性
// ==========================================

/**
 * 根据当前选中区域过滤关卡
 */
const filteredLevels = computed(() => {
  return levelList.value.filter(level => level.region_theme === activeRegion.value)
})

// ==========================================
// 方法
// ==========================================

/**
 * 判断关卡是否解锁
 */
const isLevelUnlocked = (level: Level): boolean => {
  return level.status !== LevelStatus.LOCKED
}

/**
 * 获取用户关卡进度
 */
const getUserProgress = (levelId: number): UserLevel | undefined => {
  return userProgressMap.value.get(levelId)
}

/**
 * 获取难度文本
 */
const getDifficultyText = (difficulty?: Difficulty): string => {
  switch (difficulty) {
    case Difficulty.EASY:
      return '简单'
    case Difficulty.NORMAL:
      return '普通'
    case Difficulty.HARD:
      return '困难'
    default:
      return '未知'
  }
}

/**
 * 切换区域
 */
const onRegionChange = (region: RegionTheme) => {
  activeRegion.value = region
}

/**
 * 点击关卡卡片
 */
const onLevelClick = (level: Level) => {
  if (!isLevelUnlocked(level)) {
    uni.showToast({ title: '关卡未解锁', icon: 'none' })
    return
  }
  selectedLevel.value = level
  showDetailPopup.value = true
}

/**
 * 关闭详情弹窗
 */
const onCloseDetailPopup = () => {
  showDetailPopup.value = false
  selectedLevel.value = null
}

/**
 * 关闭门票不足弹窗
 */
const onCloseTicketPopup = () => {
  showTicketPopup.value = false
}

/**
 * 开始闯关
 */
const onStartLevel = () => {
  if (!selectedLevel.value) return

  // 检查门票
  if (adventureTickets.value <= 0) {
    showDetailPopup.value = false
    showTicketPopup.value = true
    return
  }

  // 跳转答题页
  uni.navigateTo({
    url: `/pages/answer/index?levelId=${selectedLevel.value.level_id}`
  })
  showDetailPopup.value = false
}

/**
 * 前往商店
 */
const onNavigateToShop = () => {
  showTicketPopup.value = false
  uni.navigateTo({ url: '/pages/shop/index' })
}

/**
 * 加载关卡数据
 */
const loadLevelData = async () => {
  try {
    const res = await getLevelList()
    if (res.code === 0 && res.data) {
      levelList.value = res.data.list
    }
  } catch (error) {
    console.error('加载关卡数据失败', error)
  }
}

// ==========================================
// 生命周期
// ==========================================

onLoad((options) => {
  // 从URL参数获取区域
  if (options?.region) {
    activeRegion.value = decodeURIComponent(options.region) as RegionTheme
  }
})

onMounted(() => {
  loadLevelData()
})
</script>

<style lang="scss" scoped>
.level-map-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  display: flex;
  flex-direction: column;
}

// 层级指示器
.level-indicator {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  padding: $spacing-page;
  padding-top: calc(88rpx + $spacing-page + env(safe-area-inset-top));
}

.level-indicator__content {
  display: flex;
  align-items: center;
  gap: $spacing-text;
  margin-bottom: $spacing-element;
}

.level-indicator__text {
  font-size: $font-size-base;
  color: rgba(255, 255, 255, 0.9);
}

.level-indicator__badge {
  width: 48rpx;
  height: 48rpx;
  background-color: $color-star;
  border-radius: $border-radius-round;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-indicator__number {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.level-indicator__progress {
  display: flex;
  align-items: center;
  gap: $spacing-text;
}

.level-indicator__bar {
  flex: 1;
  height: 16rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  overflow: hidden;
}

.level-indicator__fill {
  height: 100%;
  background-color: $color-text-white;
  border-radius: 8rpx;
  transition: width $transition-base;
}

.level-indicator__label {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

// 区域主题切换Tab
.region-tabs {
  background-color: $color-bg-card;
  white-space: nowrap;
  border-bottom: 1rpx solid $color-border-light;
}

.region-tabs__list {
  display: inline-flex;
  padding: $spacing-element $spacing-page;
  gap: $spacing-text;
}

.region-tabs__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-text $spacing-element;
  border-radius: $border-radius-xl;
  border: 2rpx solid $color-border;
  background-color: transparent;
  transition: all $transition-base;
}

.region-tabs__item--active {
  border-color: $color-primary;
}

.region-tabs__text {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  white-space: nowrap;
}

.region-tabs__text--active {
  color: $color-text-white;
  font-weight: $font-weight-medium;
}

// 关卡列表
.level-list-container {
  flex: 1;
  height: 0;
}

.level-list {
  padding: $spacing-page;
  display: flex;
  flex-direction: column;
  gap: $spacing-element;
}

// 空状态
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-module-lg;
}

.empty-state__text {
  font-size: $font-size-base;
  color: $color-text-placeholder;
}

// 弹窗遮罩
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-bg-mask;
  z-index: $z-index-modal-backdrop;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.popup-container {
  width: 100%;
  background-color: $color-bg-card;
  border-radius: $border-radius-xl $border-radius-xl 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  animation: slide-up 0.3s ease;
}

.popup-container--small {
  max-width: 600rpx;
  border-radius: $border-radius-xl;
  margin: auto;
  margin-bottom: 50%;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-page;
  border-bottom: 1rpx solid $color-border-light;
}

.popup-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.popup-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-round;

  svg {
    width: 32rpx;
    height: 32rpx;
    color: $color-text-secondary;
  }

  &:active {
    background-color: $color-bg-page;
  }
}

.popup-content {
  padding: $spacing-page;
}

// 关卡信息
.level-info {
  margin-bottom: $spacing-element;
}

.level-info__region {
  display: block;
  font-size: $font-size-sm;
  color: $color-primary;
  margin-bottom: $spacing-text-sm;
}

.level-info__desc {
  font-size: $font-size-base;
  color: $color-text-secondary;
  line-height: $line-height-normal;
}

// 星级显示
.level-stars {
  display: flex;
  align-items: center;
  gap: $spacing-element;
  margin-bottom: $spacing-element;
  padding: $spacing-element;
  background-color: $color-bg-page;
  border-radius: $border-radius-base;
}

.level-stars__label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// 关卡元信息
.level-meta {
  display: flex;
  gap: $spacing-element;
}

.level-meta__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-element;
  background-color: $color-bg-page;
  border-radius: $border-radius-base;
}

.level-meta__value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-text-sm;
}

.level-meta__label {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

// 弹窗操作按钮
.popup-actions {
  padding: $spacing-page;
  padding-top: 0;
  display: flex;
  gap: $spacing-element;
}

.btn-start {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }
}

.btn-start__text {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

// 门票不足提示
.ticket-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-element;
}

.ticket-warning__icon {
  width: 80rpx;
  height: 80rpx;
  color: $color-warning;
  margin-bottom: $spacing-element;
}

.ticket-warning__text {
  font-size: $font-size-base;
  color: $color-text-secondary;
  text-align: center;
  line-height: $line-height-normal;
  margin-bottom: $spacing-element;
}

.ticket-warning__count {
  display: flex;
  align-items: center;
  gap: $spacing-text-sm;
}

.ticket-warning__label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.ticket-warning__value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.btn-cancel {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-page;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }
}

.btn-cancel__text {
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.btn-shop {
  flex: 1;
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

.btn-shop__text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}
</style>
