<template>
  <view class="star-rating">
    <view
      v-for="index in 6"
      :key="index"
      class="star-item"
      :class="{ active: index <= displayStars, half: isHalfStar(index) }"
    >
      <text class="star-icon">{{ getStarIcon(index) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  stars: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  max: 6
})

const displayStars = computed(() => {
  return Math.min(props.stars, props.max)
})

const isHalfStar = (index: number) => {
  const diff = props.stars - index
  return diff > 0 && diff < 0.5
}

const getStarIcon = (index: number) => {
  if (index <= displayStars.value) {
    return '⭐'
  }
  return '☆'
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.star-rating {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.star-item {
  font-size: 48rpx;
  transition: all 0.3s ease;

  &.active {
    color: $star-color;
  }

  &.half {
    color: $star-color;
    opacity: 0.5;
  }
}

.star-icon {
  font-size: inherit;
}
</style>
