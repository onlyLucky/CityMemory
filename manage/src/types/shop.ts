export interface ShopItem {
  id: string
  itemName: string
  itemType: 'ticket' | 'prop'
  price: number
  quantity: number
  icon: string
  description: string
  status: number
  sort: number
  createdAt: string
  updatedAt: string
}

export interface ShopQuery {
  page: number
  pageSize: number
  itemType?: string
  status?: number
}

export interface ShopCreate {
  itemName: string
  itemType: 'ticket' | 'prop'
  price: number
  quantity: number
  icon: string
  description: string
  status: number
  sort: number
}

export interface ShopUpdate {
  id: string
  itemName?: string
  itemType?: 'ticket' | 'prop'
  price?: number
  quantity?: number
  icon?: string
  description?: string
  status?: number
  sort?: number
}
