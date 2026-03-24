<template>
  <view class="random-entry-page">
    <view class="page-header">
      <view class="back-button" @tap="handleBack">
        <text>←</text>
      </view>
      <view class="header-title">随机模式</view>
      <view class="ticket-status">今日: {{ dailyCount }}/3</view>
    </view>

    <view class="content-container">
      <view class="section-title">选择你的挑战：</view>

      <view class="options-grid">
        <view
          v-for="option in randomOptions"
          :key="option.id"
          class="option-card"
          :class="{ selected: selectedOption === option.id }"
          @tap="handleSelectOption(option.id)"
        >
          <view class="option-icon">{{ option.icon }}</view>
          <view class="option-title">{{ option.title }}</view>
          <view class="option-description">{{ option.description }}</view>
          <view class="option-reward">{{ option.reward }}</view>
        </view>
      </view>
    </view>

    <view class="footer-section">
      <button class="start-button" :disabled="!selectedOption" @tap="handleStart">
        <text>开始挑战</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const dailyCount = ref(2)
const selectedOption = ref('')

const randomOptions = ref([
  {
    id: 'simple',
    icon: '🎯',
    title: '简单题目',
    description: '适合新手',
    reward: '10题 | 金币×1.0'
  },
  {
    id: 'medium',
    icon: '🎯',
    title: '中等题目',
    description: '适合有经验用户',
    reward: '15题 | 金币×1.5'
  },
  {
    id: 'hard',
    icon: '🎯',
    title: '困难题目',
    description: '适合高手挑战',
    reward: '20题 | 金币×2.0'
  },
  {
    id: 'shop',
    icon: '🏪',
    title: '商店',
    description: '购买道具',
    reward: '使用金币购买'
  },
  {
    id: 'blood-pool',
    icon: '❤️',
    title: '血池',
    description: '增加初始血量',
    reward: '初始血量+3'
  }
])

onMounted(async () => {
  await loadTicketStatus()
})

const loadTicketStatus = async () => {
  try {
    const status = await userStore.getTicketStatus()
    dailyCount.value = status.randomTickets.current
  } catch (error) {
    console.error('加载门票状态失败', error)
  }
}

const handleBack = () => {
  uni.navigateBack()
}

const handleSelectOption = (optionId: string) => {
  selectedOption.value = optionId
}

const handleStart = () => {
  if (!selectedOption.value) {
    uni.showToast({
      title: '请选择挑战',
      icon: 'none'
    })
    return
  }

  if (dailyCount.value <= 0) {
    uni.showToast({
      title: '今日次数已用完',
      icon: 'none'
    })
    return
  }

  if (selectedOption.value === 'shop') {
    uni.navigateTo({ url: '/pages/shop/index' })
  } else {
    uni.navigateTo({ url: `/pages/random-answer/index?type=${selectedOption.value}` })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.random-entry-page {
  width: 100%;
  height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  background: $primary-color;
  color: #fff;
}

.back-button {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: $font-size-lg;
  font-weight: bold;
}

.header-title {
  font-size: $font-size-lg;
  font-weight: bold;
}

.ticket-status {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.content-container {
  flex: 1;
  padding: $spacing-xl;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-xl;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
}

.option-card {
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 2rpx solid transparent;
  transition: all 0.3s ease;

  &.selected {
    border-color: $primary-color;
    background: rgba(46, 125, 50, 0.05);
    box-shadow: 0 4rpx 16rpx rgba(46, 125, 50, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
}

.option-icon {
  font-size: 80rpx;
  margin-bottom: $spacing-md;
}

.option-title {
  font-size: $font-size-md;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.option-description {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.option-reward {
  padding: $spacing-xs $spacing-sm;
  background: rgba(46, 125, 50, 0.1);
  color: $primary-color;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  font-weight: 500;
}

.footer-section {
  padding: $spacing-lg;
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.start-button {
  width: 100%;
  height: 96rpx;
  background: $primary-color;
  color: #fff;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  font-weight: 500;
  border: none;

  &[disabled] {
    background: $text-secondary;
    opacity: 0.5;
  }

  &:not([disabled]):active {
    background: $primary-light;
  }
}
</style>
