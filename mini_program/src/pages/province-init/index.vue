<template>
  <view class="province-init-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="header-title">选择您的起点</text>
      <text class="header-desc">我们将为您推荐该省份的城市题目</text>
    </view>

    <!-- 自动定位按钮 -->
    <view class="location-section">
      <button
        class="btn-location"
        :loading="isLocating"
        :disabled="isLocating"
        @tap="onAutoLocation"
      >
        <text class="location-icon">📍</text>
        <text class="location-text">{{ isLocating ? '定位中...' : '自动定位' }}</text>
      </button>
    </view>

    <!-- 分割线 -->
    <view class="divider">
      <view class="divider-line"></view>
      <text class="divider-text">或</text>
      <view class="divider-line"></view>
    </view>

    <!-- 省份列表（网格布局，4列） -->
    <view class="province-section">
      <text class="section-title">手动选择省份</text>
      <scroll-view class="province-grid" scroll-y>
        <view class="grid-container">
          <view
            class="province-item"
            v-for="province in provinces"
            :key="province.id"
            :class="{ active: selectedProvince === province.name }"
            @tap="onSelectProvince(province.name)"
          >
            <text class="province-name">{{ province.shortName }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部确认按钮 -->
    <view class="page-footer">
      <button
        class="btn-confirm"
        :loading="isConfirming"
        :disabled="!selectedProvince || isConfirming"
        @tap="onConfirm"
      >
        <text class="btn-text">确认选择</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

// ==========================================
// Store
// ==========================================

const userStore = useUserStore()

// ==========================================
// 类型定义
// ==========================================

interface Province {
  id: number
  name: string
  shortName: string
}

// ==========================================
// 省份数据
// ==========================================

const provinces = ref<Province[]>([
  { id: 1, name: '北京市', shortName: '北京' },
  { id: 2, name: '天津市', shortName: '天津' },
  { id: 3, name: '河北省', shortName: '河北' },
  { id: 4, name: '山西省', shortName: '山西' },
  { id: 5, name: '内蒙古自治区', shortName: '内蒙古' },
  { id: 6, name: '辽宁省', shortName: '辽宁' },
  { id: 7, name: '吉林省', shortName: '吉林' },
  { id: 8, name: '黑龙江省', shortName: '黑龙江' },
  { id: 9, name: '上海市', shortName: '上海' },
  { id: 10, name: '江苏省', shortName: '江苏' },
  { id: 11, name: '浙江省', shortName: '浙江' },
  { id: 12, name: '安徽省', shortName: '安徽' },
  { id: 13, name: '福建省', shortName: '福建' },
  { id: 14, name: '江西省', shortName: '江西' },
  { id: 15, name: '山东省', shortName: '山东' },
  { id: 16, name: '河南省', shortName: '河南' },
  { id: 17, name: '湖北省', shortName: '湖北' },
  { id: 18, name: '湖南省', shortName: '湖南' },
  { id: 19, name: '广东省', shortName: '广东' },
  { id: 20, name: '广西壮族自治区', shortName: '广西' },
  { id: 21, name: '海南省', shortName: '海南' },
  { id: 22, name: '重庆市', shortName: '重庆' },
  { id: 23, name: '四川省', shortName: '四川' },
  { id: 24, name: '贵州省', shortName: '贵州' },
  { id: 25, name: '云南省', shortName: '云南' },
  { id: 26, name: '西藏自治区', shortName: '西藏' },
  { id: 27, name: '陕西省', shortName: '陕西' },
  { id: 28, name: '甘肃省', shortName: '甘肃' },
  { id: 29, name: '青海省', shortName: '青海' },
  { id: 30, name: '宁夏回族自治区', shortName: '宁夏' },
  { id: 31, name: '新疆维吾尔自治区', shortName: '新疆' },
  { id: 32, name: '台湾省', shortName: '台湾' },
  { id: 33, name: '香港特别行政区', shortName: '香港' },
  { id: 34, name: '澳门特别行政区', shortName: '澳门' }
])

// ==========================================
// 状态
// ==========================================

/** 选中的省份 */
const selectedProvince = ref<string | null>(null)

/** 定位中状态 */
const isLocating = ref(false)

/** 确认中状态 */
const isConfirming = ref(false)

// ==========================================
// 方法
// ==========================================

/**
 * 自动定位
 */
const onAutoLocation = async () => {
  if (isLocating.value) return

  isLocating.value = true

  try {
    // 1. 获取位置信息
    const locationRes = await new Promise<UniApp.GetLocationSuccess>((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02', // 国测局坐标系
        success: resolve,
        fail: reject
      })
    })

    // 2. 逆地理编码获取省份
    // 注意：微信小程序需要使用腾讯地图API进行逆地理编码
    // 这里简化处理，直接根据坐标判断省份
    const province = await getProvinceByLocation(locationRes.latitude, locationRes.longitude)

    if (province) {
      // 3. 自动选中省份
      selectedProvince.value = province

      uni.showToast({
        title: `定位成功：${province}`,
        icon: 'success'
      })

      // 4. 自动确认并跳转
      setTimeout(() => {
        confirmAndNavigate(province, 'location')
      }, 1000)
    } else {
      uni.showToast({
        title: '定位失败，请手动选择',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('定位失败', error)
    uni.showToast({
      title: '定位失败，请手动选择',
      icon: 'none'
    })
  } finally {
    isLocating.value = false
  }
}

/**
 * 根据坐标获取省份（简化版）
 * 实际项目中应使用腾讯地图API进行逆地理编码
 */
const getProvinceByLocation = async (latitude: number, longitude: number): Promise<string | null> => {
  // TODO: 调用腾讯地图逆地理编码API
  // 这里返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟返回广东省
      resolve('广东省')
    }, 500)
  })
}

