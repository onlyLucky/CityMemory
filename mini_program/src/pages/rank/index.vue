<template>
  <view class="rank-page">
    <!-- 顶部标题 -->
    <view class="rank-header">
      <text class="header-title">排行榜</text>
    </view>

    <!-- 排行榜类型切换 -->
    <view class="rank-tabs">
      <view
        class="tab-item"
        :class="{ active: rankType === 'star' }"
        @tap="rankType = 'star'"
      >
        <text class="tab-text">星级榜</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: rankType === 'level' }"
        @tap="rankType = 'level'"
      >
        <text class="tab-text">关卡榜</text>
      </view>
    </view>

    <!-- 排行榜内容 -->
    <scroll-view class="rank-list" scroll-y @scrolltolower="onLoadMore">
      <!-- 前三名特殊展示 -->
      <view class="top-three" v-if="topUsers.length >= 3">
        <!-- 第2名 - 左侧 -->
        <view class="top-item second">
          <view class="top-medal">&#129354;</view>
          <view class="top-avatar">
            <image :src="topUsers[1].avatar || defaultAvatar" mode="aspectFill" />
          </view>
          <text class="top-name">{{ topUsers[1].nickname }}</text>
          <text class="top-value">{{ getDisplayValue(topUsers[1]) }}</text>
        </view>

        <!-- 第1名 - 居中大卡片 -->
        <view class="top-item first">
          <view class="top-medal">&#129351;</view>
          <view class="top-avatar">
            <image :src="topUsers[0].avatar || defaultAvatar" mode="aspectFill" />
          </view>
          <text class="top-name">{{ topUsers[0].nickname }}</text>
          <text class="top-value">{{ getDisplayValue(topUsers[0]) }}</text>
        </view>

        <!-- 第3名 - 右侧 -->
        <view class="top-item third">
          <view class="top-medal">&#129353;</view>
          <view class="top-avatar">
            <image :src="topUsers[2].avatar || defaultAvatar" mode="aspectFill" />
          </view>
          <text class="top-name">{{ topUsers[2].nickname }}</text>
          <text class="top-value">{{ getDisplayValue(topUsers[2]) }}</text>
        </view>
      </view>

      <!-- 第4名及以后的排行列表 -->
      <view class="rank-items">
        <view
          class="rank-item"
          v-for="(user, index) in otherUsers"
          :key="user.user_id"
        >
          <text class="rank-num">{{ index + 4 }}</text>
          <image class="user-avatar" :src="user.avatar || defaultAvatar" mode="aspectFill" />
          <view class="user-info">
            <text class="user-name">{{ user.nickname }}</text>
          </view>
          <text class="user-value">{{ getDisplayValue(user) }}</text>
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="load-more" v-if="isLoading">
        <text class="load-text">加载中...</text>
      </view>
      <view class="load-more" v-else-if="!hasMore && otherUsers.length > 0">
        <text class="load-text">没有更多了</text>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-placeholder"></view>
    </scroll-view>

    <!-- 底部固定"我的排名" -->
    <view class="my-rank-bar" v-if="myRank">
      <text class="my-rank-num">第{{ myRank.rank }}名</text>
      <image class="my-avatar" :src="myRank.avatar || defaultAvatar" mode="aspectFill" />
      <view class="my-info">
        <text class="my-name">{{ myRank.nickname }}</text>
      </view>
      <text class="my-value">{{ getDisplayValue(myRank) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import * as rankApi from '@/api/rank'
import type { RankItem } from '@/types/rank'

// ==========================================
// 类型定义
// ==========================================

type RankTypeValue = 'star' | 'level'

// ==========================================
// Store
// ==========================================

const userStore = useUserStore()

// ==========================================
// 状态
// ==========================================

const rankType = ref<RankTypeValue>('star')
const rankList = ref<RankItem[]>([])
const myRank = ref<RankItem | null>(null)
const isLoading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 15

// 默认头像
const defaultAvatar = '/static/images/default-avatar.png'

// ==========================================
// 计算属性
// ==========================================

// 前三名
const topUsers = computed(() => rankList.value.slice(0, 3))

// 第4名及以后
const otherUsers = computed(() => rankList.value.slice(3))

// ==========================================
// 方法
// ==========================================

/**
 * 获取显示值（根据排行榜类型）
 */
const getDisplayValue = (user: RankItem): string => {
  if (rankType.value === 'star') {
    return `${user.total_stars} 星`
  } else {
    return `${user.level_count} 关`
  }
}

/**
 * 获取排行榜数据
 */
const fetchRankData = async (isLoadMore = false) => {
  if (isLoading.value) return

  isLoading.value = true

  try {
    const params = {
      page: currentPage.value,
      pageSize
    }

    const res = rankType.value === 'star'
      ? await rankApi.getStarRank(params)
      : await rankApi.getLevelRank(params)

    if (res.code === 0 && res.data) {
      if (isLoadMore) {
        rankList.value = [...rankList.value, ...res.data.list]
      } else {
        rankList.value = res.data.list
        myRank.value = res.data.my_rank || null
      }

      hasMore.value = rankList.value.length < res.data.total
    }
  } catch (error) {
    console.error('获取排行榜失败', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 加载更多
 */
const onLoadMore = () => {
  if (!hasMore.value || isLoading.value) return

  currentPage.value++
  fetchRankData(true)
}

/**
 * 重置并加载数据
 */
const resetAndFetch = () => {
  currentPage.value = 1
  rankList.value = []
  hasMore.value = true
  fetchRankData()
}

// ==========================================
// 监听
// ==========================================

// 监听排行榜类型切换
watch(rankType, () => {
  resetAndFetch()
})

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  fetchRankData()
})
</script>

<style lang="scss" scoped>
.rank-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

// 顶部标题
.rank-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  padding-top: env(safe-area-inset-top);
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
}

.header-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

// 排行榜类型切换
.rank-tabs {
  display: flex;
  padding: $spacing-page;
  background-color: $color-bg-card;
  border-bottom: 1rpx solid $color-border-light;
}

.tab-item {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-base;
  transition: all $transition-base;

  &.active {
    background-color: $color-primary;
  }
}

.tab-text {
  font-size: $font-size-base;
  color: $color-text-secondary;
}

.tab-item.active .tab-text {
  color: $color-text-white;
}

// 排行榜列表
.rank-list {
  height: calc(100vh - 200rpx - env(safe-area-inset-top) - 120rpx - env(safe-area-inset-bottom));
}

// 前三名特殊展示
.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: $spacing-page-lg $spacing-page;
  background: linear-gradient(180deg, rgba($color-primary, 0.1) 0%, transparent 100%);
}

.top-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-element;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
  transition: all $transition-base;

  &.first {
    width: 240rpx;
    padding: $spacing-page;
    margin: 0 $spacing-element;
    transform: scale(1.05);
    z-index: 2;

    .top-medal {
      font-size: 56rpx;
    }

    .top-avatar {
      width: 120rpx;
      height: 120rpx;
      border-color: $color-star;
    }

    .top-name {
      font-size: $font-size-base;
    }

    .top-value {
      font-size: $font-size-sm;
      color: $color-star;
    }
  }

  &.second,
  &.third {
    width: 200rpx;

    .top-medal {
      font-size: 44rpx;
    }

    .top-avatar {
      width: 96rpx;
      height: 96rpx;
      border-color: $color-silver;
    }

    .top-name {
      font-size: $font-size-sm;
    }

    .top-value {
      font-size: $font-size-xs;
    }
  }

  &.third {
    .top-avatar {
      border-color: $color-bronze;
    }
  }
}

