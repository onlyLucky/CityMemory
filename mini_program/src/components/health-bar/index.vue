<template>
  <view class="health-bar">
    <view
      v-for="index in maxHealth"
      :key="index"
      class="health-bar__heart"
      :class="[
        `health-bar__heart--${size}`,
        { 'health-bar__heart--empty': index > health },
        { 'health-bar__heart--damage': isDamaging && index === health + 1 },
        { 'health-bar__heart--heal': isHealing && index === health }
      ]"
    >
      <!-- 满心 -->
      <svg v-if="index <= health" viewBox="0 0 24 24" fill="currentColor" class="health-bar__icon health-bar__icon--full">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <!-- 空心 -->
      <svg v-else viewBox="0 0 24 24" fill="currentColor" class="health-bar__icon health-bar__icon--empty">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * 血量条组件
 * 使用心形图标显示血量，支持扣血和回血动画
 */

interface Props {
  /** 当前血量 */
  health: number
  /** 最大血量 */
  maxHealth?: number
  /** 大小: small, medium, large */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  health: 10,
  maxHealth: 10,
  size: 'medium'
})

// 动画状态
const isDamaging = ref(false)
const isHealing = ref(false)
const previousHealth = ref(props.health)

// 监听血量变化
watch(() => props.health, (newVal, oldVal) => {
  if (newVal < oldVal) {
    // 扣血动画
    isDamaging.value = true
    setTimeout(() => {
      isDamaging.value = false
    }, 500)
  } else if (newVal > oldVal) {
    // 回血动画
    isHealing.value = true
    setTimeout(() => {
      isHealing.value = false
    }, 500)
  }
  previousHealth.value = newVal
})
</script>

<style lang="scss" scoped>
.health-bar {
  display: flex;
  align-items: center;
  gap: 8rpx;

  &__heart {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform $transition-base;

    // 尺寸变体
    &--small {
      width: 28rpx;
      height: 28rpx;
    }

    &--medium {
      width: 36rpx;
      height: 36rpx;
    }

    &--large {
      width: 48rpx;
      height: 48rpx;
    }

    // 空心状态
    &--empty {
      opacity: 0.4;
    }

    // 扣血动画
    &--damage {
      animation: heart-damage 0.5s ease-out;
    }

    // 回血动画
    &--heal {
      animation: heart-heal 0.5s ease-out;
    }
  }

  &__icon {
    width: 100%;
    height: 100%;

    &--full {
      color: $color-error;
      filter: drop-shadow(0 2rpx 4rpx rgba($color-error, 0.3));
    }

    &--empty {
      color: $color-text-disabled;
    }
  }
}

// 扣血动画 - 闪烁
@keyframes heart-damage {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  25% {
    transform: scale(1.3);
    opacity: 0.5;
  }
  50% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  75% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

// 回血动画 - 闪烁
@keyframes heart-heal {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.2);
    filter: brightness(1.3);
  }
  50% {
    transform: scale(1);
    filter: brightness(1.5);
  }
  75% {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}
</style>
