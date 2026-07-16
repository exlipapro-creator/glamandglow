import { useEffect, useState } from 'react'
import { Plus, Search, X, Edit2, Trash2, Eye, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/config'
import type { Product, Collection } from '../../types'

const CATEGORIES = ['Fragrance', 'Makeup', 'Skincare', 'Sets']
const EMPTY_PRODUCT = {
  slug: '',
  name: '',
  brand: 'Glam & Glow',
  category: 'Fragrance',
  collection_id: '',
  short_description: '',
  description: '',
  notes: '',
  volume: '',
  price: 0,
  compare_at_price: '',
  images: [''],
  rating: 5,
  review_count: 0,
  badges: [] as string[],
  is_published: true,
  sort_order: 0,
}

export default function OpsProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY_PRODUCT)

  useEffect(() => {
    fetchProducts()
    supabase.from('collections').select('*').order('sort_order').then(({ data }) => {
      setCollections(data as Collection[])
    })
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*, collections(*)').order('sort_order')
    setProducts(data as Product[])
    setLoading(false)
  }

  function startEdit(product: Product) {
    setForm({
      ...product,
      collection_id: product.collection_id || '',
      compare_at_price: product.compare_at_price?.toString() || '',
      images: product.images.length ? product.images : [''],
    })
    setEditing(product)
    setCreating(false)
  }

  function startCreate() {
    setForm(EMPTY_PRODUCT)
    setCreating(true)
    setEditing(null)
  }

  function closePanel() {
    setEditing(null)
    setCreating(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: form.name,
      brand: form.brand,
      category: form.category,
      collection_id: form.collection_id || null,
      short_description: form.short_description,
      description: form.description,
      notes: form.notes,
      volume: form.volume,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      images: form.images.filter(Boolean),
      rating: Number(form.rating),
      review_count: Number(form.review_count),
      badges: form.badges,
      is_published: form.is_published,
      sort_order: Number(form.sort_order),
    }

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if (error) { alert(error.message); return }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { alert(error.message); return }
    }
    closePanel()
    fetchProducts()
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) { alert(error.message); return }
    fetchProducts()
  }

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-1">Products</h1>
          <p className="text-sm text-charcoal-800/50">{products.length} products</p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-800/30" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-charcoal-800/10 text-sm outline-none focus:border-charcoal-800 transition-colors"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-cream-50 p-4 flex gap-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-24 object-cover bg-cream-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="label-sm">{product.brand}</p>
              <h3 className="font-serif text-sm font-medium text-charcoal-800 leading-snug mb-1 truncate">{product.name}</h3>
              <p className="text-xs text-charcoal-800/50 mb-2">{product.category} · {product.volume}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-xs text-charcoal-800/40 line-through">{formatPrice(product.compare_at_price)}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(product)} className="text-charcoal-800/40 hover:text-charcoal-800 transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(product)} className="text-charcoal-800/40 hover:text-error-500 transition-colors">
                  <Trash2 size={15} />
                </button>
                {!product.is_published && (
                  <span className="badge bg-cream-200 text-charcoal-800/50">Draft</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-sm text-charcoal-800/40 py-12">No products found.</p>
      )}

      {/* Edit/Create panel */}
      {(editing || creating) && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={closePanel} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-cream-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <h2 className="font-serif text-lg font-semibold">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closePanel}><X size={22} className="text-charcoal-800/60" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              <FormField label="Name *">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxe" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Brand *">
                  <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-luxe" />
                </FormField>
                <FormField label="Category *">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-luxe">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Collection">
                <select value={form.collection_id} onChange={(e) => setForm({ ...form, collection_id: e.target.value })} className="input-luxe">
                  <option value="">None</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Short Description">
                <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="input-luxe" />
              </FormField>
              <FormField label="Full Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxe min-h-[80px] resize-none" />
              </FormField>
              <FormField label="Fragrance Notes">
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxe" />
              </FormField>
              <FormField label="Volume / Size">
                <input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className="input-luxe" placeholder="50ml Eau de Parfum" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price (TZS) *">
                  <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-luxe" />
                </FormField>
                <FormField label="Compare-at Price">
                  <input type="number" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className="input-luxe" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Rating (1-5)">
                  <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input-luxe" />
                </FormField>
                <FormField label="Review Count">
                  <input type="number" value={form.review_count} onChange={(e) => setForm({ ...form, review_count: Number(e.target.value) })} className="input-luxe" />
                </FormField>
              </div>

              {/* Images */}
              <FormField label="Image URLs">
                <div className="space-y-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={img}
                        onChange={(e) => {
                          const images = [...form.images]
                          images[i] = e.target.value
                          setForm({ ...form, images })
                        }}
                        className="input-luxe"
                        placeholder="https://images.pexels.com/..."
                      />
                      {form.images.length > 1 && (
                        <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}>
                          <X size={18} className="text-charcoal-800/40" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({ ...form, images: [...form.images, ''] })} className="text-xs text-bronze-600 hover:underline">
                    + Add another image
                  </button>
                </div>
              </FormField>

              {/* Badges */}
              <FormField label="Badges">
                <div className="flex flex-wrap gap-2">
                  {['Best Seller', 'New', 'Sale', 'Premium', 'Set'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        const badges = form.badges.includes(b)
                          ? form.badges.filter(x => x !== b)
                          : [...form.badges, b]
                        setForm({ ...form, badges })
                      }}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        form.badges.includes(b) ? 'bg-charcoal-800 text-cream-50' : 'bg-cream-200 text-charcoal-800/60'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Sort Order">
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="input-luxe" />
                </FormField>
                <FormField label="Published">
                  <label className="flex items-center gap-2 py-3">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="accent-charcoal-800 w-4 h-4"
                    />
                    <span className="text-sm text-charcoal-800">Visible on storefront</span>
                  </label>
                </FormField>
              </div>

              <div className="flex gap-3 pt-4 border-t border-charcoal-800/10">
                <button type="button" onClick={closePanel} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-sm block mb-2">{label}</label>
      {children}
    </div>
  )
}
