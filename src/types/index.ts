export type MenuCategory =
  | "pizza"
  | "pasta"
  | "burgers"
  | "fries"
  | "rolls"
  | "desserts"
  | "drinks";

export interface MenuVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: MenuCategory;
  description: string;
  image: string;
  featured?: boolean;
  popular?: boolean;
  tags?: string[];
  ingredients?: string[];
  variants: MenuVariant[];
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
