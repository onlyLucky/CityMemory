import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShopItem } from '@/types'
import { shopApi } from '@/api'

export const useShopStore = defineStore('shop', () => {
  const items = ref<ShopItem[]>([])
  const userStars = ref(0)

  const loadShopItems = async () => {
    try {
      items.value = await shopApi.getShopItems()
    } catch (error) {
      items.value = [
        {
          id: '1',
          itemName: '冒险门票x5',
          itemType: 'ticket',
          price: 10,
          quantity: 5,
          icon: '🎫',
          description: '购买5张冒险门票'
        },
        {
          id: '2',
          itemName: '冒险门票x10',
          itemType: 'ticket',
          price: 18,
          quantity: 10,
          icon: '🎫',
          description: '购买10张冒险门票'
        },
        {
          id: '3',
          itemName: '随机门票x1',
          itemType: 'ticket',
          price: 5,
          quantity: 1,
          icon: '🎲',
          description: '购买1张随机门票'
        },
        {
          id: '4',
          itemName: '选项排除',
          itemType: 'item',
          price: 3,
          quantity: 1,
          icon: '❌',
          description: '排除1个错误选项'
        },
        {
          id: '5',
          itemName: '题目跳过',
          itemType: 'item',
          price: 5,
          quantity: 1,
          icon: '⏭️',
          description: '跳过当前题目'
        }
      ]
    }
  }

  const buyItem = async (itemId: string) => {
    const result = await shopApi.buyItem(itemId)
    userStars.value = result.remainingStars
    return result
  }

  return {
    items,
    userStars,
    loadShopItems,
    buyItem
  }
})
