import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Check, Package, Truck, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Order } from '../../types'
import { formatPrice, CONTACT } from '../../lib/config'

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) return
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error(error)
        setOrder(data as Order | null)
        setLoading(false)
      })
  }, [orderNumber])

  if (loading) {
    return (
      <div className="container-luxe py-20">
        <div className="skeleton h-20 w-20 mx-auto rounded-full mb-6" />
        <div className="skeleton h-8 w-1/2 mx-auto mb-4" />
        <div className="skeleton h-6 w-1/3 mx-auto" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-serif text-2xl text-charcoal-800 mb-4">Order not found</h1>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="container-luxe py-12 md:py-16 max-w-2xl">
      {/* Success header */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-success-500 flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-cream-50" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-800 mb-3">
          Order Confirmed
        </h1>
        <p className="text-charcoal-800/60 mb-2">Thank you, {order.customer_name}!</p>
        <p className="text-sm text-charcoal-800/50">
          Your order number is <span className="font-mono font-medium text-charcoal-800">{order.order_number}</span>
        </p>
      </div>

      {/* Order status tracker */}
      <div className="bg-cream-100 p-6 md:p-8 mb-8">
        <h2 className="font-serif text-lg font-semibold mb-6">What happens next?</h2>
        <div className="space-y-5">
          <StatusStep
            icon={<Check size={18} />}
            title="Order Placed"
            desc={`We've received your order on ${new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            done
          />
          <StatusStep
            icon={<Clock size={18} />}
            title="Processing"
            desc="We'll confirm your order via WhatsApp or phone call within 2 hours."
          />
          <StatusStep
            icon={<Package size={18} />}
            title="Packed & Shipped"
            desc="Your products are carefully packed and dispatched for delivery."
          />
          <StatusStep
            icon={<Truck size={18} />}
            title="Delivered"
            desc={`Delivery to ${order.delivery_area}. Cash on delivery available.`}
          />
        </div>
      </div>

      {/* Order details */}
      <div className="border border-charcoal-800/10 p-6 md:p-8 mb-8">
        <h2 className="font-serif text-lg font-semibold mb-4">Order Details</h2>
        <div className="space-y-3 mb-6">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-charcoal-800">{item.product_name}</p>
                <p className="text-xs text-charcoal-800/50">{formatPrice(item.price)} TZS × {item.quantity}</p>
              </div>
              <span className="font-medium">{formatPrice(item.subtotal)} TZS</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-4 border-t border-charcoal-800/10 text-sm">
          <div className="flex justify-between">
            <span className="text-charcoal-800/60">Subtotal</span>
            <span>{formatPrice(order.items_total)} TZS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-800/60">Delivery</span>
            <span>{order.delivery_fee === 0 ? 'Free' : `${formatPrice(order.delivery_fee)} TZS`}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-charcoal-800/10">
            <span className="font-serif font-semibold">Total</span>
            <span className="font-serif font-semibold">{formatPrice(order.grand_total)} TZS</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
        <div className="p-5 bg-cream-100">
          <p className="label-sm mb-2">Delivery To</p>
          <p className="font-medium text-charcoal-800">{order.customer_name}</p>
          <p className="text-charcoal-800/60">{order.delivery_area}</p>
          <p className="text-charcoal-800/60">{order.delivery_address}</p>
        </div>
        <div className="p-5 bg-cream-100">
          <p className="label-sm mb-2">Payment</p>
          <p className="font-medium text-charcoal-800">{order.payment_method}</p>
          <p className="text-charcoal-800/60 mt-1">{order.customer_phone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi! I'm following up on my order ${order.order_number}`)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary flex-1"
        >
          Contact Us on WhatsApp
        </a>
        <Link to="/shop" className="btn-primary flex-1">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

function StatusStep({ icon, title, desc, done }: { icon: React.ReactNode; title: string; desc: string; done?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-success-500 text-cream-50' : 'bg-cream-200 text-charcoal-800/40'
      }`}>
        {icon}
      </div>
      <div>
        <h4 className={`text-sm font-medium mb-0.5 ${done ? 'text-charcoal-800' : 'text-charcoal-800/50'}`}>{title}</h4>
        <p className="text-xs text-charcoal-800/50 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
