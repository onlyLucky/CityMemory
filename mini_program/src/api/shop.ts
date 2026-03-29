/**
 * 商店相关 API 接口
 */

import type { ApiResponse, PageResult } from '@/types'
import type {
  ShopItem,
  ShopListParams,
  BuyItemParams,
  BuyItemResult,
  UseItemParams,
  UseItemResult,
  ObtainedItem
} from '@/types/shop'
import { ItemType, CurrencyType } from '@/constants/enums'

// ==========================================
// 虚拟数据
// ==========================================

const mockShopItems: ShopItem[] = [
  {
    id: 1,
    name: '选项排除卡',
    description: '使用后可排除一个错误选项，提高答题正确率',
    price: 100,
    currency_type: CurrencyType.COINS,
    item_type: ItemType.EXCLUDE_OPTION,
    quantity: 1,
    icon: '/static/icons/item_exclude.png',
    is_available: true,
    sort_order: 1
  },
  {
    id: 2,
    name: '跳题卡',
    description: '跳过当前题目，不计入错误',
    price: 150,
    currency_type: CurrencyType.COINS,
    item_type: ItemType.SKIP_QUESTION,
    quantity: 1,
    icon: '/static/icons/item_skip.png',
    is_available: true,
    sort_order: 2
  },
  {
    id: 3,
    name: '血瓶（小）',
    description: '恢复1点生命值',
    price: 200,
    currency_type: CurrencyType.COINS,
    item_type: ItemType.BLOOD_BOTTLE,
    quantity: 1,
    icon: '/static/icons/item_blood_small.png',
    is_available: true,
    sort_order: 3
  },
  {
    id: 4,
    name: '血瓶（大）',
    description: '恢复3点生命值',
    price: 500,
    currency_type: CurrencyType.COINS,
    item_type: ItemType.BLOOD_BOTTLE,
    quantity: 3,
    icon: '/static/icons/item_blood_large.png',
    is_available: true,
    sort_order: 4
  },
  {
    id: 5,
    name: '护盾',
    description: '答题错误时自动抵消一次伤害',
    price: 300,
    currency_type: CurrencyType.COINS,
    item_type: ItemType.SHIELD,
    quantity: 1,
    icon: '/static/icons/item_shield.png',
    is_available: true,
    sort_order: 5
  },
  {
    id: 6,
    name: '选项排除卡x5',
    description: '5张选项排除卡，超值优惠',
    price: 450,
    currency_type: CurrencyType.COINS,
    item_type: ItemType.EXCLUDE_OPTION,
    quantity: 5,
    icon: '/static/icons/item_exclude_pack.png',
    is_available: true,
    sort_order: 6
  },
  {
    id: 7,
    name: '新手礼包',
    description: '包含3张跳题卡和2瓶小血瓶',
    price: 10,
    currency_type: CurrencyType.DIAMONDS,
    item_type: ItemType.SKIP_QUESTION,
    quantity: 1,
    icon: '/static/icons/item_starter_pack.png',
    is_available: true,
    sort_order: 7
  },
  {
    id: 8,
    name: '冒险门票x5',
    description: '5张冒险模式门票',
    price: 50,
    currency_type: CurrencyType.DIAMONDS,
    item_type: ItemType.SKIP_QUESTION,
    quantity: 5,
    icon: '/static/icons/item_ticket_pack.png',
    is_available: true,
    sort_order: 8
  }
]

// 模拟用户当前金币和钻石
let mockUserCoins = 2580
let mockUserDiamonds = 50

// 模拟用户道具背包
const mockUserItems: Map<number, number> = new Map([
  [1, 3],  // 选项排除卡 x3
  [2, 2],  // 跳题卡 x2
  [3, 1],  // 血瓶（小）x1
  [5, 1]   // 护盾 x1
])

// ==========================================
// API 接口实现
// ==========================================

/**
 * 获取商品列表
 * @param params 查询参数
 * @returns 商品列表
 */
export function getShopItems(params?: ShopListParams): Promise<ApiResponse<PageResult<ShopItem>>> {
  const page = params?.page || 1
  const pageSize = params?.pageSize || 20

  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredItems = [...mockShopItems]

      if (params?.item_type !== undefined) {
        filteredItems = filteredItems.filter(
          (item) => item.item_type === params.item_type
        )
      }

      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = filteredItems.slice(startIndex, endIndex)

      resolve({
        code: 0,
        message: '获取成功',
        data: {
          list: paginatedList,
          total: filteredItems.length,
          page,
          pageSize,
          totalPages: Math.ceil(filteredItems.length / pageSize)
        }
      })
    }, 200)
  })
}

/**
 * 购买商品
 * @param itemId 商品ID
 * @param quantity 购买数量
 * @returns 购买结果
 */
export function buyItem(itemId: number, quantity: number = 1): Promise<ApiResponse<BuyItemResult>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = mockShopItems.find((i) => i.id === itemId)

      if (!item) {
        reject({
          code: 404,
          message: '商品不存在',
          data: null
        })
        return
      }

      if (!item.is_available) {
        reject({
          code: 400,
          message: '商品已下架',
          data: null
        })
        return
      }

      const totalCost = item.price * quantity

      // 检查货币是否足够
      if (item.currency_type === CurrencyType.COINS) {
        if (mockUserCoins < totalCost) {
          reject({
            code: 400,
            message: '金币不足',
            data: null
          })
          return
        }
        mockUserCoins -= totalCost
      } else {
        if (mockUserDiamonds < totalCost) {
          reject({
            code: 400,
            message: '钻石不足',
            data: null
          })
          return
        }
        mockUserDiamonds -= totalCost
      }

      // 更新用户道具背包
      const currentQuantity = mockUserItems.get(itemId) || 0
      mockUserItems.set(itemId, currentQuantity + item.quantity * quantity)

      const obtainedItems: ObtainedItem[] = [
        {
          item_id: itemId,
          item_name: item.name,
          item_type: item.item_type,
          quantity: item.quantity * quantity
        }
      ]

      resolve({
        code: 0,
        message: '购买成功',
        data: {
          success: true,
          cost_coins: item.currency_type === CurrencyType.COINS ? totalCost : 0,
          cost_diamonds: item.currency_type === CurrencyType.DIAMONDS ? totalCost : 0,
          remaining_coins: mockUserCoins,
          remaining_diamonds: mockUserDiamonds,
          obtained_items: obtainedItems
        }
      })
    }, 300)
  })
}

/**
 * 使用道具
 * @param params 使用道具参数
 * @returns 使用结果
 */
export function useItem(params: UseItemParams): Promise<ApiResponse<UseItemResult>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const quantity = mockUserItems.get(params.user_item_id) || 0

      if (quantity <= 0) {
        reject({
          code: 400,
          message: '道具数量不足',
          data: null
        })
        return
      }

      // 扣减道具数量
      mockUserItems.set(params.user_item_id, quantity - 1)

      // 根据场景返回不同的效果数据
      let effectData: Record<string, unknown> | undefined

      if (params.scene === 'answer') {
        effectData = {
          excluded_options: ['B', 'D'], // 排除的选项
          remaining_options: ['A', 'C']
        }
      } else if (params.scene === 'level') {
        effectData = {
          health_restored: 1,
          current_health: 3
        }
      }

      resolve({
        code: 0,
        message: '使用成功',
        data: {
          success: true,
          remaining_quantity: quantity - 1,
          effect_data: effectData
        }
      })
    }, 200)
  })
}
