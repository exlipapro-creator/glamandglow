import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { StoreSettings } from '../../types'

export default function OpsSettings() {
  const [settings, setSettings] = useState<StoreSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('store_settings').select('*').order('label').then(({ data }) => {
      setSettings(data as StoreSettings[])
      setLoading(false)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    for (const s of settings) {
      const { error } = await supabase.from('store_settings').update({ value: s.value }).eq('id', s.id)
      if (error) { alert(error.message); setSaving(false); return }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return <div><div className="skeleton h-10 w-48 mb-8" /><div className="skeleton h-20 w-full mb-4" /><div className="skeleton h-20 w-full" /></div>
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal-800 mb-2">Settings</h1>
      <p className="text-sm text-charcoal-800/50 mb-8">Configure store-wide options</p>

      <form onSubmit={handleSave} className="max-w-lg space-y-6">
        {settings.map(s => (
          <div key={s.id}>
            <label className="label-sm block mb-2">{s.label}</label>
            <input
              type={s.type === 'number' ? 'number' : 'text'}
              value={s.value}
              onChange={(e) => setSettings(settings.map(x => x.id === s.id ? { ...x, value: e.target.value } : x))}
              className="input-luxe"
            />
          </div>
        ))}
        {settings.length === 0 && (
          <p className="text-sm text-charcoal-800/40">No settings configured.</p>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
