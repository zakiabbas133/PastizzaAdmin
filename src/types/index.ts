export type MenuCategory =
  | "pizza"
  | "pasta"
  | "burgers"
  | "fries"
  | "rolls"
  | "desserts"
  | "drinks";

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  category: string;
  categoryId: string;
  description: string;
  price: string;
  image: string;
  featured?: boolean;
  popular?: boolean;
  tags?: string[];
  ingredients?: string[];
  variants: MenuVariant[];
  displayOrder: number;
  isActive: boolean;
}

export interface DealItemDetail {
  id?: string;
  menuItemId?: string;
  menuItemVariantId?: string | null;
  quantity?: number;
  displayOrder?: number;
  menuItemName?: string | null;
  menuItemVariantName?: string | null;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  badge?: string;
  items: string[];
  dealItems?: DealItemDetail[];
  featured?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verified?: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  openingHours: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CategoryMeta {
  id: MenuCategory | 'all';
  label: string;
  image?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  variant: MenuVariant;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: MenuItem, variant: MenuVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
