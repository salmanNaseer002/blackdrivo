"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Globe, MapPin, Check, X, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DEFAULT_COUNTRIES, type Country, type City } from "@/lib/data/locations";

interface DBCountry {
  id: string
  name: string
  code: string
  flag: string
  phone_code: string
  phone_format: string
  phone_placeholder: string
  currency: string
  is_active: boolean
  created_at: string
}

interface DBCity {
  id: string
  country_id: string
  name: string
  code: string
  is_active: boolean
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

export default function LocationsPage() {
  const supabase = createClient()

  const [countries,    setCountries]    = useState<DBCountry[]>([])
  const [cities,       setCities]       = useState<DBCity[]>([])
  const [selCountryId, setSelCountryId] = useState<string | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)

  // Add country form
  const [addCountryOpen, setAddCountryOpen] = useState(false)
  const [countryForm, setCountryForm] = useState({ name: "", code: "", flag: "", phone_code: "", phone_format: "", phone_placeholder: "", currency: "" })

  // Add city form
  const [addCityOpen, setAddCityOpen] = useState(false)
  const [cityForm, setCityForm]       = useState({ name: "", code: "" })

  // Edit country
  const [editCountry, setEditCountry] = useState<DBCountry | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: cs }, { data: cts }] = await Promise.all([
      supabase.from("countries_config" as any).select("*").order("name"),
      supabase.from("cities_config" as any).select("*").order("name"),
    ])
    // If no DB data, seed from defaults
    if (!cs || cs.length === 0) {
      await seedDefaults()
      return
    }
    setCountries((cs as DBCountry[]) || [])
    setCities((cts as DBCity[]) || [])
    if (cs && cs.length > 0 && !selCountryId) setSelCountryId((cs as DBCountry[])[0]?.id)
    setLoading(false)
  }

  const seedDefaults = async () => {
    for (const c of DEFAULT_COUNTRIES) {
      const { data: cRow } = await (supabase.from("countries_config" as any) as any).insert({
        name: c.name, code: c.code, flag: c.flag,
        phone_code: c.phoneCode, phone_format: c.phoneFormat,
        phone_placeholder: c.phonePlaceholder, currency: c.currency,
        is_active: true,
      }).select().single()
      if (cRow) {
        for (const city of c.cities) {
          await (supabase.from("cities_config" as any) as any).insert({
            country_id: (cRow as any).id, name: city.name, code: city.code, is_active: true,
          })
        }
      }
    }
    fetchAll()
  }

  const addCountry = async () => {
    if (!countryForm.name || !countryForm.code || !countryForm.currency) {
      toast.error("Name, code, and currency are required")
      return
    }
    setSaving(true)
    const { error } = await (supabase.from("countries_config" as any) as any).insert({ ...countryForm, is_active: true })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success("Country added!")
    setAddCountryOpen(false)
    setCountryForm({ name: "", code: "", flag: "", phone_code: "", phone_format: "", phone_placeholder: "", currency: "" })
    fetchAll()
  }

  const updateCountry = async () => {
    if (!editCountry) return
    setSaving(true)
    const { error } = await (supabase.from("countries_config" as any) as any).update({
      name: editCountry.name, flag: editCountry.flag, phone_code: editCountry.phone_code,
      phone_format: editCountry.phone_format, phone_placeholder: editCountry.phone_placeholder,
      currency: editCountry.currency, is_active: editCountry.is_active,
    }).eq("id", editCountry.id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success("Country updated!")
    setEditCountry(null)
    fetchAll()
  }

  const deleteCountry = async (id: string) => {
    if (!confirm("Delete this country and all its cities?")) return
    await (supabase.from("cities_config" as any) as any).delete().eq("country_id", id)
    await (supabase.from("countries_config" as any) as any).delete().eq("id", id)
    toast.success("Country deleted")
    fetchAll()
  }

  const addCity = async () => {
    if (!selCountryId || !cityForm.name || !cityForm.code) {
      toast.error("City name and code are required")
      return
    }
    setSaving(true)
    const { error } = await (supabase.from("cities_config" as any) as any).insert({
      country_id: selCountryId, name: cityForm.name, code: cityForm.code.toUpperCase(), is_active: true,
    })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success("City added!")
    setAddCityOpen(false)
    setCityForm({ name: "", code: "" })
    fetchAll()
  }

  const deleteCity = async (id: string) => {
    await (supabase.from("cities_config" as any) as any).delete().eq("id", id)
    toast.success("City removed")
    fetchAll()
  }

  const toggleCity = async (id: string, active: boolean) => {
    await (supabase.from("cities_config" as any) as any).update({ is_active: !active }).eq("id", id)
    fetchAll()
  }

  const selCountry   = countries.find(c => c.id === selCountryId)
  const selCities    = cities.filter(c => c.country_id === selCountryId)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#0b66d1]" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Countries & Cities</h1>
          <p className="mt-1 text-sm text-gray-500">Manage service locations shown in the driver registration form</p>
        </div>
        <button onClick={() => setAddCountryOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8]">
          <Plus className="h-4 w-4" /> Add Country
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Countries list */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <p className="text-sm font-semibold text-gray-900">Countries ({countries.length})</p>
          </div>
          <div className="divide-y divide-gray-100">
            {countries.map(c => (
              <button
                key={c.id}
                onClick={() => setSelCountryId(c.id)}
                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-gray-50 ${selCountryId === c.id ? "bg-blue-50" : ""}`}
              >
                <span className="text-2xl">{c.flag || "🌍"}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${selCountryId === c.id ? "text-[#0b66d1]" : "text-gray-900"}`}>{c.name}</p>
                  <p className="text-xs text-gray-400">{c.code} · {c.phone_code} · {c.currency}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                  {c.is_active ? "Active" : "Off"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected country detail */}
        <div className="space-y-5">
          {selCountry && (
            <>
              {/* Country info */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                {editCountry?.id === selCountry.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "Name",         key: "name",             ph: "United States" },
                        { label: "Flag Emoji",   key: "flag",             ph: "🇺🇸" },
                        { label: "Currency",     key: "currency",         ph: "USD" },
                        { label: "Phone Code",   key: "phone_code",       ph: "+1" },
                        { label: "Phone Format", key: "phone_format",     ph: "(###) ###-####" },
                        { label: "Placeholder",  key: "phone_placeholder",ph: "(555) 000-0000" },
                      ].map(({ label, key, ph }) => (
                        <div key={key}>
                          <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                          <input
                            value={(editCountry as any)[key] || ""}
                            onChange={e => setEditCountry(prev => prev ? { ...prev, [key]: e.target.value } : null)}
                            placeholder={ph}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editCountry.is_active}
                        onChange={e => setEditCountry(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                        id="active-toggle"
                      />
                      <label htmlFor="active-toggle" className="text-sm text-gray-700">Active (visible in registration form)</label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={updateCountry} disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-[#0b66d1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                      </button>
                      <button onClick={() => setEditCountry(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{selCountry.flag || "🌍"}</span>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{selCountry.name}</h2>
                        <p className="text-sm text-gray-500">{selCountry.phone_code} · {selCountry.currency} · Code: {selCountry.code}</p>
                        <p className="text-xs text-gray-400">Format: {selCountry.phone_code} {selCountry.phone_format}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditCountry(selCountry)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteCountry(selCountry.id)} className="rounded-xl border border-red-100 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cities */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">Cities ({selCities.length})</p>
                  <button onClick={() => setAddCityOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700">
                    <Plus className="h-3.5 w-3.5" /> Add City
                  </button>
                </div>

                {addCityOpen && (
                  <div className="border-b border-gray-100 bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-gray-600">City Name</label>
                        <input value={cityForm.name} onChange={e => setCityForm(f => ({ ...f, name: e.target.value }))} placeholder="New York" className={inputClass} />
                      </div>
                      <div className="w-32">
                        <label className="mb-1 block text-xs font-medium text-gray-600">Code</label>
                        <input value={cityForm.code} onChange={e => setCityForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="NYC" maxLength={5} className={inputClass} />
                      </div>
                      <div className="flex items-end gap-2">
                        <button onClick={addCity} disabled={saving} className="flex h-10 items-center gap-1 rounded-xl bg-[#0b66d1] px-3 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setAddCityOpen(false)} className="flex h-10 items-center rounded-xl border border-gray-200 px-3 text-gray-500 hover:bg-gray-50">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-gray-100">
                  {selCities.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">No cities yet. Add one above.</div>
                  ) : selCities.map(city => (
                    <div key={city.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <MapPin className={`h-4 w-4 ${city.is_active ? "text-[#0b66d1]" : "text-gray-300"}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{city.name}</p>
                          <p className="text-xs text-gray-400">Code: {city.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCity(city.id, city.is_active)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${city.is_active ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                        >
                          {city.is_active ? "Active" : "Hidden"}
                        </button>
                        <button onClick={() => deleteCity(city.id)} className="rounded-xl p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Country Modal */}
      {addCountryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add Country</h3>
              <button onClick={() => setAddCountryOpen(false)} className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Country Name *",    key: "name",             ph: "United States" },
                { label: "ISO Code *",        key: "code",             ph: "US" },
                { label: "Flag Emoji",        key: "flag",             ph: "🇺🇸" },
                { label: "Currency *",        key: "currency",         ph: "USD" },
                { label: "Phone Code",        key: "phone_code",       ph: "+1" },
                { label: "Phone Format",      key: "phone_format",     ph: "(###) ###-####" },
                { label: "Phone Placeholder", key: "phone_placeholder",ph: "(555) 000-0000" },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                  <input
                    value={(countryForm as any)[key]}
                    onChange={e => setCountryForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={ph}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setAddCountryOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={addCountry} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add Country
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
