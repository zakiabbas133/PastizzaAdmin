export interface DealItem {
  id: string;
  menuItemId: string;
  menuItemVariantId?: string | null;
  quantity: number;
  displayOrder: number;
  menuItemName?: string | null;
  menuItemVariantName?: string | null;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
  startTime?: string | null;
  endTime?: string | null;
  dealItems: DealItem[];
}
