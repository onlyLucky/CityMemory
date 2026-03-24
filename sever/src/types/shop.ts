export interface IShopItem {
  id: string;
  itemName: string;
  itemType: string;
  price: number;
  quantity: number;
  icon?: string;
  description?: string;
}

export interface IBuyItemResult {
  itemId: string;
  itemName: string;
  quantity: number;
  remainingStars: number;
  tickets: {
    adventureTickets: number;
    randomTickets: number;
  };
}
