<template>
  <view class="settings-page">
    <view class="settings-section">
      <view class="section-title">账号设置</view>
      
      <view class="settings-item" @tap="handleChangeProvince">
        <view class="item-left">
          <text class="item-icon">📍</text>
          <text class="item-text">所在省份</text>
        </view>
        <view class="item-right">
          <text class="item-value">{{ userInfo?.province || '未设置' }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view class="settings-item" @tap="handleChangeNickname">
        <view class="item-left">
          <text class="item-icon">👤</text>
          <text class="item-text">昵称</text>
        </view>
        <view class="item-right">
          <text class="item-value">{{ userInfo?.nickname || '未设置' }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view class="settings-item" @tap="handleChangeAvatar">
        <view class="item-left">
          <text class="item-icon">🖼️</text>
          <text class="item-text">头像</text>
        </view>
        <view class="item-right">
          <image class="item-avatar" :src="userInfo?.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
          <text class="item-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="settings-section">
      <view class="section-title">通知设置</view>
      
      <view class="settings-item">
        <view class="item-left">
          <text class="item-icon">🔔</text>
          <text class="item-text">答题提醒</text>
        </view>
        <view class="item-right">
          <switch :checked="notificationSettings.answerReminder" @change="handleAnswerReminderChange" color="#2E7D32" />
        </view>
      </view>

      <view class="settings-item">
        <view class="item-left">
          <text class="item-icon">🎫</text>
          <text class="item-text">门票恢复提醒</text>
        </view>
        <view class="item-right">
          <switch :checked="notificationSettings.ticketRecovery" @change="handleTicketRecoveryChange" color="#2E7D32" />
        </view>
      </view>
    </view>

    <view class="settings-section">
      <view class="section-title">其他</view>
      
      <view class="settings-item" @tap="handleClearCache">
        <view class="item-left">
          <text class="item-icon">🗑️</text>
          <text class="item-text">清除缓存</text>
        </view>
        <view class="item-right">
          <text class="item-value">{{ cacheSize }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view class="settings-item" @tap="handleCheckUpdate">
        <view class="item-left">
          <text class="item-icon">🔄</text>
          <text class="item-text">检查更新</text>
        </view>
        <view class="item-right">
          <text class="item-value">v1.0.0</text>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view class="settings-item" @tap="handleGoToPrivacy">
        <view class="item-left">
          <text class="item-icon">🔒</text>
          <text class="item-text">隐私政策</text>
        </view>
        <view class="item-right">
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view class="settings-item" @tap="handleGoToAgreement">
        <view class="item-left">
          <text class="item-icon">📄</text>
          <text class="item-text">用户协议</text>
        </view>
        <view class="item-right">
          <text class="item-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const cacheSize = ref('12.5 MB')

const notificationSettings = ref({
  answerReminder: true,
  ticketRecovery: true
})

onMounted(async () => {
  await loadUserData()
})

const loadUserData = async () => {
  try {
    await userStore.getUserInfo()
  } catch (error) {
    console.error('加载用户数据失败', error)
  }
}

const handleChangeProvince = () => {
  uni.showToast({
    title: '修改省份功能开发中',
    icon: 'none'
  })
}

const handleChangeNickname = () => {
  uni.showToast({
    title: '修改昵称功能开发中',
    icon: 'none'
  })
}

const handleChangeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.showToast({
        title: '头像上传功能开发中',
        icon: 'none'
      })
    }
  })
}

const handleAnswerReminderChange = (e: any) => {
  notificationSettings.value.answerReminder = e.detail.value
  uni.showToast({
    title: e.detail.value ? '已开启答题提醒' : '已关闭答题提醒',
    icon: 'success'
  })
}

const handleTicketRecoveryChange = (e: any) => {
  notificationSettings.value.ticketRecovery = e.detail.value
  uni.showToast({
    title: e.detail.value ? '已开启门票恢复提醒' : '已关闭门票恢复提醒',
    icon: 'success'
  })
}

const handleClearCache = () => {
  uni.showModal({
    title: '确认清除',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        cacheSize.value = '0 MB'
        uni.showToast({
          title: '缓存已清除',
          icon: 'success'
        })
      }
    }
  })
}

const handleCheckUpdate = () => {
  uni.showToast({
    title: '已是最新版本',
    icon: 'success'
  })
}

const handleGoToPrivacy = () => {
  uni.showToast({
    title: '隐私政策',
    icon: 'none'
  })
}

const handleGoToAgreement = () => {
  uni.showToast({
    title: '用户协议',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.settings-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  padding: $spacing-lg;
}

.settings-section {
  background: #fff;
  border-radius: $radius-lg;
  margin-bottom: $spacing-lg;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  padding: $spacing-lg $spacing-lg $spacing-md;
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: 500;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: $background-color;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.item-icon {
  font-size: 40rpx;
}

.item-text {
  font-size: $font-size-md;
  color: $text-primary;
}

.item-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.item-value {
  font-size: $font-size-md;
  color: $text-secondary;
}

.item-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.item-arrow {
  font-size: 40rpx;
  color: $text-secondary;
}
</style>
