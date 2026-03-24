import type { ShopItem, ShopCreate, ShopUpdate, PageResult } from '@/types/shop'

const mockShopItems: ShopItem[] = [
  {
    id: 'S001',
    itemName: '闯关门票×5',
    itemType: 'ticket',
    price: 100,
    quantity: 5,
    icon: 'https://example.com/ticket.png',
    description: '购买5张闯关门票',
    status: 1,
    sort: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-24T00:00:00Z'
  },
  {
    id: 'S002',
    itemName: '随机门票×1',
    itemType: 'ticket',
    price: 50,
    quantity: 1,
    icon: 'https://example.com/random-ticket.png',
    description: '购买1张随机门票',
    status: 1,
    sort: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-24T00:00:00Z'
  },
  {
    id: 'S003',
    itemName: '选项排除',
    itemType: 'prop',
    price: 30,
    quantity: 1,
    icon: 'https://example.com/prop1.png',
    description: '排除一个错误选项',
    status: 1,
    sort: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-24T00:00:00Z'
  },
  {
    id: 'S004',
    itemName: '题目跳过',
    itemType: 'prop',
    price: 50,
    quantity: 1,
    icon: 'https://example.com/prop2.png',
    description: '直接跳过当前题目',
    status: 1,
    sort: 4,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-24T00:00:00Z'
  },
  {
    id: 'S005',
    itemName: '血瓶',
    itemType: 'prop',
    price: 20,
    quantity: 1,
    icon: 'https://example.com/prop3.png',
    description: '恢复1点生命值',
    status: 1,
    sort: 5,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-24T00:00:00Z'
  }
]

export const shopApi = {
  getList(params: { page: number; pageSize: number; itemType?: 'ticket' | 'prop'; status?: number }) {
    return new Promise<PageResult<ShopItem>>((resolve) => {
      setTimeout(() => {
        let filteredList = [...mockShopItems]

        if (params.itemType) {
          filteredList = filteredList.filter(item => item.itemType === params.itemType)
        }
        if (params.status !== undefined) {
          filteredList = filteredList.filter(item => item.status === params.status)
        }

        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const list = filteredList.slice(start, end)

        resolve({
          list,
          total: filteredList.length,
          page: params.page,
          pageSize: params.pageSize
        })
      }, 500)
    })
  },

  create(data: ShopCreate) {
    return new Promise<ShopItem>((resolve) => {
      setTimeout(() => {
        const newItem: ShopItem = {
          id: `S${String(mockShopItems.length + 1).padStart(3, '0')}`,
          itemName: data.itemName!,
          itemType: data.itemType!,
          price: data.price!,
          quantity: data.quantity!,
          icon: data.icon || '',
          description: data.description || '',
          status: 1,
          sort: mockShopItems.length + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockShopItems.push(newItem)
        resolve(newItem)
      }, 500)
    })
  },

  update(data: ShopUpdate) {
    return new Promise<ShopItem>((resolve) => {
      setTimeout(() => {
        const index = mockShopItems.findIndex(item => item.id === data.id)
        if (index !== -1) {
          mockShopItems[index] = { ...mockShopItems[index], ...data, updatedAt: new Date().toISOString() }
          resolve(mockShopItems[index])
        }
      }, 500)
    })
  },

  delete(id: string) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = mockShopItems.findIndex(item => item.id === id)
        if (index !== -1) {
          mockShopItems.splice(index, 1)
        }
        resolve()
      }, 300)
    })
  }
}
