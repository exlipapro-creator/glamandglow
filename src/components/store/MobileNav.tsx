import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../store/cart'

export default function MobileNav() {
  const totalItems = useCart((s) => s.totalItems())
  const openCart = useCart((s) => s.openCart)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-md border-t border-charcoal-800/10">
      <div className="grid grid-cols-4 h-16">
        <NavItem to="/" icon={<Home size={20} />} label="Home" />
        <NavItem to="/shop" icon={<Search size={20} />} label="Shop" />
        <button
          className="flex flex-col items-center justify-center gap-1 relative"
          onClick={openCart}
        >
          <div className="relative">
            <ShoppingBag size={20} className="text-charcoal-800" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-bronze-500 text-charcoal-900 text-2xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-2xs text-charcoal-800/60">Bag</span>
        </button>
        <NavItem to="/ops" icon={<User size={20} />} label="Admin" />
      </div>
    </nav>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 transition-colors ${
          isActive ? 'text-bronze-600' : 'text-charcoal-800/60'
        }`
      }
    >
      {icon}
      <span className="text-2xs">{label}</span>
    </NavLink>
  )
}
