/**
 * 商店状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShopItem, ObtainedItem } from '@/types/shop'
import * as shopApi from '@/api/shop'
import { useUserStore } from './user'

/** 用户道具接口 */
export interface UserItem {
  /** 用户道具ID */
  userItemId: number
  /** 道具ID */
  itemId: number
  /** 道具名称 */
  itemName: string
  /** 道具类型 */
  itemType: string
  /** 数量 */
  quantity: number
  /** 图标 */
  icon?: string
}

export const useShopStore = defineStore('shop', () => {
  // ==========================================
  // 状态
  // ==========================================

  /** 商品列表 */
  const items = ref<ShopItem[]>([])

  /** 用户拥有的道具 */
  const userItems = ref<UserItem[]>([])

  /** 是否正在加载 */
  const isLoading = ref<boolean>(false)

  // ==========================================
  // 计算属性
  // ==========================================

  /** 按类型分组的商品 */
  const itemsByType = computed(() => {
    const grouped: Record<string, ShopItem[]> = {}
    items.value.forEach(item => {
      if (!grouped[item.item_type]) {
        grouped[item.item_type] = []
      }
      grouped[item.item_type].push(item)
    })
    return grouped
  })

  /** 用户道具总数 */
  const totalUserItems = computed(() => {
    return userItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // ==========================================
  // 方法
  // ==========================================

  /**
   * 获取商品列表
   * @param itemType 道具类型筛选
   */
  const fetchShopItems = async (itemType?: string) => {
    isLoading.value = true
    try {
      const res = await shopApi.getShopItems({
        item_type: itemType as any,
        page: 1,
        pageSize: 100
      })
      
      if (res.code === 0 && res.data) {
        items.value = res.data.list
      }
    } catch (error) {
      console.error('获取商品列表失败', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 购买商品
   * @param itemId 商品ID
   * @param quantity 购买数量
   * @returns 购买结果
   */
  const buyItem = async (
    itemId: number,
    quantity: number = 1
  ): Promise<{
    success: boolean
    message: string
    obtainedItems?: ObtainedItem[]
  }> => {
    try {
      const res = await shopApi.buyItem(itemId, quantity)
      
      if (res.code === 0 && res.data) {
        // 更新用户金币/钻石
        const userStore = useUserStore()
        if (userStore.userInfo) {
          userStore.userInfo = {
            ...userStore.userInfo,
            coins: res.data.remaining_coins
          }
        }

        // 添加到用户道具列表
        res.data.obtained_items.forEach(obtained => {
          const existingItem = userItems.value.find(
            item => item.itemId === obtained.item_id
          )
          
          if (existingItem) {
            existingItem.quantity += obtained.quantity
          } else {
            // 查找商品信息
            const shopItem = items.value.find(i => i.id === itemId)
            userItems.value.push({
              userItemId: obtained.item_id,
              itemId: obtained.item_id,
              itemName: obtained.item_name,
              itemType: obtained.item_type,
              quantity: obtained.quantity,
              icon: shopItem?.icon
            })
          }
        })

        return {
          success: true,
          message: '购买成功',
          obtainedItems: res.data.obtained_items
        }
      }
      
      return {
        success: false,
        message: res.message || '购买失败'
      }
    } catch (error: any) {
      console.error('购买商品失败', error)
      return {
        success: false,
        message: error.message || '购买失败'
      }
    }
  }

  /**
   * 使用道具
   * @param userItemId 用户道具ID
   * @param scene 使用场景
   * @param sceneData 场景相关数据
   * @returns 使用结果
   */
  const useItem = async (
    userItemId: number,
    scene: string,
    sceneData?: Record<string, unknown>
  ): Promise<{
    success: boolean
    message: string
    effectData?: Record<string, unknown>
  }> => {
    try {
      const res = await shopApi.useItem({
        user_item_id: userItemId,
        scene,
        scene_data: sceneData
      })
      
      if (res.code === 0 && res.data) {
        // 更新道具数量
        const item = userItems.value.find(i => i.userItemId === userItemId)
        if (item) {
          if (res.data.remaining_quantity <= 0) {
            // 移除道具
            const index = userItems.value.findIndex(
              i => i.userItemId === userItemId
            )
            if (index > -1) {
              userItems.value.splice(index, 1)
            }
          } else {
            item.quantity = res.data.remaining_quantity
          }
        }

        return {
          success: true,
          message: '使用成功',
          effectData: res.data.effect_data
        }
      }
      
      return {
        success: false,
        message: res.message || '使用失败'
      }
    } catch (error: any) {
      console.error('使用道具失败', error)
      return {
        success: false,
        message: error.message || '使用失败'
      }
    }
  }

  /**
   * 获取用户道具数量
   * @param itemId 道具ID
   * @returns 道具数量
   */
  const getUserItemQuantity = (itemId: number): number => {
    const item = userItems.value.find(i => i.itemId === itemId)
    return item?.quantity || 0
  }

  /**
   * 初始化商店数据
   */
  const initShop = async () => {
    await fetchShopItems()
  }

  return {
    // 状态
    items,
    userItems,
    isLoading,
    // 计算属性
    itemsByType,
    totalUserItems,
    // 方法
    fetchShopItems,
    buyItem,
    useItem,
    getUserItemQuantity,
    initShop
  }
})
