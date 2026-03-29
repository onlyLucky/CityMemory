<template>
  <view class="shop-page">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="nav-back" @tap="onBack">
        <text class="back-icon">&lt;</text>
      </view>
      <text class="nav-title">商店</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 货币显示 -->
    <view class="currency-card">
      <view class="currency-item">
        <text class="currency-icon">&#11088;</text>
        <view class="currency-info">
          <text class="currency-value">{{ stars }}</text>
          <text class="currency-label">星星</text>
        </view>
      </view>
      <view class="currency-divider"></view>
      <view class="currency-item">
        <text class="currency-icon">&#129689;</text>
        <view class="currency-info">
          <text class="currency-value">{{ coins }}</text>
          <text class="currency-label">金币</text>
        </view>
      </view>
    </view>

    <!-- 商品分类Tab -->
    <view class="category-tabs">
      <view
        class="tab-item"
        :class="{ active: currentCategory === 'ticket' }"
        @tap="currentCategory = 'ticket'"
      >
        <text class="tab-text">门票</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: currentCategory === 'item' }"
        @tap="currentCategory = 'item'"
      >
        <text class="tab-text">道具</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="shop-list" scroll-y>
      <!-- 门票列表 -->
      <view v-if="currentCategory === 'ticket'" class="shop-items">
        <view
          class="shop-item"
          v-for="item in ticketItems"
          :key="item.id"
          @tap="onExchange(item)"
        >
          <view class="item-icon-wrap">
            <text class="item-icon">&#127915;</text>
          </view>
          <view class="item-content">
            <view class="item-header">
              <text class="item-name">{{ item.name }}</text>
              <view class="item-price">
                <text class="price-icon">&#11088;</text>
                <text class="price-value">{{ item.price }}</text>
              </view>
            </view>
            <text class="item-desc">{{ item.description }}</text>
          </view>
          <view class="item-action">
            <text class="action-btn">兑换</text>
          </view>
        </view>
      </view>

      <!-- 道具列表 -->
      <view v-if="currentCategory === 'item'" class="shop-items">
        <view
          class="shop-item"
          v-for="item in propItems"
          :key="item.id"
          @tap="onExchange(item)"
        >
          <view class="item-icon-wrap">
            <text class="item-icon">{{ item.icon }}</text>
          </view>
          <view class="item-content">
            <view class="item-header">
              <text class="item-name">{{ item.name }}</text>
              <view class="item-price-group">
                <view
                  v-if="item.starPrice"
                  class="item-price"
                  :class="{ 'price-active': selectedCurrency[item.id] === 'star' }"
                  @tap.stop="selectCurrency(item.id, 'star')"
                >
                  <text class="price-icon">&#11088;</text>
                  <text class="price-value">{{ item.starPrice }}</text>
                </view>
                <text v-if="item.starPrice && item.coinPrice" class="price-or">或</text>
                <view
                  v-if="item.coinPrice"
                  class="item-price price-coins"
                  :class="{ 'price-active': selectedCurrency[item.id] === 'coin' || !item.starPrice }"
                  @tap.stop="selectCurrency(item.id, 'coin')"
                >
                  <text class="price-icon">&#129689;</text>
                  <text class="price-value">{{ item.coinPrice }}</text>
                </view>
              </view>
            </view>
            <text class="item-desc">{{ item.description }}</text>
          </view>
          <view class="item-action">
            <text class="action-btn">兑换</text>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useShopStore } from '@/stores/shop'

// ==========================================
// 类型定义
// ==========================================

type CategoryType = 'ticket' | 'item'

interface ShopProduct {
  id: number
  name: string
  description: string
  icon: string
  starPrice?: number
  coinPrice?: number
  price: number // 用于门票，只有星星价格
  category: CategoryType
  itemType?: string
}

// ==========================================
// Store
// ==========================================

const userStore = useUserStore()
const shopStore = useShopStore()

