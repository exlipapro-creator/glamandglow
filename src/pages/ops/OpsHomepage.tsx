import { useEffect, useState } from 'react'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Campaign, Testimonial } from '../../types'

const EMPTY_CAMPAIGN = {
  slug: '', title: '', subtitle: '', body: '', hero_image_url: '',
  cta_label: 'Discover More', cta_link: '/shop', sort_order: 0, is_active: true,
}
const EMPTY_TESTIMONIAL = {
  name: '', location: '', rating: 5, quote: '', product_name: '', sort_order: 0, is_published: true,
}

export default function OpsHomepage() {
  const [tab, setTab] = useState<'campaigns' | 'testimonials'>('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [creatingCampaign, setCreatingCampaign] = useState(false)
  const [campaignForm, setCampaignForm] = useState(EMPTY_CAMPAIGN)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [creatingTestimonial, setCreatingTestimonial] = useState(false)
  const [testimonialForm, setTestimonialForm] = useState(EMPTY_TESTIMONIAL)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [c, t] = await Promise.all([
      supabase.from('campaigns').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
    ])
    setCampaigns(c.data as Campaign[])
    setTestimonials(t.data as Testimonial[])
    setLoading(false)
  }

  // Campaign handlers
  function startEditCampaign(c: Campaign) {
    setCampaignForm({ ...c })
    setEditingCampaign(c)
    setCreatingCampaign(false)
  }
  function startCreateCampaign() {
    setCampaignForm(EMPTY_CAMPAIGN)
    setCreatingCampaign(true)
    setEditingCampaign(null)
  }
  async function submitCampaign(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      ...campaignForm,
      slug: campaignForm.slug || campaignForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      sort_order: Number(campaignForm.sort_order),
    }
    if (editingCampaign) {
      const { error } = await supabase.from('campaigns').update(payload).eq('id', editingCampaign.id)
      if (error) { alert(error.message); return }
    } else {
      const { error } = await supabase.from('campaigns').insert(payload)
      if (error) { alert(error.message); return }
    }
    setEditingCampaign(null); setCreatingCampaign(false)
    fetchAll()
  }
  async function deleteCampaign(c: Campaign) {
    if (!confirm(`Delete campaign "${c.title}"?`)) return
    await supabase.from('campaigns').delete().eq('id', c.id)
    fetchAll()
  }

  // Testimonial handlers
  function startEditTestimonial(t: Testimonial) {
    setTestimonialForm({ ...t })
    setEditingTestimonial(t)
    setCreatingTestimonial(false)
  }
  function startCreateTestimonial() {
    setTestimonialForm(EMPTY_TESTIMONIAL)
    setCreatingTestimonial(true)
    setEditingTestimonial(null)
  }
  async function submitTestimonial(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...testimonialForm, rating: Number(testimonialForm.rating), sort_order: Number(testimonialForm.sort_order) }
    if (editingTestimonial) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id)
      if (error) { alert(error.message); return }
    } else {
      const { error } = await supabase.from('testimonials').insert(payload)
      if (error) { alert(error.message); return }
    }
    setEditingTestimonial(null); setCreatingTestimonial(false)
    fetchAll()
  }
  async function deleteTestimonial(t: Testimonial) {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return
    await supabase.from('testimonials').delete().eq('id', t.id)
    fetchAll()
  }

  if (loading) {
    return <div><div className="skeleton h-10 w-48 mb-8" /><div className="skeleton h-32 w-full" /></div>
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-2">Homepage Content</h1>
      <p className="text-sm text-charcoal-800/50 mb-8">Manage campaigns and testimonials</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-charcoal-800/10">
        <button
          onClick={() => setTab('campaigns')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${tab === 'campaigns' ? 'text-charcoal-800 border-b-2 border-charcoal-800' : 'text-charcoal-800/40'}`}
        >
          Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setTab('testimonials')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${tab === 'testimonials' ? 'text-charcoal-800 border-b-2 border-charcoal-800' : 'text-charcoal-800/40'}`}
        >
          Testimonials ({testimonials.length})
        </button>
      </div>

      {tab === 'campaigns' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={startCreateCampaign} className="btn-primary"><Plus size={18} /> Add Campaign</button>
          </div>
          <div className="space-y-4">
            {campaigns.map(c => (
              <div key={c.id} className="bg-cream-50 flex gap-4 overflow-hidden">
                <img src={c.hero_image_url} alt={c.title} className="w-32 h-32 object-cover flex-shrink-0" />
                <div className="flex-1 p-4">
                  <p className="label-sm mb-1">{c.subtitle}</p>
                  <h3 className="font-serif text-lg font-semibold text-charcoal-800 mb-1">{c.title}</h3>
                  <p className="text-xs text-charcoal-800/50 line-clamp-1 mb-2">{c.body}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-charcoal-800/40">CTA: {c.cta_label} → {c.cta_link}</span>
                    <button onClick={() => startEditCampaign(c)} className="text-charcoal-800/40 hover:text-charcoal-800"><Edit2 size={15} /></button>
                    <button onClick={() => deleteCampaign(c)} className="text-charcoal-800/40 hover:text-error-500"><Trash2 size={15} /></button>
                    {!c.is_active && <span className="badge bg-cream-200 text-charcoal-800/50">Inactive</span>}
                  </div>
                </div>
              </div>
            ))}
            {campaigns.length === 0 && <p className="text-center text-sm text-charcoal-800/40 py-12">No campaigns yet.</p>}
          </div>
        </div>
      )}

      {tab === 'testimonials' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={startCreateTestimonial} className="btn-primary"><Plus size={18} /> Add Testimonial</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t.id} className="bg-cream-50 p-5">
                <p className="text-sm text-charcoal-800/70 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">{t.name}</p>
                    <p className="text-xs text-charcoal-800/50">{t.location} · {t.product_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => <span key={i} className="text-bronze-500 text-xs">★</span>)}
                    </div>
                    <button onClick={() => startEditTestimonial(t)} className="text-charcoal-800/40 hover:text-charcoal-800"><Edit2 size={15} /></button>
                    <button onClick={() => deleteTestimonial(t)} className="text-charcoal-800/40 hover:text-error-500"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-center text-sm text-charcoal-800/40 py-12">No testimonials yet.</p>}
          </div>
        </div>
      )}

      {/* Campaign drawer */}
      {(editingCampaign || creatingCampaign) && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => { setEditingCampaign(null); setCreatingCampaign(false) }} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-cream-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <h2 className="font-serif text-lg font-semibold">{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</h2>
              <button onClick={() => { setEditingCampaign(null); setCreatingCampaign(false) }}><X size={22} className="text-charcoal-800/60" /></button>
            </div>
            <form onSubmit={submitCampaign} className="flex-1 overflow-y-auto p-5 space-y-5">
              <Field label="Title *"><input required value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} className="input-luxe" /></Field>
              <Field label="Subtitle"><input value={campaignForm.subtitle} onChange={(e) => setCampaignForm({ ...campaignForm, subtitle: e.target.value })} className="input-luxe" /></Field>
              <Field label="Body"><textarea value={campaignForm.body} onChange={(e) => setCampaignForm({ ...campaignForm, body: e.target.value })} className="input-luxe min-h-[80px] resize-none" /></Field>
              <Field label="Hero Image URL"><input value={campaignForm.hero_image_url} onChange={(e) => setCampaignForm({ ...campaignForm, hero_image_url: e.target.value })} className="input-luxe" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA Label"><input value={campaignForm.cta_label} onChange={(e) => setCampaignForm({ ...campaignForm, cta_label: e.target.value })} className="input-luxe" /></Field>
                <Field label="CTA Link"><input value={campaignForm.cta_link} onChange={(e) => setCampaignForm({ ...campaignForm, cta_link: e.target.value })} className="input-luxe" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sort Order"><input type="number" value={campaignForm.sort_order} onChange={(e) => setCampaignForm({ ...campaignForm, sort_order: Number(e.target.value) })} className="input-luxe" /></Field>
                <Field label="Active"><label className="flex items-center gap-2 py-3"><input type="checkbox" checked={campaignForm.is_active} onChange={(e) => setCampaignForm({ ...campaignForm, is_active: e.target.checked })} className="accent-charcoal-800 w-4 h-4" /><span className="text-sm">Show on homepage</span></label></Field>
              </div>
              <div className="flex gap-3 pt-4 border-t border-charcoal-800/10">
                <button type="button" onClick={() => { setEditingCampaign(null); setCreatingCampaign(false) }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingCampaign ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial drawer */}
      {(editingTestimonial || creatingTestimonial) && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => { setEditingTestimonial(null); setCreatingTestimonial(false) }} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-cream-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-800/10">
              <h2 className="font-serif text-lg font-semibold">{editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => { setEditingTestimonial(null); setCreatingTestimonial(false) }}><X size={22} className="text-charcoal-800/60" /></button>
            </div>
            <form onSubmit={submitTestimonial} className="flex-1 overflow-y-auto p-5 space-y-5">
              <Field label="Customer Name *"><input required value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} className="input-luxe" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Location"><input value={testimonialForm.location} onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })} className="input-luxe" /></Field>
                <Field label="Rating (1-5)"><input type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} className="input-luxe" /></Field>
              </div>
              <Field label="Quote *"><textarea required value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} className="input-luxe min-h-[100px] resize-none" /></Field>
              <Field label="Product Name"><input value={testimonialForm.product_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, product_name: e.target.value })} className="input-luxe" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sort Order"><input type="number" value={testimonialForm.sort_order} onChange={(e) => setTestimonialForm({ ...testimonialForm, sort_order: Number(e.target.value) })} className="input-luxe" /></Field>
                <Field label="Published"><label className="flex items-center gap-2 py-3"><input type="checkbox" checked={testimonialForm.is_published} onChange={(e) => setTestimonialForm({ ...testimonialForm, is_published: e.target.checked })} className="accent-charcoal-800 w-4 h-4" /><span className="text-sm">Show</span></label></Field>
              </div>
              <div className="flex gap-3 pt-4 border-t border-charcoal-800/10">
                <button type="button" onClick={() => { setEditingTestimonial(null); setCreatingTestimonial(false) }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingTestimonial ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="label-sm block mb-2">{label}</label>{children}</div>
}
