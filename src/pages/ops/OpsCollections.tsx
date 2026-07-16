import { useEffect, useState } from 'react'
import { Plus, X, Edit2, Trash2, Eye } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Collection } from '../../types'

const EMPTY = {
  slug: '',
  name: '',
  tagline: '',
  description: '',
  hero_image_url: '',
  sort_order: 0,
  is_published: true,
}

export default function OpsCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Collection | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY)

  useEffect(() => { fetchCollections() }, [])

  async function fetchCollections() {
    setLoading(true)
    const { data } = await supabase.from('collections').select('*').order('sort_order')
    setCollections(data as Collection[])
    setLoading(false)
  }

  function startEdit(c: Collection) {
    setForm({ ...c })
    setEditing(c)
    setCreating(false)
  }
  function startCreate() {
    setForm(EMPTY)
    setCreating(true)
    setEditing(null)
  }
  function close() { setEditing(null); setCreating(false) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      hero_image_url: form.hero_image_url,
      sort_order: Number(form.sort_order),
      is_published: form.is_published,
    }
    if (editing) {
      const { error } = await supabase.from('collections').update(payload).eq('id', editing.id)
      if (error) { alert(error.message); return }
    } else {
      const { error } = await supabase.from('collections').insert(payload)
      if (error) { alert(error.message); return }
    }
    close()
    fetchCollections()
  }

  async function handleDelete(c: Collection) {
    if (!confirm(`Delete "${c.name}"? Products in this collection will be unlinked.`)) return
    const { error } = await supabase.from('collections').delete().eq('id', c.id)
    if (error) { alert(error.message); return }
    fetchCollections()
  }

  if (loading) {
    return <div><div className="skeleton h-10 w-48 mb-8" /><div className="skeleton h-32 w-full mb-4" /><div className="skeleton h-32 w-full" /></div>
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-1">Collections</h1>
          <p className="text-sm text-charcoal-800/50">{collections.length} collections</p>
        </div>
        <button onClick={startCreate} className="btn-primary"><Plus size={18} /> Add Collection</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map(c => (
          <div key={c.id} className="bg-cream-50 flex gap-4 overflow-hidden">
            <img src={c.hero_image_url} alt={c.name} className="w-32 h-40 object-cover flex-shrink-0" />
            <div className="flex-1 p-4 flex flex-col">
              <p className="label-sm mb-1">{c.tagline}</p>
              <h3 className="font-serif text-lg font-semibold text-charcoal-800 mb-1">{c.name}</h3>
              <p className="text-xs text-charcoal-800/50 line-clamp-2 flex-1">{c.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => startEdit(c)} className="text-charcoal-800/40 hover:text-charcoal-800"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(c)} className="text-charcoal-800/40 hover:text-error-500"><Trash2 size={15} /></button>
                {!c.is_published && <span className="badge bg-cream-200 text-charcoal-800/50">Draft</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {collections.length === 0 && <p className="text-center text-sm text-charcoal-800/40 py-12">No collections yet.</p>}

      {(editing || creating) && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={close} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-cream-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <h2 className="font-serif text-lg font-semibold">{editing ? 'Edit Collection' : 'New Collection'}</h2>
              <button onClick={close}><X size={22} className="text-charcoal-800/60" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <label className="label-sm block mb-2">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxe" />
              </div>
              <div>
                <label className="label-sm block mb-2">Tagline</label>
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input-luxe" placeholder="Arabic luxury fragrances" />
              </div>
              <div>
                <label className="label-sm block mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxe min-h-[100px] resize-none" />
              </div>
              <div>
                <label className="label-sm block mb-2">Hero Image URL</label>
                <input value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} className="input-luxe" placeholder="https://images.pexels.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-sm block mb-2">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="input-luxe" />
                </div>
                <div>
                  <label className="label-sm block mb-2">Published</label>
                  <label className="flex items-center gap-2 py-3">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="accent-charcoal-800 w-4 h-4" />
                    <span className="text-sm text-charcoal-800">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-charcoal-800/10">
                <button type="button" onClick={close} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
