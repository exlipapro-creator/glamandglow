import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/config'
import type { Customer } from '../../types'

export default function OpsCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('customers').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setCustomers(data as Customer[])
      setLoading(false)
    })
  }, [])

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div><div className="skeleton h-10 w-48 mb-8" /><div className="skeleton h-16 w-full mb-4" /><div className="skeleton h-16 w-full" /></div>
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-2">Customers</h1>
      <p className="text-sm text-charcoal-800/50 mb-8">{customers.length} customers</p>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-800/30" />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-charcoal-800/10 text-sm outline-none focus:border-charcoal-800 transition-colors"
        />
      </div>

      <div className="hidden md:block bg-cream-50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-charcoal-800/10">
              <th className="text-left p-4 label-sm">Name</th>
              <th className="text-left p-4 label-sm">Phone</th>
              <th className="text-left p-4 label-sm">Location</th>
              <th className="text-center p-4 label-sm">Orders</th>
              <th className="text-right p-4 label-sm">Total Spent</th>
              <th className="text-left p-4 label-sm">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-charcoal-800/5 hover:bg-cream-100 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-medium text-charcoal-800">{c.name}</p>
                  {c.email && <p className="text-xs text-charcoal-800/50">{c.email}</p>}
                </td>
                <td className="p-4 text-sm text-charcoal-800/60">{c.phone}</td>
                <td className="p-4 text-sm text-charcoal-800/60">{c.location}</td>
                <td className="p-4 text-center text-sm font-medium">{c.total_orders}</td>
                <td className="p-4 text-right text-sm font-medium">{formatPrice(c.total_spent)} TZS</td>
                <td className="p-4 text-sm text-charcoal-800/50">
                  {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-sm text-charcoal-800/40 py-12">No customers found.</p>}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-cream-50 p-4">
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-charcoal-800">{c.name}</p>
                <p className="text-xs text-charcoal-800/50">{c.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatPrice(c.total_spent)} TZS</p>
                <p className="text-xs text-charcoal-800/40">{c.total_orders} orders</p>
              </div>
            </div>
            <p className="text-xs text-charcoal-800/50">{c.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
