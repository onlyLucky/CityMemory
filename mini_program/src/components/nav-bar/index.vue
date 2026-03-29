<template>
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-bar__content">
      <!-- 左侧返回按钮 -->
      <view v-if="showBack" class="nav-bar__left" @click="handleBack">
        <svg viewBox="0 0 24 24" fill="currentColor" class="nav-bar__back-icon">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </view>

      <!-- 标题 -->
      <view class="nav-bar__title">
        <text class="nav-bar__title-text">{{ title }}</text>
      </view>

      <!-- 右侧插槽 -->
      <view class="nav-bar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * 导航栏组件
 * 自定义导航栏，支持返回按钮和右侧插槽
 */

interface Props {
  /** 标题 */
  title: string
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回路径 */
  backUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  backUrl: ''
})

const emit = defineEmits<{
  (e: 'back'): void
}>()

// 状态栏高度
const statusBarHeight = ref(0)

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

// 处理返回
const handleBack = () => {
  emit('back')

  if (props.backUrl) {
    uni.navigateTo({
      url: props.backUrl
    })
  } else {
    // 默认返回上一页
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      // 如果没有上一页，跳转到首页
      uni.switchTab({
        url: '/pages/home/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-index-fixed;
  background-color: $color-primary;

  &__content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $spacing-page;
    position: relative;
  }

  &__left {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -16rpx;
    border-radius: $border-radius-round;
    transition: background-color $transition-fast;

    &:active {
      background-color: rgba($color-text-white, 0.2);
    }
  }

  &__back-icon {
    width: 40rpx;
    height: 40rpx;
    color: $color-text-white;
  }

  &__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 60%;
  }

  &__title-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-text-white;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__right {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: -16rpx;
  }
}
</style>