// ==========================================
// 状态
// ==========================================

const currentCategory = ref<CategoryType>('ticket')

// 用户货币
const stars = computed(() => userStore.userInfo?.total_stars || 0)
const coins = computed(() => userStore.userInfo?.coins || 0)

// 选中的货币类型（用于道具）
const selectedCurrency = reactive<Record<number, 'star' | 'coin'>>({})

// ==========================================
// 商品数据
// ==========================================

// 门票商品
const ticketItems = ref<ShopProduct[]>([
  {
    id: 101,
    name: '闯关门票x5',
    description: '用于闯关模式，可挑战5个关卡',
    icon: '🎫',
    price: 10,
    category: 'ticket',
    itemType: 'adventure_ticket'
  },
  {
    id: 102,
    name: '闯关门票x10',
    description: '用于闯关模式，可挑战10个关卡',
    icon: '🎫',
    price: 18,
    category: 'ticket',
    itemType: 'adventure_ticket'
  },
  {
    id: 103,
    name: '随机门票x1',
    description: '用于随机挑战模式，可挑战1次',
    icon: '🎲',
    price: 5,
    category: 'ticket',
    itemType: 'random_ticket'
  },
  {
    id: 104,
    name: '随机门票x3',
    description: '用于随机挑战模式，可挑战3次',
    icon: '🎲',
    price: 12,
    category: 'ticket',
    itemType: 'random_ticket'
  }
])

// 道具商品
const propItems = ref<ShopProduct[]>([
  {
    id: 201,
    name: '选项排除',
    description: '答题时排除一个错误选项',
    icon: '🚫',
    starPrice: 3,
    coinPrice: 30,
    price: 3,
    category: 'item',
    itemType: 'exclude_option'
  },
  {
    id: 202,
    name: '题目跳过',
    description: '跳过当前题目，不计入错误',
    icon: '⏭️',
    starPrice: 5,
    coinPrice: 50,
    price: 5,
    category: 'item',
    itemType: 'skip_question'
  },
  {
    id: 203,
    name: '血瓶',
    description: '随机模式专用，恢复1点生命值',
    icon: '🧪',
    coinPrice: 50,
    price: 50,
    category: 'item',
    itemType: 'blood_bottle'
  },
  {
    id: 204,
    name: '护盾',
    description: '随机模式专用，答题错误时自动抵消一次伤害',
    icon: '🛡️',
    coinPrice: 80,
    price: 80,
    category: 'item',
    itemType: 'shield'
  }
])

// ==========================================
// 方法
// ==========================================

/**
 * 返回上一页
 */
const onBack = () => {
  uni.navigateBack()
}

/**
 * 选择货币类型
 */
const selectCurrency = (itemId: number, currency: 'star' | 'coin') => {
  selectedCurrency[itemId] = currency
}

/**
 * 获取商品实际价格和货币类型
 */
const getActualPrice = (item: ShopProduct): { price: number; currency: 'star' | 'coin' } => {
  if (item.category === 'ticket') {
    return { price: item.price, currency: 'star' }
  }

  // 道具：检查选中的货币类型
  const selected = selectedCurrency[item.id]

  if (selected === 'star' && item.starPrice) {
    return { price: item.starPrice, currency: 'star' }
  }

  if (selected === 'coin' && item.coinPrice) {
    return { price: item.coinPrice, currency: 'coin' }
  }

  // 默认优先星星，其次金币
  if (item.starPrice) {
    return { price: item.starPrice, currency: 'star' }
  }

  return { price: item.coinPrice || 0, currency: 'coin' }
}

/**
 * 兑换商品
 */
