import { Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, Home, Users, Settings, ArrowLeft } from 'lucide-react'

const navItems = [
  { to: '/ops', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ops/orders', label: 'Orders', icon: Package },
  { to: '/ops/products', label: 'Products', icon: FolderTree },
  { to: '/ops/collections', label: 'Collections', icon: FolderTree },
  { to: '/ops/homepage', label: 'Homepage', icon: Home },
  { to: '/ops/customers', label: 'Customers', icon: Users },
  { to: '/ops/settings', label: 'Settings', icon: Settings },
]

export default function OpsLayout() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-charcoal-800 text-cream-100 flex-col">
        <div className="p-6 border-b border-cream-200/10">
          <Link to="/" className="block">
            <h1 className="font-serif text-xl font-semibold">
              Glam <span className="text-bronze-500 italic">&</span> Glow
            </h1>
            <p className="text-2xs text-cream-200/40 tracking-wider uppercase mt-1">Operations Center</p>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm ${
                  isActive ? 'bg-cream-200/10 text-bronze-500' : 'text-cream-200/60 hover:text-cream-100 hover:bg-cream-200/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-cream-200/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-cream-200/60 hover:text-cream-100 transition-colors">
            <ArrowLeft size={18} />
            Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-charcoal-800 text-cream-100 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="font-serif text-lg font-semibold">Glam & Glow</Link>
        <Link to="/" className="text-xs text-cream-200/60">Store →</Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden bg-charcoal-700 px-2 py-2 flex gap-1 overflow-x-auto no-scrollbar sticky top-[57px] z-30">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-shrink-0 px-3 py-2 text-xs font-medium transition-colors rounded-sm whitespace-nowrap ${
                isActive ? 'bg-cream-200/10 text-bronze-500' : 'text-cream-200/60'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-5 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
