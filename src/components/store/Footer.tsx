import { Link } from 'react-router-dom'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'
import { CONTACT } from '../../lib/config'

export default function Footer() {
  return (
    <footer className="bg-charcoal-800 text-cream-100 mt-20">
      {/* Top section */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-semibold mb-4">
              Glam <span className="text-bronze-500 italic">&</span> Glow
            </h3>
            <p className="text-sm text-cream-200/70 leading-relaxed mb-6">
              Premium beauty, luxury fragrances, and editorial cosmetics. Curated for those who appreciate the extraordinary.
            </p>
            <div className="flex gap-3">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-cream-200/20 flex items-center justify-center hover:bg-bronze-500 hover:border-bronze-500 hover:text-charcoal-900 transition-all">
                <Instagram size={16} />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-cream-200/20 flex items-center justify-center hover:bg-bronze-500 hover:border-bronze-500 hover:text-charcoal-900 transition-all">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label-sm text-cream-200/40 mb-5">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">All Products</Link></li>
              <li><Link to="/collections/oud-royale" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">Fragrances</Link></li>
              <li><Link to="/collections/timeless-skin" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">Skincare</Link></li>
              <li><Link to="/collections/signature-lips" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">Makeup</Link></li>
              <li><Link to="/collections/bridal-edition" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">Bridal Edition</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="label-sm text-cream-200/40 mb-5">Customer Care</h4>
            <ul className="space-y-3">
              <li><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">WhatsApp Orders</a></li>
              <li><span className="text-sm text-cream-200/80">Delivery & Returns</span></li>
              <li><span className="text-sm text-cream-200/80">Track Your Order</span></li>
              <li><Link to="/ops" className="text-sm text-cream-200/80 hover:text-bronze-500 transition-colors">Operations Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-sm text-cream-200/40 mb-5">Visit Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-cream-200/80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-bronze-500" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream-200/80">
                <Phone size={16} className="flex-shrink-0 text-bronze-500" />
                <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-bronze-500">{CONTACT.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream-200/80">
                <Mail size={16} className="flex-shrink-0 text-bronze-500" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-bronze-500">{CONTACT.email}</a>
              </li>
            </ul>
            <p className="text-2xs text-cream-200/40 mt-4">{CONTACT.hours}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream-200/10">
        <div className="container-wide py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-2xs text-cream-200/40 tracking-wide">
            © {new Date().getFullYear()} Glam & Glow. All rights reserved.
          </p>
          <p className="text-2xs text-cream-200/40 tracking-wide">
            Dar es Salaam, Tanzania
          </p>
        </div>
      </div>
    </footer>
  )
}
