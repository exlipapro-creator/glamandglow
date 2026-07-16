import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Minus, Plus, ShoppingBag, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react'
import type { Product } from '../../types'
import { fetchProductBySlug, fetchRelatedProducts } from '../../lib/data'
import { useCart } from '../../store/cart'
import { formatPrice, CONTACT } from '../../lib/config'
import ProductCard from '../../components/store/ProductCard'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImage(0)
    setQuantity(1)
    setAdded(false)
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p)
        if (p) fetchRelatedProducts(p).then(setRelated).catch(console.error)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const handleAdd = () => {
    if (product) {
      addItem(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="container-luxe py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square w-full" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-serif text-2xl text-charcoal-800 mb-4">Product not found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const hasSale = product.compare_at_price && product.compare_at_price > product.price
  const discount = hasSale
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="container-wide py-4">
        <nav className="flex items-center gap-2 text-xs text-charcoal-800/50">
          <Link to="/" className="hover:text-charcoal-800">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-charcoal-800">Shop</Link>
          {product.collections && (
            <>
              <ChevronRight size={12} />
              <Link to={`/collections/${product.collections.slug}`} className="hover:text-charcoal-800">
                {product.collections.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-charcoal-800 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product main */}
      <section className="container-wide pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden bg-cream-100 mb-4">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 overflow-hidden bg-cream-100 transition-all ${
                      activeImage === i ? 'ring-2 ring-charcoal-800' : 'ring-1 ring-charcoal-800/10 hover:ring-charcoal-800/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:py-4">
            <p className="label-sm mb-2">{product.brand}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-800 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating) ? 'fill-bronze-500 text-bronze-500' : 'text-cream-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-charcoal-800/60">{product.rating} ({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-serif font-semibold text-charcoal-800">{formatPrice(product.price)} TZS</span>
              {hasSale && (
                <>
                  <span className="text-lg text-charcoal-800/40 line-through">{formatPrice(product.compare_at_price!)} TZS</span>
                  <span className="badge bg-error-500 text-cream-50">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-charcoal-800/70 leading-relaxed mb-6">{product.short_description}</p>

            {/* Volume */}
            <div className="mb-6">
              <p className="label-sm mb-1">Volume / Size</p>
              <p className="text-sm text-charcoal-800">{product.volume}</p>
            </div>

            {/* Notes */}
            {product.notes && (
              <div className="mb-6 p-4 bg-cream-100 border-l-2 border-bronze-500">
                <p className="label-sm mb-1">Fragrance Notes</p>
                <p className="text-sm text-charcoal-800/70">{product.notes}</p>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-charcoal-800/15">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-charcoal-800 hover:bg-cream-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-charcoal-800 hover:bg-cream-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`btn-primary flex-1 transition-all ${added ? 'bg-success-500' : ''}`}
              >
                {added ? (
                  <>Added to Bag!</>
                ) : (
                  <><ShoppingBag size={16} /> Add to Bag — {formatPrice(product.price * quantity)} TZS</>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-charcoal-800/10">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-bronze-600 mb-2" />
                <p className="text-2xs text-charcoal-800/60">Free delivery over 200,000 TZS</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="mx-auto text-bronze-600 mb-2" />
                <p className="text-2xs text-charcoal-800/60">100% authentic products</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-bronze-600 mb-2" />
                <p className="text-2xs text-charcoal-800/60">7-day returns</p>
              </div>
            </div>

            {/* WhatsApp order */}
            <a
              href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi! I'd like to order: ${product.name} (${formatPrice(product.price)} TZS)`)}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm text-charcoal-800/60 hover:text-bronze-600 transition-colors mt-6"
            >
              Or order via WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Full description */}
      <section className="bg-cream-100 py-16">
        <div className="container-luxe max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-charcoal-800 mb-6">Product Details</h2>
          <p className="text-charcoal-800/70 leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="container-wide py-16">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
