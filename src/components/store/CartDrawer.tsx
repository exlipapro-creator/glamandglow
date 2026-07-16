import { Link } from 'react-router-dom'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../../store/cart'
import { formatPrice, DELIVERY_FEE } from '../../lib/config'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()
  const total = subtotal()
  const freeShippingThreshold = 200000
  const remaining = Math.max(0, freeShippingThreshold - total)
  const progress = Math.min(100, (total / freeShippingThreshold) * 100)

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[70] bg-charcoal-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-cream-50 shadow-2xl flex flex-col transition-transform duration-400 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-charcoal-800" />
            <h2 className="font-serif text-lg font-semibold">Shopping Bag</h2>
            <span className="text-sm text-charcoal-800/40">({items.length})</span>
          </div>
          <button onClick={closeCart} className="text-charcoal-800/60 hover:text-charcoal-800 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-5 py-4 bg-cream-100 border-b border-charcoal-800/5">
            {remaining > 0 ? (
              <p className="text-xs text-charcoal-800/70 mb-2">
                Add <span className="font-medium text-charcoal-800">{formatPrice(remaining)} TZS</span> for free delivery
              </p>
            ) : (
              <p className="text-xs text-success-500 font-medium mb-2">You've unlocked free delivery!</p>
            )}
            <div className="h-1.5 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-bronze-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag size={48} className="text-charcoal-800/20 mb-4" />
              <p className="font-serif text-lg text-charcoal-800 mb-2">Your bag is empty</p>
              <p className="text-sm text-charcoal-800/50 mb-6">Discover our curated collections</p>
              <Link to="/shop" onClick={closeCart} className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-charcoal-800/5">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-5">
                  <Link to={`/products/${item.product.slug}`} onClick={closeCart} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover bg-cream-100"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="label-sm mb-0.5">{item.product.brand}</p>
                    <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                      <h4 className="font-serif text-sm font-medium text-charcoal-800 hover:text-bronze-600 transition-colors leading-snug mb-1">
                        {item.product.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-charcoal-800/50 mb-3">{item.product.volume}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-charcoal-800/15">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-800 hover:bg-cream-100 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-800 hover:bg-cream-100 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-charcoal-800">
                          {formatPrice(item.product.price * item.quantity)} TZS
                        </p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-2xs text-charcoal-800/40 hover:text-error-500 transition-colors mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-charcoal-800/10 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-800/60">Subtotal</span>
              <span className="font-medium text-charcoal-800">{formatPrice(total)} TZS</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-800/60">Delivery</span>
              <span className="text-charcoal-800/60">
                {total >= freeShippingThreshold ? 'Free' : `${formatPrice(DELIVERY_FEE)} TZS`}
              </span>
            </div>
            <div className="flex items-center justify-between text-base pt-2 border-t border-charcoal-800/5">
              <span className="font-serif font-semibold">Total</span>
              <span className="font-serif font-semibold">
                {formatPrice(total + (total >= freeShippingThreshold ? 0 : DELIVERY_FEE))} TZS
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
