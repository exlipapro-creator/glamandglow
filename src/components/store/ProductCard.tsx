import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice } from '../../lib/config'
import { useCart } from '../../store/cart'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCart((s) => s.addItem)
  const hasSale = product.compare_at_price && product.compare_at_price > product.price
  const discount = hasSale
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms`, animationFillMode: 'both' }}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-100 mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasSale && (
              <span className="badge bg-charcoal-800 text-cream-50">-{discount}%</span>
            )}
            {product.badges.includes('New') && (
              <span className="badge bg-bronze-500 text-charcoal-900">New</span>
            )}
            {product.badges.includes('Premium') && (
              <span className="badge bg-cream-50 text-charcoal-800 border border-charcoal-800/15">Premium</span>
            )}
          </div>
          {/* Quick add */}
          <button
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
            className="absolute bottom-0 left-0 right-0 bg-charcoal-800/95 text-cream-50 py-3 text-sm font-medium tracking-wide translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            Quick Add
          </button>
        </div>
      </Link>

      {/* Info */}
      <div>
        <p className="label-sm mb-1">{product.brand}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-serif text-base font-medium text-charcoal-800 hover:text-bronze-600 transition-colors leading-snug mb-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-2">
          <Star size={13} className="fill-bronze-500 text-bronze-500" />
          <span className="text-xs text-charcoal-800/60">{product.rating} ({product.review_count})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-charcoal-800">{formatPrice(product.price)} TZS</span>
          {hasSale && (
            <span className="text-xs text-charcoal-800/40 line-through">{formatPrice(product.compare_at_price!)} TZS</span>
          )}
        </div>
      </div>
    </div>
  )
}
