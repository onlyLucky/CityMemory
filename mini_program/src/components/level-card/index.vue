<template>
  <view
    class="level-card"
    :class="{
      'level-card--locked': !unlocked,
      'level-card--completed': isCompleted
    }"
    @click="handleClick"
  >
    <!-- 关卡图标 -->
    <view class="level-card__icon" :style="{ backgroundColor: iconBgColor }">
      <text v-if="unlocked" class="level-card__icon-text">{{ level.sort_order }}</text>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" class="level-card__lock-icon">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    </view>

    <!-- 关卡信息 -->
    <view class="level-card__content">
      <text class="level-card__name">{{ level.level_name }}</text>
      <text class="level-card__region">{{ level.region }}</text>

      <!-- 星级显示 -->
      <view v-if="unlocked && userProgress" class="level-card__stars">
        <star-rating
          :rating="userProgress.stars"
          size="small"
          :star-color="starColor"
        />
      </view>
    </view>

    <!-- 完成标记 -->
    <view v-if="isCompleted" class="level-card__badge">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Level, UserLevel } from '@/types/level'
import StarRating from '@/components/star-rating/index.vue'

/**
 * 关卡卡片组件
 * 显示关卡信息、星级和解锁状态
 */

interface Props {
  /** 关卡信息 */
  level: Level
  /** 是否解锁 */
  unlocked: boolean
  /** 用户关卡进度 */
  userProgress?: UserLevel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', level: Level): void
}>()

// 是否已完成
const isCompleted = computed(() => {
  return props.userProgress && props.userProgress.stars > 0
})

// 图标背景色
const iconBgColor = computed(() => {
  if (!props.unlocked) {
    return '#BDBDBD'
  }
  // 根据区域主题返回不同颜色
  const themeColors: Record<string, string> = {
    '亚洲': '#4CAF50',
    '中东': '#FF9800',
    '欧洲': '#03A9F4',
    '非洲': '#795548',
    '美洲': '#9C27B0'
  }
  return themeColors[props.level.region_theme] || '#2E7D32'
})

// 星星颜色
const starColor = computed(() => {
  return props.unlocked ? '#FFD700' : '#BDBDBD'
})

// 点击事件
const handleClick = () => {
  if (props.unlocked) {
    emit('click', props.level)
  }
}
</script>

<style lang="scss" scoped>
.level-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;

  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-base;
  }

  // 锁定状态
  &--locked {
    opacity: 0.6;
    background-color: $color-bg-page;

    .level-card__name,
    .level-card__region {
      color: $color-text-disabled;
    }
  }

  // 完成状态
  &--completed {
    border: 2rpx solid $color-primary;
  }

  &__icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__icon-text {
    font-size: $font-size-xxl;
    font-weight: $font-weight-bold;
    color: $color-text-white;
  }

  &__lock-icon {
    width: 40rpx;
    height: 40rpx;
    color: $color-text-white;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    min-width: 0;
  }

  &__name {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__region {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__stars {
    margin-top: 8rpx;
  }

  &__badge {
    position: absolute;
    top: 12rpx;
    right: 12rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: $color-success;
    border-radius: $border-radius-round;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24rpx;
      height: 24rpx;
      color: $color-text-white;
    }
  }
}
</style>
