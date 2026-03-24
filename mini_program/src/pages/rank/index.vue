<template>
  <view class="rank-page">
    <view class="rank-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="rank-tab"
        :class="{ active: selectedTab === tab.id }"
        @tap="handleSelectTab(tab.id)"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>

    <view class="my-rank-card" v-if="myRank">
      <view class="my-rank-info">
        <text class="my-rank-label">我的排名</text>
        <text class="my-rank-value">#{{ myRank.rank }}</text>
      </view>
      <view class="my-rank-value-display">
        <text class="my-rank-value-text">{{ myRank.value }}</text>
        <text class="my-rank-unit">{{ selectedTab === 'star' ? '星星' : '关卡' }}</text>
      </view>
    </view>

    <scroll-view class="rank-list" scroll-y @scrolltolower="handleLoadMore">
      <view class="rank-item" v-for="(item, index) in rankList" :key="item.userId">
        <view class="rank-number" :class="getRankClass(index)">
          <text>{{ index + 1 }}</text>
        </view>
        <image class="user-avatar" :src="item.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
        <view class="user-info">
          <text class="user-nickname">{{ item.nickname }}</text>
          <text class="user-province">{{ item.province }}</text>
        </view>
        <view class="rank-value">
          <text class="value-text">{{ item.value }}</text>
          <text class="value-unit">{{ selectedTab === 'star' ? '⭐' : '🎯' }}</text>
        </view>
      </view>

      <view v-if="loading" class="loading-tip">
        <text>加载中...</text>
      </view>

      <view v-if="noMore" class="no-more-tip">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { RankItem } from '@/types'

const selectedTab = ref('star')
const loading = ref(false)
const noMore = ref(false)
const myRank = ref<{ rank: number; value: number } | null>(null)
const rankList = ref<RankItem[]>([])

const tabs = ref([
  { id: 'star', name: '星星排行' },
  { id: 'level', name: '关卡排行' }
])

onMounted(() => {
  loadRankData()
})

const handleSelectTab = (tabId: string) => {
  selectedTab.value = tabId
  rankList.value = []
  noMore.value = false
  loadRankData()
}

const loadRankData = async () => {
  if (loading.value || noMore.value) return

  loading.value = true

  try {
    const mockData = generateMockRankData()
    myRank.value = mockData.myRank
    rankList.value = mockData.list
  } catch (error) {
    console.error('加载排行榜失败', error)
  } finally {
    loading.value = false
  }
}

const generateMockRankData = () => {
  const list: RankItem[] = [
    {
      rank: 1,
      userId: '1',
      nickname: '地理达人',
      avatar: '',
      province: '江苏省',
      value: 1000,
      levelCount: 35
    },
    {
      rank: 2,
      userId: '2',
      nickname: '城市探索者',
      avatar: '',
      province: '浙江省',
      value: 950,
      levelCount: 32
    },
    {
      rank: 3,
      userId: '3',
      nickname: '世界旅行家',
      avatar: '',
      province: '上海市',
      value: 900,
      levelCount: 30
    },
    {
      rank: 4,
      userId: '4',
      nickname: '地图爱好者',
      avatar: '',
      province: '北京市',
      value: 850,
      levelCount: 28
    },
    {
      rank: 5,
      userId: '5',
      nickname: '知识探险家',
      avatar: '',
      province: '广东省',
      value: 800,
      levelCount: 25
    }
  ]

  return {
    list,
    myRank: {
      rank: 15,
      value: 500
    }
  }
}

const handleLoadMore = () => {
  if (loading.value || noMore.value) return
  loadRankData()
}

const getRankClass = (index: number) => {
  if (index === 0) return 'first'
  if (index === 1) return 'second'
  if (index === 2) return 'third'
  return ''
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.rank-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.rank-tabs {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: #fff;
}

.rank-tab {
  flex: 1;
  padding: $spacing-sm;
  text-align: center;
  background: $background-color;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $text-secondary;
  transition: all 0.3s ease;

  &.active {
    background: $primary-color;
    color: #fff;
  }
}

.my-rank-card {
  margin: $spacing-lg;
  padding: $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: $radius-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(46, 125, 50, 0.3);
}

.my-rank-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.my-rank-label {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.my-rank-value {
  font-size: $font-size-xl;
  font-weight: bold;
}

.my-rank-value-display {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;
}

.my-rank-value-text {
  font-size: $font-size-xl;
  font-weight: bold;
}

.my-rank-unit {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.rank-list {
  flex: 1;
  padding: 0 $spacing-lg $spacing-lg;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background: #fff;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.rank-number {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-color;
  border-radius: 50%;
  font-size: $font-size-md;
  font-weight: bold;
  color: $text-secondary;
  margin-right: $spacing-md;
  flex-shrink: 0;

  &.first {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #fff;
  }

  &.second {
    background: linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%);
    color: #fff;
  }

  &.third {
    background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
    color: #fff;
  }
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: $spacing-md;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-nickname {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
}

.user-province {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.rank-value {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.value-text {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $primary-color;
}

.value-unit {
  font-size: 32rpx;
}

.loading-tip,
.no-more-tip {
  text-align: center;
  padding: $spacing-lg;
  color: $text-secondary;
  font-size: $font-size-sm;
}
</style>
