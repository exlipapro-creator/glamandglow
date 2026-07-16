import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, X, ArrowLeft, Check } from 'lucide-react'
import { useCart } from '../../store/cart'
import { formatPrice, DELIVERY_FEE, DELIVERY_AREAS, CONTACT } from '../../lib/config'
import { createOrder } from '../../lib/data'

const FREE_SHIPPING_THRESHOLD = 200000

export default function CheckoutPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart()
  const navigate = useNavigate()
  const total = subtotal()
  const deliveryFee = total >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE
  const grandTotal = total + deliveryFee

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_area: DELIVERY_AREAS[0],
    delivery_address: '',
    notes: '',
    payment_method: 'Cash on Delivery',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)

    try {
      const order = await createOrder(
        {
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email || null,
          delivery_area: form.delivery_area,
          delivery_address: form.delivery_address,
          notes: form.notes || null,
          items_total: total,
          delivery_fee: deliveryFee,
          grand_total: grandTotal,
          payment_method: form.payment_method,
        },
        items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        }))
      )
      clear()
      navigate(`/order/${order.order_number}`)
    } catch (err) {
      setError('Something went wrong placing your order. Please try again or order via WhatsApp.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-serif text-2xl text-charcoal-800 mb-4">Your bag is empty</h1>
        <p className="text-sm text-charcoal-800/50 mb-6">Add some products before checking out.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-luxe py-8 md:py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-charcoal-800/60 hover:text-charcoal-800 mb-6 transition-colors">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact */}
          <section>
            <h2 className="font-serif text-xl font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-sm block mb-2">Full Name *</label>
                <input
                  required
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="input-luxe"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="label-sm block mb-2">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  className="input-luxe"
                  placeholder="+255 7XX XXX XXX"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-sm block mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  className="input-luxe"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-serif text-xl font-semibold mb-4">Delivery</h2>
            <div className="space-y-4">
              <div>
                <label className="label-sm block mb-2">Delivery Area *</label>
                <select
                  value={form.delivery_area}
                  onChange={(e) => setForm({ ...form, delivery_area: e.target.value })}
                  className="input-luxe cursor-pointer"
                >
                  {DELIVERY_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-sm block mb-2">Delivery Address *</label>
                <textarea
                  required
                  value={form.delivery_address}
                  onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                  className="input-luxe min-h-[80px] resize-none"
                  placeholder="Street name, building, apartment number, landmark..."
                />
              </div>
              <div>
                <label className="label-sm block mb-2">Order Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input-luxe min-h-[60px] resize-none"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-serif text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {['Cash on Delivery', 'Mobile Money (M-Pesa)', 'Bank Transfer'].map(method => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                    form.payment_method === method
                      ? 'border-charcoal-800 bg-cream-100'
                      : 'border-charcoal-800/15 hover:border-charcoal-800/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={form.payment_method === method}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="accent-charcoal-800"
                  />
                  <span className="text-sm font-medium text-charcoal-800">{method}</span>
                </label>
              ))}
            </div>
          </section>

          {error && (
            <div className="p-4 bg-error-500/10 border border-error-500/20 text-sm text-error-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? 'Placing Order...' : `Place Order — ${formatPrice(grandTotal)} TZS`}
          </button>
        </form>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-cream-100 p-6">
            <h2 className="font-serif text-lg font-semibold mb-4">Order Summary</h2>
            <div className="divide-y divide-charcoal-800/5 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 py-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover bg-cream-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="label-sm">{item.product.brand}</p>
                    <h4 className="font-serif text-sm font-medium text-charcoal-800 leading-snug mb-1">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-charcoal-800/15"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-charcoal-800/15"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id)} className="text-charcoal-800/30 hover:text-error-500">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-charcoal-800/10">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-800/60">Subtotal</span>
                <span className="font-medium">{formatPrice(total)} TZS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-800/60">Delivery</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? <span className="text-success-500">Free</span> : `${formatPrice(deliveryFee)} TZS`}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-charcoal-800/10">
                <span className="font-serif font-semibold">Total</span>
                <span className="font-serif font-semibold">{formatPrice(grandTotal)} TZS</span>
              </div>
            </div>
          </div>

          <a
            href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi! I'd like to order:\n${items.map(i => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)} TZS`).join('\n')}\n\nTotal: ${formatPrice(grandTotal)} TZS`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 mt-4 text-sm text-charcoal-800/60 hover:text-bronze-600 transition-colors"
          >
            <Check size={15} /> Or order via WhatsApp instead
          </a>
        </aside>
      </div>
    </div>
  )
}
