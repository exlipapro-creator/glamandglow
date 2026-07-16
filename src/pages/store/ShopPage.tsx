import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Product, Collection } from '../../types'
import { fetchProducts, fetchCollections } from '../../lib/data'
import ProductCard from '../../components/store/ProductCard'

const CATEGORIES = ['Fragrance', 'Makeup', 'Skincare', 'Sets']
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const searchQuery = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || ''
  const selectedCollection = searchParams.get('collection') || ''
  const sortBy = searchParams.get('sort') || 'featured'

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCollections()])
      .then(([p, c]) => {
        setProducts(p)
        setCollections(c)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q)
      )
    }
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }
    if (selectedCollection) {
      result = result.filter(p => p.collections?.slug === selectedCollection)
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      default: result.sort((a, b) => a.sort_order - b.sort_order)
    }
    return result
  }, [products, searchQuery, selectedCategory, selectedCollection, sortBy])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  const hasFilters = selectedCategory || selectedCollection || searchQuery

  if (loading) {
    return (
      <div className="container-luxe py-12">
        <div className="skeleton h-12 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/5] w-full mb-4" />
              <div className="skeleton h-4 w-1/3 mb-2" />
              <div className="skeleton h-4 w-2/3 mb-2" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="label-sm mb-3">All Products</p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal-800">Shop</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <FilterContent
            categories={CATEGORIES}
            collections={collections}
            selectedCategory={selectedCategory}
            selectedCollection={selectedCollection}
            onCategoryChange={(v) => updateParam('category', v)}
            onCollectionChange={(v) => updateParam('collection', v)}
            onClear={clearFilters}
            hasFilters={!!hasFilters}
          />
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-charcoal-800/10">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-charcoal-800"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
              <span className="text-sm text-charcoal-800/50">{filtered.length} products</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer font-medium text-charcoal-800"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <Chip label={`Search: "${searchQuery}"`} onRemove={() => updateParam('q', '')} />
              )}
              {selectedCategory && (
                <Chip label={selectedCategory} onRemove={() => updateParam('category', '')} />
              )}
              {selectedCollection && (
                <Chip label={collections.find(c => c.slug === selectedCollection)?.name || ''} onRemove={() => updateParam('collection', '')} />
              )}
              <button onClick={clearFilters} className="text-xs text-charcoal-800/50 hover:text-charcoal-800 underline">
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-charcoal-800 mb-2">No products found</p>
              <p className="text-sm text-charcoal-800/50">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-cream-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <h3 className="font-serif text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={22} className="text-charcoal-800" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent
                categories={CATEGORIES}
                collections={collections}
                selectedCategory={selectedCategory}
                selectedCollection={selectedCollection}
                onCategoryChange={(v) => updateParam('category', v)}
                onCollectionChange={(v) => updateParam('collection', v)}
                onClear={clearFilters}
                hasFilters={!!hasFilters}
              />
            </div>
            <div className="p-5 border-t border-charcoal-800/10">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full">
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-cream-200 px-3 py-1.5 text-xs font-medium text-charcoal-800">
      {label}
      <button onClick={onRemove}><X size={13} /></button>
    </span>
  )
}

function FilterContent({
  categories, collections, selectedCategory, selectedCollection,
  onCategoryChange, onCollectionChange, onClear, hasFilters,
}: {
  categories: string[]
  collections: Collection[]
  selectedCategory: string
  selectedCollection: string
  onCategoryChange: (v: string) => void
  onCollectionChange: (v: string) => void
  onClear: () => void
  hasFilters: boolean
}) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="label-sm mb-4">Category</h4>
        <ul className="space-y-2.5">
          <li>
            <button
              className={`text-sm transition-colors ${!selectedCategory ? 'text-bronze-600 font-medium' : 'text-charcoal-800/70 hover:text-charcoal-800'}`}
              onClick={() => onCategoryChange('')}
            >
              All Categories
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat}>
              <button
                className={`text-sm transition-colors ${selectedCategory === cat ? 'text-bronze-600 font-medium' : 'text-charcoal-800/70 hover:text-charcoal-800'}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="label-sm mb-4">Collection</h4>
        <ul className="space-y-2.5">
          <li>
            <button
              className={`text-sm transition-colors ${!selectedCollection ? 'text-bronze-600 font-medium' : 'text-charcoal-800/70 hover:text-charcoal-800'}`}
              onClick={() => onCollectionChange('')}
            >
              All Collections
            </button>
          </li>
          {collections.map(col => (
            <li key={col.id}>
              <button
                className={`text-sm transition-colors ${selectedCollection === col.slug ? 'text-bronze-600 font-medium' : 'text-charcoal-800/70 hover:text-charcoal-800'}`}
                onClick={() => onCollectionChange(col.slug)}
              >
                {col.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {hasFilters && (
        <button onClick={onClear} className="text-sm text-charcoal-800/50 hover:text-charcoal-800 underline">
          Clear all filters
        </button>
      )}
    </div>
  )
}
