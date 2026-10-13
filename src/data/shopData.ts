import type { ProductCategory, ProductStock } from '../types'
export const categories: Array<'All' | ProductCategory> = [
  'All',
  'Whey Protein',
  'Creatine',
  'Pre Workout',
  'Amino Acids',
  'Fat Loss',
  'Anabolic',
  'Health & Wellness',
  'Protein Foods',
  'Accessories',
]
export type ShopFilters = { brands: string[]; maxPrice: number; minRating: number; availability: ProductStock | 'All' }
export const defaultFilters: ShopFilters = { brands: [], maxPrice: 6000, minRating: 0, availability: 'All' }

