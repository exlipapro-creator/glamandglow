import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Collection, Product } from '../../types'
import { fetchCollectionBySlug, fetchProductsByCollection } from '../../lib/data'
import ProductCard from '../../components/store/ProductCard'

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchCollectionBySlug(slug)
      .then(async (col) => {
        setCollection(col)
        if (col) {
          const prods = await fetchProductsByCollection(col.id)
          setProducts(prods)
        } else {
          setProducts([])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div>
        <div className="skeleton h-[50vh] w-full" />
        <div className="container-luxe py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/5] w-full mb-4" />
                <div className="skeleton h-4 w-1/3 mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-serif text-2xl text-charcoal-800 mb-4">Collection not found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Hero banner */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={collection.hero_image_url}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide pb-12 md:pb-16">
            <p className="label-sm text-cream-50/70 mb-3 animate-fade-up">{collection.tagline}</p>
            <h1 className="font-serif text-4xl md:text-6xl text-cream-50 font-semibold mb-4 animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              {collection.name}
            </h1>
            <p className="text-cream-50/80 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-wide py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-charcoal-800/50">{products.length} products</p>
          <Link to="/shop" className="text-sm font-medium text-charcoal-800 hover:text-bronze-600 transition-colors flex items-center gap-1.5">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-charcoal-800/50">No products in this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