const onExchange = (item: ShopProduct) => {
  const { price, currency } = getActualPrice(item)

  // 检查货币是否足够
  if (currency === 'star') {
    if (stars.value < price) {
      uni.showToast({ title: '星星不足', icon: 'none' })
      return
    }
  } else {
    if (coins.value < price) {
      uni.showToast({ title: '金币不足', icon: 'none' })
      return
    }
  }

  // 确认兑换
  const currencyName = currency === 'star' ? '星星' : '金币'
  uni.showModal({
    title: '确认兑换',
    content: `是否花费 ${price} ${currencyName} 兑换 ${item.name}？`,
    success: (res) => {
      if (res.confirm) {
        doExchange(item, price, currency)
      }
    }
  })
}

/**
 * 执行兑换
 */
const doExchange = (item: ShopProduct, price: number, currency: 'star' | 'coin') => {
  // 扣除货币
  if (userStore.userInfo) {
    if (currency === 'star') {
      userStore.userInfo = {
        ...userStore.userInfo,
        total_stars: userStore.userInfo.total_stars - price
      }
    } else {
      userStore.userInfo = {
        ...userStore.userInfo,
        coins: userStore.userInfo.coins - price
      }
    }
  }

  // 兑换成功
  uni.showToast({ title: '兑换成功', icon: 'success' })
}

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  // 初始化道具的默认货币选择
  propItems.value.forEach(item => {
    if (item.starPrice) {
      selectedCurrency[item.id] = 'star'
    } else if (item.coinPrice) {
      selectedCurrency[item.id] = 'coin'
    }
  })
})
</script>

<style lang="scss" scoped>
.shop-page {
  min-height: 100vh;
  background-color: $color-bg-page;
}

// 导航栏
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 $spacing-page;
  padding-top: env(safe-area-inset-top);
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: $font-size-xl;
  color: $color-text-white;
  font-weight: $font-weight-bold;
}

.nav-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

.nav-placeholder {
  width: 64rpx;
}

// 货币显示
.currency-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-page;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
}

.currency-item {
  display: flex;
  align-items: center;
  padding: 0 $spacing-element-lg;
}

.currency-icon {
  font-size: 48rpx;
  margin-right: $spacing-text;
}

.currency-info {
  display: flex;
  flex-direction: column;
}

.currency-value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

.currency-label {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.8);
}

.currency-divider {
  width: 1rpx;
  height: 64rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

// 分类Tab
.category-tabs {
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

// 商品列表
.shop-list {
  height: calc(100vh - 320rpx - env(safe-area-inset-top));
}

.shop-items {
  padding: $spacing-page;
}

.shop-item {
  display: flex;
  align-items: center;
  padding: $spacing-page;
  margin-bottom: $spacing-element;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: all $transition-base;

  &:active {
    transform: scale(0.98);
  }
}

.item-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-page;
  border-radius: $border-radius-lg;
  margin-right: $spacing-element;
  flex-shrink: 0;
}

.item-icon {
  font-size: 48rpx;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-text-sm;
}

.item-name {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.item-desc {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price-group {
  display: flex;
  align-items: center;
  gap: $spacing-text-sm;
}

.item-price {
  display: flex;
  align-items: center;
  padding: $spacing-text-sm $spacing-element;
  background-color: rgba($color-star, 0.1);
  border-radius: $border-radius-base;
  border: 2rpx solid transparent;
  transition: all $transition-fast;

  &.price-coins {
    background-color: rgba($color-gold, 0.1);
  }

  &.price-active {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.1);
  }
}

.price-icon {
  font-size: $font-size-sm;
  margin-right: $spacing-text-sm;
}

.price-value {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-star;

  .price-coins & {
    color: $color-gold;
  }

  .price-active & {
    color: $color-primary;
  }
}

.price-or {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.item-action {
  margin-left: $spacing-element;
  flex-shrink: 0;
}

.action-btn {
  display: inline-block;
  padding: $spacing-text $spacing-element;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-white;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  border-radius: $border-radius-base;
}

// 底部安全区域
.safe-bottom {
  height: calc($spacing-page + env(safe-area-inset-bottom));
}
</style>
