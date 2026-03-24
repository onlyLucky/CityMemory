<template>
  <view class="health-bar">
    <view class="health-label">
      <text class="label-icon">❤️</text>
      <text class="label-text">血量</text>
    </view>
    <view class="health-bar-container">
      <view class="health-bar-fill" :style="{ width: healthPercent + '%' }">
        <view class="health-bar-inner"></view>
      </view>
    </view>
    <view class="health-value">
      <text>{{ currentHealth }}/{{ maxHealth }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentHealth: number
  maxHealth: number
}

const props = defineProps<Props>()

const healthPercent = computed(() => {
  return Math.max(0, (props.currentHealth / props.maxHealth) * 100)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.health-bar {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.health-label {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.label-icon {
  font-size: 32rpx;
}

.label-text {
  font-size: $font-size-sm;
  color: $text-primary;
  font-weight: 500;
}

.health-bar-container {
  flex: 1;
  height: 24rpx;
  background: #f0f0f0;
  border-radius: 12rpx;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b 0%, #ee5a5a 100%);
  border-radius: 12rpx;
  transition: width 0.3s ease;
}

.health-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
}

.health-value {
  font-size: $font-size-sm;
  color: $text-primary;
  font-weight: 500;
  min-width: 80rpx;
  text-align: right;
}
</style>
