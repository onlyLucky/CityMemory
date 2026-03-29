<template>
  <view class="ticket-display">
    <!-- 闯关门票 -->
    <view class="ticket-display__item">
      <view class="ticket-display__icon ticket-display__icon--adventure">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
        </svg>
      </view>
      <view class="ticket-display__content">
        <text class="ticket-display__label">闯关门票</text>
        <view class="ticket-display__value">
          <text class="ticket-display__number">{{ adventureTickets }}</text>
          <text v-if="adventureTickets < maxAdventureTickets" class="ticket-display__time">
            {{ adventureRecoverTime }}
          </text>
        </view>
      </view>
    </view>

    <!-- 随机门票 -->
    <view class="ticket-display__item">
      <view class="ticket-display__icon ticket-display__icon--random">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"/>
        </svg>
      </view>
      <view class="ticket-display__content">
        <text class="ticket-display__label">随机门票</text>
        <view class="ticket-display__value">
          <text class="ticket-display__number">{{ randomTickets }}</text>
          <text v-if="randomResetTime" class="ticket-display__time">
            {{ randomResetTime }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

/**
 * 门票显示组件
 * 显示闯关门票和随机门票数量及恢复时间
 */

interface Props {
  /** 闯关门票数量 */
  adventureTickets: number
  /** 随机门票数量 */
  randomTickets: number
  /** 最大闯关门票数量 */
  maxAdventureTickets?: number
  /** 闯关门票恢复时间（秒） */
  adventureRecoverSeconds?: number
  /** 随机门票重置时间（秒） */
  randomResetSeconds?: number
}

const props = withDefaults(defineProps<Props>(), {
  adventureTickets: 0,
  randomTickets: 0,
  maxAdventureTickets: 5,
  adventureRecoverSeconds: 0,
  randomResetSeconds: 0
})

// 倒计时状态
const adventureCountdown = ref(props.adventureRecoverSeconds)
const randomCountdown = ref(props.randomResetSeconds)
let timer: number | null = null

// 格式化闯关门票恢复时间
const adventureRecoverTime = computed(() => {
  if (adventureCountdown.value <= 0) return ''
  const minutes = Math.floor(adventureCountdown.value / 60)
  const seconds = adventureCountdown.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 格式化随机门票重置时间
const randomResetTime = computed(() => {
  if (randomCountdown.value <= 0) return ''
  const hours = Math.floor(randomCountdown.value / 3600)
  const minutes = Math.floor((randomCountdown.value % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes}分`
  }
  return `${minutes}分钟`
})

// 启动倒计时
const startTimer = () => {
  timer = setInterval(() => {
    if (adventureCountdown.value > 0) {
      adventureCountdown.value--
    }
    if (randomCountdown.value > 0) {
      randomCountdown.value--
    }
  }, 1000) as unknown as number
}

onMounted(() => {
  adventureCountdown.value = props.adventureRecoverSeconds
  randomCountdown.value = props.randomResetSeconds
  startTimer()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.ticket-display {
  display: flex;
  align-items: center;
  gap: 32rpx;

  &__item {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  &__icon {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius-sm;
    padding: 8rpx;

    svg {
      width: 100%;
      height: 100%;
    }

    &--adventure {
      background-color: rgba($color-primary, 0.1);
      color: $color-primary;
    }

    &--random {
      background-color: rgba($color-accent, 0.1);
      color: $color-accent;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  &__label {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }

  &__value {
    display: flex;
    align-items: baseline;
    gap: 8rpx;
  }

  &__number {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__time {
    font-size: $font-size-xs;
    color: $color-text-placeholder;
  }
}
</style>
