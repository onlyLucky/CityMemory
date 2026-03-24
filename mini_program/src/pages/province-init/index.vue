<template>
  <view class="province-init-page">
    <view class="page-header">
      <text class="page-title">选择您的起点</text>
    </view>

    <view class="content-container">
      <view class="auto-location-section">
        <button class="auto-location-button" @tap="handleAutoLocation">
          <text class="button-icon">📍</text>
          <text class="button-text">自动定位</text>
        </button>
      </view>

      <view class="divider">
        <text class="divider-text">— 或 —</text>
      </view>

      <view class="manual-section">
        <text class="section-title">手动选择省份</text>
        <view class="province-grid">
          <view
            v-for="province in provinces"
            :key="province"
            class="province-item"
            :class="{ selected: selectedProvince === province }"
            @tap="handleSelectProvince(province)"
          >
            <text class="province-text">{{ province }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-section">
      <button class="confirm-button" :disabled="!selectedProvince" @tap="handleConfirm">
        <text>确认选择</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { PROVINCES } from '@/constants/config'

const userStore = useUserStore()

const provinces = ref(PROVINCES)
const selectedProvince = ref('')
const loading = ref(false)

const handleAutoLocation = async () => {
  loading.value = true
  
  try {
    const location = await uni.getLocation({
      type: 'wgs84'
    })

    uni.showToast({
      title: '定位成功',
      icon: 'success'
    })

    selectedProvince.value = '江苏省'
  } catch (error) {
    uni.showToast({
      title: '定位失败，请手动选择',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const handleSelectProvince = (province: string) => {
  selectedProvince.value = province
}

const handleConfirm = async () => {
  if (!selectedProvince.value) {
    uni.showToast({
      title: '请选择省份',
      icon: 'none'
    })
    return
  }

  loading.value = true

  try {
    await userStore.initProvince(selectedProvince.value, 'select')

    uni.showToast({
      title: `已选择${selectedProvince.value}`,
      icon: 'success'
    })

    setTimeout(() => {
      uni.redirectTo({ url: '/pages/home/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '初始化失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.province-init-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: $spacing-xl $spacing-lg;
  background: $primary-color;
  color: #fff;
}

.page-title {
  font-size: $font-size-lg;
  font-weight: bold;
}

.content-container {
  flex: 1;
  padding: $spacing-xl $spacing-lg;
}

.auto-location-section {
  margin-bottom: $spacing-xl;
}

.auto-location-button {
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
  box-shadow: 0 4rpx 12rpx rgba(46, 125, 50, 0.3);

  &:active {
    background: $primary-light;
  }
}

.button-icon {
  font-size: 40rpx;
  margin-right: $spacing-sm;
}

.button-text {
  font-size: $font-size-md;
}

.divider {
  text-align: center;
  margin: $spacing-xl 0;
}

.divider-text {
  color: $text-secondary;
  font-size: $font-size-sm;
}

.manual-section {
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: $font-size-md;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: $spacing-lg;
}

.province-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.province-item {
  padding: $spacing-md;
  background: #fff;
  border-radius: $radius-md;
  text-align: center;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;

  &.selected {
    border-color: $primary-color;
    background: rgba(46, 125, 50, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.province-text {
  font-size: $font-size-sm;
  color: $text-primary;
}

.footer-section {
  padding: $spacing-lg;
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.confirm-button {
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

  &[disabled] {
    background: $text-secondary;
    opacity: 0.5;
  }

  &:not([disabled]):active {
    background: $primary-light;
  }
}
</style>
