<template>
  <view class="ticket-display">
    <view class="ticket-item">
      <view class="ticket-icon">🎫</view>
      <view class="ticket-info">
        <text class="ticket-label">闯关门票</text>
        <text class="ticket-value">{{ adventureTickets.current }}/{{ adventureTickets.max }}</text>
      </view>
      <view v-if="adventureTickets.nextRecoverIn > 0" class="ticket-timer">
        <text>{{ formatTime(adventureTickets.nextRecoverIn) }}</text>
      </view>
    </view>

    <view class="ticket-item">
      <view class="ticket-icon">🎲</view>
      <view class="ticket-info">
        <text class="ticket-label">随机门票</text>
        <text class="ticket-value">{{ randomTickets.current }}/{{ randomTickets.max }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { TicketStatus } from '@/types'

interface Props {
  ticketStatus: TicketStatus
}

const props = defineProps<Props>()

const timer = ref<number | null>(null)

const adventureTickets = computed(() => props.ticketStatus.adventureTickets)
const randomTickets = computed(() => props.ticketStatus.randomTickets)

onMounted(() => {
  if (adventureTickets.value.nextRecoverIn > 0) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const startTimer = () => {
  timer.value = setInterval(() => {
    if (adventureTickets.value.nextRecoverIn > 0) {
      adventureTickets.value.nextRecoverIn--
    } else {
      if (timer.value) {
        clearInterval(timer.value)
      }
    }
  }, 1000)
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ticket-display {
  display: flex;
  gap: $spacing-md;
}

.ticket-item {
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: $radius-md;
  padding: $spacing-md;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.ticket-icon {
  font-size: 40rpx;
  margin-right: $spacing-sm;
}

.ticket-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.ticket-label {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.ticket-value {
  font-size: $font-size-md;
  color: $text-primary;
  font-weight: 500;
}

.ticket-timer {
  padding: 4rpx $spacing-sm;
  background: rgba(46, 125, 50, 0.1);
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  color: $primary-color;
  font-weight: 500;
}
</style>