.top-medal {
  margin-bottom: $spacing-text-sm;
}

.top-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: $border-radius-round;
  border: 4rpx solid $color-silver;
  overflow: hidden;
  margin-bottom: $spacing-text;

  image {
    width: 100%;
    height: 100%;
  }
}

.top-name {
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  margin-bottom: $spacing-text-sm;
  text-align: center;
  max-width: 180rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-value {
  font-weight: $font-weight-bold;
  color: $color-primary;
}

// 排行列表
.rank-items {
  padding: 0 $spacing-page;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: $spacing-element $spacing-page;
  margin-bottom: $spacing-element-sm;
  background-color: $color-bg-card;
  border-radius: $border-radius-base;
  box-shadow: $shadow-sm;
}

.rank-num {
  width: 56rpx;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-secondary;
  text-align: center;
}

.user-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: $border-radius-round;
  margin: 0 $spacing-element;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-value {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

// 加载更多
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-page;
}

.load-text {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// 底部占位
.bottom-placeholder {
  height: $spacing-page;
}

// 底部固定"我的排名"
.my-rank-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: $spacing-element $spacing-page;
  padding-bottom: calc($spacing-element + env(safe-area-inset-bottom));
  background-color: $color-bg-card;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
  z-index: $z-index-fixed;
}

.my-rank-num {
  width: 100rpx;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.my-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: $border-radius-round;
  margin-right: $spacing-element;
  border: 2rpx solid $color-primary;
}

.my-info {
  flex: 1;
  min-width: 0;
}

.my-name {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-value {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-primary;
}
</style>
