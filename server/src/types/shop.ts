export interface ShopItem {
  id: number;
  itemType: number;
  itemName: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  effect: string;
  stock: number;
  dailyLimit: number;
  status: number;
  sortOrder: number;
  createTime: Date;
  updateTime: Date;
}

export interface BuyItemInput {
  itemId: number;
  quantity?: number;
}

export interface BuyItemResult {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  remainingStars: number;
}

export interface UserItem {
  id: number;
  userId: number;
  itemId: number;
  quantity: number;
  createTime: Date;
  updateTime: Date;
}

export interface ItemUsageRecord {
  id: number;
  userId: number;
  itemId: number;
  usageType: number;
  usageTime: Date;
}
