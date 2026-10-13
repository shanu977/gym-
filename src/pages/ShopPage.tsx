import { useMemo, useState } from 'react'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageWrap } from '../components/PageShell'
import { ProductCategories, ProductFilters, ProductSearch, ProductSort, FilterButton, type ShopFilters } from '../components/ShopControls'
import { categories, defaultFilters } from '../data/shopData'
import { ProductGrid } from '../components/ProductGrid'
import { products } from '../data/siteData'
import { useCart } from '../contexts/useCart'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const { totalUnits } = useCart()

  const search = params.get('q') ?? ''
  const category = params.get('category') && categories.includes(params.get('category') as never)
    ? params.get('category')!
    : 'All'
  const sort = params.get('sort') ?? 'featured'

  const [filters, setFilters] = useState<ShopFilters>(defaultFilters)
  const [filterOpen, setFilterOpen] = useState(false)
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].sort(), [])

  const setCategory = (newCat: string) => {
    const next = new URLSearchParams(params)
    if (newCat !== 'All') next.set('category', newCat)
    else next.delete('category')
    setParams(next, { replace: true })
  }

  const setSearch = (newSearch: string) => {
    const next = new URLSearchParams(params)
    if (newSearch) next.set('q', newSearch)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  const setSort = (newSort: string) => {
    const next = new URLSearchParams(params)
    if (newSort !== 'featured') next.set('sort', newSort)
    else next.delete('sort')
    setParams(next, { replace: true })
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const results = products.filter((product) => {
      const searchable = [product.name, product.brand, product.category, ...product.tags].join(' ').toLowerCase()
      return (!query || searchable.includes(query)) &&
        (category === 'All' || product.category === category) &&
        (!filters.brands.length || filters.brands.includes(product.brand)) &&
        product.price <= filters.maxPrice &&
        product.rating >= filters.minRating &&
        (filters.availability === 'All' || product.stock === filters.availability)
    })
    return [...results].sort((a, b) =>
      sort === 'best-selling' ? Number(b.bestseller) - Number(a.bestseller) || b.reviewCount - a.reviewCount :
      sort === 'rating' ? b.rating - a.rating :
      sort === 'price-low' ? a.price - b.price :
      sort === 'price-high' ? b.price - a.price :
      sort === 'newest' ? b.id.localeCompare(a.id) :
      Number(b.featured) - Number(a.featured) || b.rating - a.rating
    )
  }, [category, filters, search, sort])

  const activeFilterCount = filters.brands.length + (filters.maxPrice < 6000 ? 1 : 0) + (filters.minRating ? 1 : 0) + (filters.availability !== 'All' ? 1 : 0)
  const clearSearch = () => setSearch('')
  const clearAllFilters = () => {
    setSearch('')
    setFilters(defaultFilters)
  }

  return (
    <PageWrap>
      <section className="store-hero">
        <div>
          <span className="eyebrow">The shop / 04</span>
          <h1 className="display">Fuel Your <em>Performance.</em></h1>
          <p>Premium nutrition, supplements, training essentials and fitness gear — built around your journey.</p>
        </div>
        <Link className="cart-button" to="/cart" aria-label="View Cart">
          <ShoppingBag size={18} /> Bag / {totalUnits}
        </Link>
      </section>

      <div className="store-search-row">
        <ProductSearch value={search} onChange={setSearch} />
        {search && <button className="clear-search" type="button" onClick={clearSearch}>Clear Search</button>}
      </div>

      <ProductCategories selected={category} onChange={setCategory} />

      <div className="store-toolbar">
        <div>
          <span className="eyebrow">The edit</span>
          <p><strong>{filteredProducts.length}</strong> products</p>
        </div>
        <div className="store-toolbar-actions">
          <FilterButton onClick={() => setFilterOpen(true)} count={activeFilterCount} />
          <ProductSort value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="store-layout">
        <ProductFilters
          filters={filters}
          brands={brands}
          onChange={setFilters}
          onClear={() => setFilters(defaultFilters)}
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
        {filterOpen && <button className="filter-backdrop" aria-label="Close filters" type="button" onClick={() => setFilterOpen(false)} />}
        <main className="store-results">
          <div className="active-filters">
            {activeFilterCount > 0 && (
              <>
                <span>Active filters:</span>
                {filters.brands.map((brand) => (
                  <button key={brand} type="button" onClick={() => setFilters({ ...filters, brands: filters.brands.filter((item) => item !== brand) })}>
                    {brand} ×
                  </button>
                ))}
                {filters.minRating > 0 && (
                  <button type="button" onClick={() => setFilters({ ...filters, minRating: 0 })}>
                    {filters.minRating}+ rating ×
                  </button>
                )}
                {filters.maxPrice < 6000 && (
                  <button type="button" onClick={() => setFilters({ ...filters, maxPrice: 6000 })}>
                    ≤ ₹{filters.maxPrice.toLocaleString('en-IN')} ×
                  </button>
                )}
                {filters.availability !== 'All' && (
                  <button type="button" onClick={() => setFilters({ ...filters, availability: 'All' })}>
                    {filters.availability} ×
                  </button>
                )}
                <button type="button" onClick={() => setFilters(defaultFilters)}>Clear all</button>
              </>
            )}
          </div>
          <ProductGrid
            products={filteredProducts}
            category={category}
            onResetCategory={() => setCategory('All')}
            onClearFilters={clearAllFilters}
          />
        </main>
      </div>

      <div className="shop-note">
        <span className="eyebrow">Considered essentials</span>
        <p>Every product in the edit is selected to support the rituals that make progress sustainable.</p>
        <Link className="text-link" to="/contact">Ask the team <ArrowRight size={16} /></Link>
      </div>
    </PageWrap>
  )
}

