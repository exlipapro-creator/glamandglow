import { useEffect, useState } from 'react'
import { Search, X, Eye, Phone, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice, CONTACT } from '../../lib/config'
import type { Order } from '../../types'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OpsOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    setOrders(data as Order[])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) { console.error(error); return }
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status })
  }

  const filtered = orders.filter(o => {
    if (filterStatus && o.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return o.customer_name.toLowerCase().includes(q) ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_phone.includes(search)
    }
    return true
  })

  if (loading) {
    return (
      <div>
        <div className="skeleton h-10 w-48 mb-8" />
        <div className="skeleton h-16 w-full mb-4" />
        <div className="skeleton h-16 w-full mb-4" />
        <div className="skeleton h-16 w-full" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-2">Orders</h1>
      <p className="text-sm text-charcoal-800/50 mb-8">{orders.length} total orders</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-800/30" />
          <input
            type="text"
            placeholder="Search by name, order number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-charcoal-800/10 text-sm outline-none focus:border-charcoal-800 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${!filterStatus ? 'bg-charcoal-800 text-cream-50' : 'bg-cream-50 text-charcoal-800/60 hover:text-charcoal-800'}`}
          >
            All
          </button>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-charcoal-800 text-cream-50' : 'bg-cream-50 text-charcoal-800/60 hover:text-charcoal-800'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table — desktop */}
      <div className="hidden md:block bg-cream-50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-charcoal-800/10">
              <th className="text-left p-4 label-sm">Order</th>
              <th className="text-left p-4 label-sm">Customer</th>
              <th className="text-left p-4 label-sm">Date</th>
              <th className="text-right p-4 label-sm">Total</th>
              <th className="text-center p-4 label-sm">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b border-charcoal-800/5 hover:bg-cream-100 transition-colors">
                <td className="p-4">
                  <p className="font-mono text-sm font-medium text-charcoal-800">{order.order_number}</p>
                  <p className="text-xs text-charcoal-800/40">{order.order_items?.length || 0} items</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-charcoal-800">{order.customer_name}</p>
                  <p className="text-xs text-charcoal-800/50">{order.customer_phone}</p>
                </td>
                <td className="p-4 text-sm text-charcoal-800/60">
                  {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-4 text-right text-sm font-medium">{formatPrice(order.grand_total)} TZS</td>
                <td className="p-4 text-center">
                  <StatusSelect
                    status={order.status}
                    onChange={(v) => updateStatus(order.id, v)}
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-charcoal-800/40 hover:text-charcoal-800 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-charcoal-800/40 py-12">No orders found.</p>
        )}
      </div>

      {/* Orders cards — mobile */}
      <div className="md:hidden space-y-4">
        {filtered.map(order => (
          <div key={order.id} className="bg-cream-50 p-4" onClick={() => setSelectedOrder(order)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-sm font-medium text-charcoal-800">{order.order_number}</p>
                <p className="text-sm text-charcoal-800/60">{order.customer_name}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(order.grand_total)} TZS</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-charcoal-800/40">
                {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
              <StatusSelect status={order.status} onChange={(v) => updateStatus(order.id, v)} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-charcoal-800/40 py-12">No orders found.</p>
        )}
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-cream-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <div>
                <h2 className="font-serif text-lg font-semibold">Order Details</h2>
                <p className="font-mono text-xs text-charcoal-800/50">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}><X size={22} className="text-charcoal-800/60" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Status */}
              <div>
                <p className="label-sm mb-2">Status</p>
                <StatusSelect status={selectedOrder.status} onChange={(v) => updateStatus(selectedOrder.id, v)} />
              </div>

              {/* Customer */}
              <div>
                <p className="label-sm mb-2">Customer</p>
                <p className="text-sm font-medium text-charcoal-800">{selectedOrder.customer_name}</p>
                <p className="flex items-center gap-2 text-sm text-charcoal-800/60 mt-1">
                  <Phone size={13} /> {selectedOrder.customer_phone}
                </p>
                {selectedOrder.customer_email && (
                  <p className="text-sm text-charcoal-800/60">{selectedOrder.customer_email}</p>
                )}
              </div>

              {/* Delivery */}
              <div>
                <p className="label-sm mb-2">Delivery</p>
                <p className="flex items-start gap-2 text-sm text-charcoal-800/60">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{selectedOrder.delivery_address}, {selectedOrder.delivery_area}</span>
                </p>
                {selectedOrder.notes && (
                  <p className="text-sm text-charcoal-800/60 mt-2 p-3 bg-cream-100">Note: {selectedOrder.notes}</p>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="label-sm mb-3">Items</p>
                <div className="space-y-2">
                  {selectedOrder.order_items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-2 border-b border-charcoal-800/5">
                      <div>
                        <p className="font-medium text-charcoal-800">{item.product_name}</p>
                        <p className="text-xs text-charcoal-800/50">{formatPrice(item.price)} TZS × {item.quantity}</p>
                      </div>
                      <span className="font-medium">{formatPrice(item.subtotal)} TZS</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-800/60">Subtotal</span>
                  <span>{formatPrice(selectedOrder.items_total)} TZS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-800/60">Delivery</span>
                  <span>{selectedOrder.delivery_fee === 0 ? 'Free' : `${formatPrice(selectedOrder.delivery_fee)} TZS`}</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-charcoal-800/10">
                  <span className="font-serif font-semibold">Grand Total</span>
                  <span className="font-serif font-semibold">{formatPrice(selectedOrder.grand_total)} TZS</span>
                </div>
                <p className="text-xs text-charcoal-800/40 pt-2">Payment: {selectedOrder.payment_method}</p>
              </div>

              <a
                href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi ${selectedOrder.customer_name}, regarding your order ${selectedOrder.order_number}...`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full"
              >
                Contact Customer on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusSelect({ status, onChange }: { status: string; onChange: (v: string) => void }) {
  const colors: Record<string, string> = {
    'Pending': 'text-warning-600',
    'Processing': 'text-bronze-600',
    'Shipped': 'text-sage-600',
    'Delivered': 'text-success-500',
    'Cancelled': 'text-error-600',
  }
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-medium bg-transparent border-none outline-none cursor-pointer ${colors[status] || 'text-charcoal-800'}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
