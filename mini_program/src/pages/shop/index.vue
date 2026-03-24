<template>
  <view class="shop-page">
    <view class="user-info-section">
      <view class="stars-display">
        <text class="stars-icon">⭐</text>
        <text class="stars-value">{{ userStars }}</text>
      </view>
      <view class="coins-display">
        <text class="coins-icon">💰</text>
        <text class="coins-value">{{ userCoins }}</text>
      </view>
    </view>

    <view class="shop-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="shop-tab"
        :class="{ active: selectedTab === tab.id }"
        @tap="handleSelectTab(tab.id)"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>

    <scroll-view class="shop-items" scroll-y>
      <view class="items-grid">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="shop-item"
          @tap="handleBuyItem(item)"
        >
          <view class="item-icon">{{ item.icon }}</view>
          <view class="item-name">{{ item.itemName }}</view>
          <view class="item-description">{{ item.description }}</view>
          <view class="item-price">
            <text class="price-icon">{{ selectedTab === 'stars' ? '⭐' : '💰' }}</text>
            <text class="price-value">{{ item.price }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useShopStore } from '@/stores/shop'
import type { ShopItem } from '@/types'

const userStore = useUserStore()
const shopStore = useShopStore()

const userStars = ref(125)
const userCoins = ref(500)
const selectedTab = ref('stars')

const tabs = ref([
  { id: 'stars', name: '星星商店' },
  { id: 'coins', name: '金币商店' }
])

const shopItems = ref<ShopItem[]>([
  {
    id: '1',
    itemName: '冒险门票x5',
    itemType: 'ticket',
    price: 10,
    quantity: 5,
    icon: '🎫',
    description: '购买5张冒险门票',
    currency: 'stars'
  },
  {
    id: '2',
    itemName: '冒险门票x10',
    itemType: 'ticket',
    price: 18,
    quantity: 10,
    icon: '🎫',
    description: '购买10张冒险门票',
    currency: 'stars'
  },
  {
    id: '3',
    itemName: '随机门票x1',
    itemType: 'ticket',
    price: 5,
    quantity: 1,
    icon: '🎲',
    description: '购买1张随机门票',
    currency: 'stars'
  },
  {
    id: '4',
    itemName: '随机门票x3',
    itemType: 'ticket',
    price: 12,
    quantity: 3,
    icon: '🎲',
    description: '购买3张随机门票',
    currency: 'stars'
  },
  {
    id: '5',
    itemName: '选项排除',
    itemType: 'item',
    price: 3,
    quantity: 1,
    icon: '❌',
    description: '排除1个错误选项',
    currency: 'stars'
  },
  {
    id: '6',
    itemName: '题目跳过',
    itemType: 'item',
    price: 5,
    quantity: 1,
    icon: '⏭️',
    description: '跳过当前题目',
    currency: 'stars'
  },
  {
    id: '7',
    itemName: '血瓶',
    itemType: 'item',
    price: 50,
    quantity: 1,
    icon: '💊',
    description: '恢复1点血量',
    currency: 'coins'
  },
  {
    id: '8',
    itemName: '护盾',
    itemType: 'item',
    price: 80,
    quantity: 1,
    icon: '🛡️',
    description: '下次答错不扣血',
    currency: 'coins'
  },
  {
    id: '9',
    itemName: '选项排除',
    itemType: 'item',
    price: 30,
    quantity: 1,
    icon: '❌',
    description: '排除1个错误选项',
    currency: 'coins'
  },
  {
    id: '10',
    itemName: '题目跳过',
    itemType: 'item',
    price: 50,
    quantity: 1,
    icon: '⏭️',
    description: '跳过当前题目',
    currency: 'coins'
  }
])

const filteredItems = computed(() => {
  return shopItems.value.filter(item => {
    if (selectedTab.value === 'stars') {
      return item.currency === 'stars'
    }
    return item.currency === 'coins'
  })
})

onMounted(async () => {
  await loadShopData()
})

const loadShopData = async () => {
  try {
    await shopStore.loadShopItems()
  } catch (error) {
    console.error('加载商店数据失败', error)
  }
}

const handleSelectTab = (tabId: string) => {
  selectedTab.value = tabId
}

const handleBuyItem = (item: ShopItem) => {
  const currency = selectedTab.value === 'stars' ? userStars.value : userCoins.value
  const currencyName = selectedTab.value === 'stars' ? '星星' : '金币'

  if (currency < item.price) {
    uni.showToast({
      title: `${currencyName}不足`,
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '确认购买',
    content: `确定花费${item.price}${currencyName}购买${item.itemName}吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await shopStore.buyItem(item.id)
          
          if (selectedTab.value === 'stars') {
            userStars.value -= item.price
          } else {
            userCoins.value -= item.price
          }

          uni.showToast({
            title: '购买成功',
            icon: 'success'
          })
        } catch (error) {
          uni.showToast({
            title: '购买失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.shop-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.user-info-section {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
}

.stars-display,
.coins-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-md;
  color: #fff;
}

.stars-icon,
.coins-icon {
  font-size: 40rpx;
}

.stars-value,
.coins-value {
  font-size: $font-size-lg;
  font-weight: bold;
}

.shop-tabs {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: #fff;
}

.shop-tab {
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

.shop-items {
  flex: 1;
  padding: $spacing-lg;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.shop-item {
  background: #fff;
  border-radius: $radius-md;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.item-icon {
  font-size: 80rpx;
  margin-bottom: $spacing-md;
}

.item-name {
  font-size: $font-size-md;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.item-description {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-md;
  line-height: 1.4;
}

.item-price {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: rgba(46, 125, 50, 0.1);
  border-radius: $radius-sm;
}

.price-icon {
  font-size: 32rpx;
}

.price-value {
  font-size: $font-size-md;
  font-weight: bold;
  color: $primary-color;
}
</style>
