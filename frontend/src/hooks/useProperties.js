import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let q = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.type)     q = q.eq('type', filters.type)
      if (filters.status)   q = q.eq('status', filters.status)
      if (filters.minPrice) q = q.gte('price', filters.minPrice)
      if (filters.maxPrice) q = q.lte('price', filters.maxPrice)
      if (filters.search)   q = q.or(
        `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
      )

      const { data, error: err } = await q
      if (err) throw err
      setProperties(data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('properties-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => fetch())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetch])

  return { properties, loading, error, refetch: fetch }
}

// Admin CRUD helpers
export async function createProperty(data) {
  const { data: res, error } = await supabase.from('properties').insert([data]).select().single()
  return { data: res, error }
}

export async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from('properties')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  return { data, error }
}

export async function deleteProperty(id) {
  // Delete images from storage first
  const { data: prop } = await supabase.from('properties').select('image_urls').eq('id', id).single()
  if (prop?.image_urls?.length) {
    const paths = prop.image_urls
      .map(url => url.split('/property-images/')[1])
      .filter(Boolean)
    if (paths.length) await supabase.storage.from('property-images').remove(paths)
  }
  const { error } = await supabase.from('properties').delete().eq('id', id)
  return { error }
}

export async function uploadImages(files) {
  const urls = []
  for (const file of files) {
    const ext  = file.name.split('.').pop()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('property-images').upload(name, file)
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(name)
      urls.push(publicUrl)
    }
  }
  return urls
}
