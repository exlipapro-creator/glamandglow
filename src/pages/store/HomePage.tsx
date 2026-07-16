import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight, Quote } from 'lucide-react'
import type { Campaign, Collection, Product, Testimonial } from '../../types'
import {
  fetchCampaigns, fetchCollections, fetchNewArrivals,
  fetchBestSellers, fetchTestimonials,
} from '../../lib/data'
import ProductCard from '../../components/store/ProductCard'

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchCampaigns(),
      fetchCollections(),
      fetchNewArrivals(4),
      fetchBestSellers(4),
      fetchTestimonials(),
    ])
      .then(([c, col, na, bs, t]) => {
        setCampaigns(c)
        setCollections(col)
        setNewArrivals(na)
        setBestSellers(bs)
        setTestimonials(t)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container-luxe py-20">
        <div className="skeleton h-[60vh] w-full mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/5] w-full mb-4" />
              <div className="skeleton h-4 w-1/3 mb-2" />
              <div className="skeleton h-4 w-2/3 mb-2" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Hero — featured campaign */}
      {campaigns[0] && (
        <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
          <img
            src={campaigns[0].hero_image_url}
            alt={campaigns[0].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-wide pb-16 md:pb-24">
              <p className="label-sm text-cream-50/70 mb-3 animate-fade-up">{campaigns[0].subtitle}</p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream-50 font-semibold leading-[1.1] max-w-2xl mb-4 text-balance animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                {campaigns[0].title}
              </h1>
              <p className="text-base md:text-lg text-cream-50/80 max-w-xl mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                {campaigns[0].body}
              </p>
              <Link
                to={campaigns[0].cta_link}
                className="inline-flex items-center gap-2 bg-cream-50 text-charcoal-800 px-8 py-4 text-sm font-medium tracking-wide hover:bg-bronze-500 hover:text-charcoal-900 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: '300ms', animationFillMode: 'both' }}
              >
                {campaigns[0].cta_label}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Collections grid */}
      <section className="container-wide py-20">
        <div className="text-center mb-12">
          <p className="label-sm mb-3">Explore</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-800">Curated Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.slice(0, 6).map((col, i) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-cream-100 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <img
                src={col.hero_image_url}
                alt={col.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="label-sm text-cream-50/60 mb-1">{col.tagline}</p>
                <h3 className="font-serif text-2xl text-cream-50 font-semibold mb-2">{col.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-sm text-cream-50/80 group-hover:text-bronze-500 transition-colors">
                  Discover <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label-sm mb-3">Just In</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-800">New Arrivals</h2>
              </div>
              <Link to="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-800 hover:text-bronze-600 transition-colors">
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secondary campaign banner */}
      {campaigns[1] && (
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={campaigns[1].hero_image_url}
            alt={campaigns[1].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-wide">
              <div className="max-w-lg">
                <p className="label-sm text-cream-50/70 mb-3">{campaigns[1].subtitle}</p>
                <h2 className="font-serif text-3xl md:text-5xl text-cream-50 font-semibold mb-4 text-balance">
                  {campaigns[1].title}
                </h2>
                <p className="text-cream-50/80 mb-6 leading-relaxed">{campaigns[1].body}</p>
                <Link
                  to={campaigns[1].cta_link}
                  className="inline-flex items-center gap-2 border border-cream-50/40 text-cream-50 px-6 py-3 text-sm font-medium tracking-wide hover:bg-cream-50 hover:text-charcoal-800 transition-all duration-300"
                >
                  {campaigns[1].cta_label}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Best sellers */}
      {bestSellers.length > 0 && (
        <section className="container-wide py-20">
          <div className="text-center mb-12">
            <p className="label-sm mb-3">Loved by You</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal-800">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-charcoal-800 py-20">
          <div className="container-wide">
            <div className="text-center mb-12">
              <p className="label-sm text-cream-200/40 mb-3">Client Stories</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream-50">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="bg-charcoal-700/50 p-8 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                >
                  <Quote size={28} className="text-bronze-500 mb-4" />
                  <p className="text-cream-100/90 leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-cream-50">{t.name}</p>
                      <p className="text-xs text-cream-200/50">{t.location}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} size={14} className="fill-bronze-500 text-bronze-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-cream-200/40 mt-3 pt-3 border-t border-cream-200/10">
                    Purchased: {t.product_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Third campaign as CTA */}
          {campaigns[2] && (
            <div className="container-wide mt-16">
              <Link
                to={campaigns[2].cta_link}
                className="relative block h-[300px] overflow-hidden group"
              >
                <img
                  src={campaigns[2].hero_image_url}
                  alt={campaigns[2].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <p className="label-sm text-cream-50/70 mb-2">{campaigns[2].subtitle}</p>
                  <h3 className="font-serif text-3xl text-cream-50 font-semibold mb-3">{campaigns[2].title}</h3>
                  <span className="inline-flex items-center gap-2 text-cream-50/80 group-hover:text-bronze-500 transition-colors">
                    {campaigns[2].cta_label} <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