/**
 * 选择省份
 */
const onSelectProvince = (name: string) => {
  selectedProvince.value = name
}

/**
 * 确认选择
 */
const onConfirm = async () => {
  if (!selectedProvince.value || isConfirming.value) return

  await confirmAndNavigate(selectedProvince.value, 'select')
}

/**
 * 确认并跳转
 */
const confirmAndNavigate = async (province: string, method: 'select' | 'location') => {
  isConfirming.value = true

  try {
    // 调用 userApi.initProvince
    const success = await userStore.initProvince(province, method)

    if (success) {
      uni.showToast({
        title: `已选择${province}`,
        icon: 'success'
      })

      // 跳转到首页
      setTimeout(() => {
        uni.switchTab({ url: '/pages/home/index' })
      }, 500)
    } else {
      uni.showToast({
        title: '设置失败，请重试',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('初始化省份失败', error)
    uni.showToast({
      title: '设置失败，请重试',
      icon: 'none'
    })
  } finally {
    isConfirming.value = false
  }
}
</script>

<style lang="scss" scoped>
.province-init-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $color-bg-page;
}

// ==========================================
// 页面标题
// ==========================================

.page-header {
  padding: $spacing-page;
  padding-top: calc($spacing-page + env(safe-area-inset-top));
  background-color: $color-bg-card;
}

.header-title {
  display: block;
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-text-sm;
}

.header-desc {
  display: block;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// ==========================================
// 自动定位
// ==========================================

.location-section {
  padding: $spacing-page;
  background-color: $color-bg-card;
}

.btn-location {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-primary-light;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }

  &[disabled] {
    background-color: $color-text-disabled;
  }
}

.location-icon {
  font-size: $font-size-xl;
  margin-right: $spacing-text;
}

.location-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}

// ==========================================
// 分割线
// ==========================================

.divider {
  display: flex;
  align-items: center;
  padding: $spacing-page;
  background-color: $color-bg-card;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: $color-border;
}

.divider-text {
  padding: 0 $spacing-element;
  font-size: $font-size-sm;
  color: $color-text-placeholder;
}

// ==========================================
// 省份列表
// ==========================================

.province-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: $spacing-page;
  background-color: $color-bg-card;
  margin-top: $spacing-element-sm;
}

.section-title {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  margin-bottom: $spacing-element;
}

.province-grid {
  flex: 1;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-element-sm;
}

.province-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  background-color: $color-bg-page;
  border-radius: $border-radius-base;
  border: 2rpx solid transparent;
  transition: all $transition-base;

  &.active {
    background-color: rgba($color-primary, 0.1);
    border-color: $color-primary;
  }
}

.province-name {
  font-size: $font-size-sm;
  color: $color-text-primary;
}

.province-item.active .province-name {
  color: $color-primary;
  font-weight: $font-weight-medium;
}

// ==========================================
// 底部确认按钮
// ==========================================

.page-footer {
  padding: $spacing-page;
  padding-bottom: calc($spacing-page + env(safe-area-inset-bottom));
  background-color: $color-bg-card;
  border-top: 1rpx solid $color-border-light;
}

.btn-confirm {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-primary;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }

  &[disabled] {
    background-color: $color-text-disabled;
  }
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}
</style>
