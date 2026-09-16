export type Rarity = 'blue' | 'purple' | 'pink' | 'red' | 'gold';

export interface FoodItem {
  id: string;
  name: string;
  category: 'Cơm' | 'Bún / Phở' | 'Mì / Hủ Tiếu' | 'Bánh Mì / Cuốn' | 'Món Nước' | 'Ăn Nhanh / Fastfood' | 'Lẩu / Nướng & Ăn Sang';
  priceVnd: number;
  priceDisplay: string;
  rarity: Rarity;
  condition: 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'StatTrak™';
  calories: number;
  description: string;
  image: string;
  tags: string[];
  spicyLevel: number; // 0 - 3
  isCustom?: boolean;
}

export interface CrateTheme {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
  minPrice: number;
  maxPrice: number;
  featuredCategories?: string[];
  crateImage: string;
}

export interface DropHistoryItem {
  id: string;
  food: FoodItem;
  timestamp: number;
  userName: string;
}

export interface BudgetPreset {
  id: string;
  label: string;
  subLabel: string;
  min: number;
  max: number;
  icon: string;
}
