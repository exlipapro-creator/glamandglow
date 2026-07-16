import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../store/cart'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const totalItems = useCart((s) => s.totalItems())
  const openCart = useCart((s) => s.openCart)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-charcoal-800 text-cream-100 text-center py-2 text-2xs tracking-[0.15em] uppercase">
        Free delivery on orders over 200,000 TZS · Cash on delivery available
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-cream-50'
      }`}>
        <div className="container-wide flex items-center justify-between h-16 md:h-20">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex items-center gap-6">
            <button
              className="md:hidden text-charcoal-800"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/shop" className="text-sm font-medium tracking-wide hover:text-bronze-600 transition-colors">
                Shop All
              </Link>
              <Link to="/collections/oud-royale" className="text-sm font-medium tracking-wide hover:text-bronze-600 transition-colors">
                Fragrances
              </Link>
              <Link to="/collections/timeless-skin" className="text-sm font-medium tracking-wide hover:text-bronze-600 transition-colors">
                Skincare
              </Link>
              <Link to="/collections/bridal-edition" className="text-sm font-medium tracking-wide hover:text-bronze-600 transition-colors">
                Bridal
              </Link>
            </nav>
          </div>

          {/* Center: logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-charcoal-800">
              Glam <span className="text-bronze-600 italic">&</span> Glow
            </span>
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-4 md:gap-5">
            <button
              className="text-charcoal-800 hover:text-bronze-600 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="relative text-charcoal-800 hover:text-bronze-600 transition-colors"
              onClick={openCart}
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-bronze-500 text-charcoal-900 text-2xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-charcoal-800/10 bg-cream-50 animate-slide-up">
            <div className="container-wide py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={20} className="text-charcoal-800/40" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fragrances, makeup, skincare..."
                  className="flex-1 bg-transparent border-none outline-none text-charcoal-800 placeholder-charcoal-800/30 text-sm"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={20} className="text-charcoal-800/40 hover:text-charcoal-800" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-cream-50 shadow-xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <span className="font-serif text-lg font-semibold">Menu</span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} className="text-charcoal-800" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-1">
              <MobileLink to="/shop" label="Shop All" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/collections/oud-royale" label="Fragrances" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/collections/summer-glow" label="Summer Glow" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/collections/signature-lips" label="Lips" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/collections/timeless-skin" label="Skincare" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/collections/bridal-edition" label="Bridal Edition" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/collections/mens-collection" label="Men's Collection" onClick={() => setMenuOpen(false)} />
              <div className="pt-4 mt-4 border-t border-charcoal-800/10">
                <Link to="/ops" className="text-sm text-charcoal-800/50 hover:text-bronze-600" onClick={() => setMenuOpen(false)}>
                  Operations Center →
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block py-3 text-base font-medium text-charcoal-800 hover:text-bronze-600 transition-colors border-b border-charcoal-800/5"
    >
      {label}
    </Link>
  )
}
