<template>
  <view class="star-rating">
    <view
      v-for="(star, index) in stars"
      :key="index"
      class="star-rating__star"
      :class="[`star-rating__star--${size}`]"
    >
      <!-- 满星 -->
      <view
        v-if="star === 1"
        class="star-rating__icon star-rating__icon--full"
        :style="{ color: starColor }"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </view>
      <!-- 半星 -->
      <view
        v-else-if="star === 0.5"
        class="star-rating__icon star-rating__icon--half"
      >
        <svg viewBox="0 0 24 24" class="star-rating__svg-bg">
          <path fill="#E0E0E0" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg viewBox="0 0 24 24" class="star-rating__svg-fill" :style="{ color: starColor }">
          <defs>
            <linearGradient :id="`half-star-${uid}`">
              <stop offset="50%" :stop-color="starColor" />
              <stop offset="50%" stop-color="#E0E0E0" />
            </linearGradient>
          </defs>
          <path :fill="`url(#half-star-${uid})`" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </view>
      <!-- 空星 -->
      <view
        v-else
        class="star-rating__icon star-rating__icon--empty"
      >
        <svg viewBox="0 0 24 24" fill="#E0E0E0">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * 星级评分组件
 * 支持半星显示，支持不同尺寸
 */

interface Props {
  /** 星级 (0.5-6) */
  rating: number
  /** 大小: small, medium, large */
  size?: 'small' | 'medium' | 'large'
  /** 星星颜色 */
  starColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  rating: 0,
  size: 'medium',
  starColor: '#FFD700'
})

// 生成唯一ID用于渐变
const uid = ref(`star-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)

// 计算星星数组
const stars = computed(() => {
  const result: number[] = []
  const maxStars = 6
  let remaining = Math.min(Math.max(props.rating, 0), maxStars)

  for (let i = 0; i < maxStars; i++) {
    if (remaining >= 1) {
      result.push(1)
      remaining -= 1
    } else if (remaining >= 0.5) {
      result.push(0.5)
      remaining -= 0.5
    } else {
      result.push(0)
    }
  }

  return result
})
</script>

<style lang="scss" scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 4rpx;

  &__star {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform $transition-base;

    &:active {
      transform: scale(1.1);
    }

    // 尺寸变体
    &--small {
      width: 24rpx;
      height: 24rpx;
    }

    &--medium {
      width: 32rpx;
      height: 32rpx;
    }

    &--large {
      width: 48rpx;
      height: 48rpx;
    }
  }

  &__icon {
    width: 100%;
    height: 100%;
    position: relative;

    svg {
      width: 100%;
      height: 100%;
    }

    &--full {
      animation: star-pulse 0.3s ease-out;
    }

    &--half {
      position: relative;
    }

    &--empty {
      opacity: 0.5;
    }
  }

  &__svg-bg {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__svg-fill {
    position: absolute;
    top: 0;
    left: 0;
  }
}

// 星星动画
@keyframes star-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
