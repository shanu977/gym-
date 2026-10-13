export const CART_STORAGE_KEY = 'iron-peak-cart'
export const getVariantId = (variants: Record<string, string>) => Object.entries(variants).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `${name}:${value}`).join('|') || 'default'
