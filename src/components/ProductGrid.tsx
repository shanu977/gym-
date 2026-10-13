import type { Product } from '../types'
import { ProductCard } from './ProductCard'
export function ProductGrid({
  products,
  category,
  onResetCategory,
  onClearFilters,
}: {
  products: Product[]
  category?: string
  onResetCategory?: () => void
  onClearFilters?: () => void
}) {
  if (products.length > 0) {
    return (
      <div className="store-product-grid">
        {products.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    )
  }

  const isSpecificCategory = category && category !== 'All'
  return (
    <div className="empty-products">
      <span className="eyebrow">{isSpecificCategory ? category : 'Nothing matched'}</span>
      <h2 className="display">
        {isSpecificCategory ? `No products in ${category}` : 'No products found'}
      </h2>
      <p>
        {isSpecificCategory
          ? `We currently don't have matching products in ${category}. Explore all categories or clear your search filters.`
          : 'Try a different search or clear your active filters to see the full edit.'}
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {isSpecificCategory && onResetCategory && (
          <button
            type="button"
            className="button-ghost"
            onClick={onResetCategory}
            style={{ fontSize: '11px', padding: '10px 18px', cursor: 'pointer' }}
          >
            Browse all categories
          </button>
        )}
        {onClearFilters && (
          <button
            type="button"
            className="button-primary"
            onClick={onClearFilters}
            style={{ fontSize: '11px', padding: '10px 18px', cursor: 'pointer' }}
          >
            Clear active filters
          </button>
        )}
      </div>
    </div>
  )
}

