<template>
  <view class="level-map-page">
    <view class="page-header">
      <view class="back-button" @tap="handleBack">
        <text>←</text>
      </view>
      <view class="header-title">关卡地图</view>
      <view class="level-indicator">第{{ currentLevel }}层</view>
    </view>

    <view class="region-tabs">
      <view
        v-for="region in regions"
        :key="region.id"
        class="region-tab"
        :class="{ active: selectedRegion === region.id }"
        @tap="handleSelectRegion(region.id)"
      >
        <text>{{ region.name }}</text>
      </view>
    </view>

    <scroll-view class="level-list" scroll-y>
      <view class="level-grid">
        <view
          v-for="level in filteredLevels"
          :key="level.id"
          class="level-card"
          :class="{
            'unlocked': level.isUnlocked,
            'completed': level.isCompleted,
            'locked': !level.isUnlocked
          }"
          @tap="handleLevelTap(level)"
        >
          <view class="level-header">
            <text class="level-name">{{ level.levelName }}</text>
            <StarRating v-if="level.userStars > 0" :stars="level.userStars" :max="5" />
          </view>

          <view class="level-status">
            <text v-if="level.isCompleted" class="status-text completed">已通关</text>
            <text v-else-if="level.isUnlocked" class="status-text unlocked">可挑战</text>
            <text v-else class="status-text locked">未解锁</text>
          </view>

          <view v-if="!level.isUnlocked" class="lock-reason">
            <text>需完成{{ level.unlockCondition }}个关卡</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="selectedLevel" class="level-detail-modal">
      <view class="modal-overlay" @tap="handleCloseModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ selectedLevel.levelName }}</text>
          <view class="close-button" @tap="handleCloseModal">
            <text>✕</text>
          </view>
        </view>

        <view class="modal-body">
          <view class="detail-row">
            <text class="detail-label">难度</text>
            <text class="detail-value">{{ getDifficultyText(selectedLevel.difficulty) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">题目数量</text>
            <text class="detail-value">{{ selectedLevel.questionCount }}题</text>
          </view>
          <view v-if="selectedLevel.userStars > 0" class="detail-row">
            <text class="detail-label">最高星级</text>
            <StarRating :stars="selectedLevel.userStars" :max="5" />
          </view>
        </view>

        <view class="modal-footer">
          <button class="modal-button primary" @tap="handleStartLevel">
            <text>开始答题</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import StarRating from '@/components/star-rating/index.vue'

const gameStore = useGameStore()

const currentLevel = ref(3)
const selectedRegion = ref('all')
const selectedLevel = ref<any>(null)

const regions = ref([
  { id: 'all', name: '全部' },
  { id: 'asia', name: '亚洲' },
  { id: 'middle-east', name: '中东' },
  { id: 'europe', name: '欧洲' },
  { id: 'africa', name: '非洲' },
  { id: 'americas', name: '美洲' }
])

const levels = ref([
  {
    id: '1',
    levelName: '江苏省关卡1',
    province: '江苏省',
    levelOrder: 1,
    questionCount: 10,
    difficulty: 1,
    userStars: 5,
    isUnlocked: true,
    isCompleted: true,
    unlockCondition: 0,
    region: 'asia'
  },
  {
    id: '2',
    levelName: '江苏省关卡2',
    province: '江苏省',
    levelOrder: 2,
    questionCount: 10,
    difficulty: 2,
    userStars: 4,
    isUnlocked: true,
    isCompleted: true,
    unlockCondition: 0,
    region: 'asia'
  },
  {
    id: '3',
    levelName: '浙江省关卡1',
    province: '浙江省',
    levelOrder: 3,
    questionCount: 10,
    difficulty: 2,
    userStars: 0,
    isUnlocked: true,
    isCompleted: false,
    unlockCondition: 0,
    region: 'asia'
  },
  {
    id: '4',
    levelName: '日本关卡1',
    province: '日本',
    levelOrder: 4,
    questionCount: 10,
    difficulty: 3,
    userStars: 0,
    isUnlocked: false,
    isCompleted: false,
    unlockCondition: 20,
    region: 'asia'
  },
  {
    id: '5',
    levelName: '法国关卡1',
    province: '法国',
    levelOrder: 5,
    questionCount: 10,
    difficulty: 3,
    userStars: 0,
    isUnlocked: false,
    isCompleted: false,
    unlockCondition: 30,
    region: 'europe'
  }
])

const filteredLevels = computed(() => {
  if (selectedRegion.value === 'all') {
    return levels.value
  }
  return levels.value.filter(level => level.region === selectedRegion.value)
})

onMounted(() => {
  console.log('关卡地图页加载')
})

const handleBack = () => {
  uni.navigateBack()
}

const handleSelectRegion = (regionId: string) => {
  selectedRegion.value = regionId
}

const handleLevelTap = (level: any) => {
  if (!level.isUnlocked) {
    uni.showToast({
      title: `需完成${level.unlockCondition}个关卡才能解锁`,
      icon: 'none'
    })
    return
  }
  selectedLevel.value = level
}

const handleCloseModal = () => {
  selectedLevel.value = null
}

const handleStartLevel = async () => {
  if (!selectedLevel.value) return

  try {
    await gameStore.startLevel(selectedLevel.value)
    uni.navigateTo({ url: '/pages/answer/index' })
  } catch (error) {
    uni.showToast({
      title: '开始关卡失败',
      icon: 'none'
    })
  }
}

const getDifficultyText = (difficulty: number) => {
  const map: Record<number, string> = {
    1: '简单',
    2: '中等',
    3: '困难',
    4: '专家',
    5: '大师'
  }
  return map[difficulty] || '未知'
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.level-map-page {
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

.level-indicator {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.region-tabs {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: #fff;
  overflow-x: auto;
  white-space: nowrap;
}

.region-tab {
  padding: $spacing-sm $spacing-md;
  background: $background-color;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $text-secondary;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &.active {
    background: $primary-color;
    color: #fff;
  }
}

.level-list {
  flex: 1;
  padding: $spacing-lg;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.level-card {
  background: #fff;
  border-radius: $radius-md;
  padding: $spacing-lg;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &.unlocked {
    &:active {
      transform: scale(0.98);
    }
  }

  &.locked {
    opacity: 0.6;
  }
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.level-name {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
}

.level-status {
  margin-bottom: $spacing-sm;
}

.status-text {
  font-size: $font-size-sm;
  padding: 4rpx $spacing-sm;
  border-radius: $radius-sm;

  &.completed {
    background: rgba(76, 175, 80, 0.1);
    color: $success-color;
  }

  &.unlocked {
    background: rgba(46, 125, 50, 0.1);
    color: $primary-color;
  }

  &.locked {
    background: rgba(117, 117, 117, 0.1);
    color: $text-secondary;
  }
}

.lock-reason {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.level-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: $spacing-xl;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
}

.modal-title {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-primary;
}

.close-button {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-color;
  border-radius: 50%;
  font-size: $font-size-lg;
  color: $text-secondary;
}

.modal-body {
  margin-bottom: $spacing-xl;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.detail-label {
  font-size: $font-size-md;
  color: $text-secondary;
}

.detail-value {
  font-size: $font-size-md;
  color: $text-primary;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
}

.modal-button {
  flex: 1;
  height: 96rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  font-weight: 500;
  border: none;

  &.primary {
    background: $primary-color;
    color: #fff;

    &:active {
      background: $primary-light;
    }
  }
}
</style>
