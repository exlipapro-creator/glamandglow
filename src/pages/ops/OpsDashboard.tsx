import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/config'

interface Stats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalCustomers: number
  recentOrders: any[]
  topProducts: any[]
}

export default function OpsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('id, status, grand_total, created_at, customer_name, order_number'),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('order_items').select('product_name, quantity, subtotal'),
    ]).then(([ordersRes, customersRes, itemsRes]) => {
      const orders = ordersRes.data || []
      const items = itemsRes.data || []
      const revenue = orders.reduce((sum, o) => sum + (o.grand_total || 0), 0)
      const pending = orders.filter(o => o.status === 'Pending').length

      // Top products by quantity
      const productMap: Record<string, { name: string; qty: number; revenue: number }> = {}
      items.forEach((i: any) => {
        if (!productMap[i.product_name]) productMap[i.product_name] = { name: i.product_name, qty: 0, revenue: 0 }
        productMap[i.product_name].qty += i.quantity
        productMap[i.product_name].revenue += i.subtotal
      })
      const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5)

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        totalRevenue: revenue,
        totalCustomers: customersRes.count || 0,
        recentOrders: orders.slice(0, 5),
        topProducts,
      })
      setLoading(false)
    }).catch(console.error)
  }, [])

  if (loading || !stats) {
    return (
      <div>
        <div className="skeleton h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-2">Dashboard</h1>
      <p className="text-sm text-charcoal-800/50 mb-8">Overview of your store performance</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package size={20} />}
          label="Total Orders"
          value={stats.totalOrders.toString()}
          link="/ops/orders"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Pending Orders"
          value={stats.pendingOrders.toString()}
          link="/ops/orders"
          highlight={stats.pendingOrders > 0}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Revenue"
          value={`${formatPrice(stats.totalRevenue)} TZS`}
        />
        <StatCard
          icon={<Users size={20} />}
          label="Customers"
          value={stats.totalCustomers.toString()}
          link="/ops/customers"
        />
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-cream-50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg font-semibold">Recent Orders</h2>
            <Link to="/ops/orders" className="text-xs text-charcoal-800/50 hover:text-bronze-600 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-charcoal-800/40 py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to="/ops/orders"
                  className="flex items-center justify-between py-3 border-b border-charcoal-800/5 last:border-0 hover:bg-cream-100 -mx-2 px-2 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">{order.customer_name}</p>
                    <p className="text-xs text-charcoal-800/50">{order.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.grand_total)} TZS</p>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-cream-50 p-6">
          <h2 className="font-serif text-lg font-semibold mb-5">Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-charcoal-800/40 py-8 text-center">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 py-3 border-b border-charcoal-800/5 last:border-0">
                  <span className="w-6 h-6 rounded-full bg-bronze-500/20 text-bronze-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-medium text-charcoal-800 truncate">{p.name}</p>
                  <div className="text-right">
                    <p className="text-sm font-medium">{p.qty} sold</p>
                    <p className="text-xs text-charcoal-800/50">{formatPrice(p.revenue)} TZS</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, link, highlight }: { icon: React.ReactNode; label: string; value: string; link?: string; highlight?: boolean }) {
  const content = (
    <div className={`p-5 bg-cream-50 transition-all ${link ? 'hover:shadow-md cursor-pointer' : ''} ${highlight ? 'ring-1 ring-warning-500/30' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-bronze-500/15 text-bronze-600 flex items-center justify-center">
          {icon}
        </div>
        <p className="label-sm">{label}</p>
      </div>
      <p className="font-serif text-2xl font-semibold text-charcoal-800">{value}</p>
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Pending': 'bg-warning-500/15 text-warning-600',
    'Processing': 'bg-bronze-500/15 text-bronze-600',
    'Shipped': 'bg-sage-500/15 text-sage-600',
    'Delivered': 'bg-success-500/15 text-success-500',
    'Cancelled': 'bg-error-500/15 text-error-600',
  }
  return (
    <span className={`badge ${colors[status] || 'bg-cream-200 text-charcoal-800/60'}`}>{status}</span>
  )
}
