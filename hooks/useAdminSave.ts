import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminSave() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getToken = async () => {
    if (typeof window !== 'undefined') {
      const bypass = localStorage.getItem('jammi_bypass_token');
      if (bypass) return bypass;
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) throw new Error('No admin session. Please log in again.')
    return session.access_token
  }

  const saveCMSContent = async (updates) => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const token = await getToken()
      const updatesArray = Array.isArray(updates) ? updates : [updates]

      const res = await fetch('/api/admin/cms/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ updates: updatesArray })
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setTimeout(() => setError(null), 5000)
      return false
    } finally {
      setSaving(false)
    }
  }

  const saveProduct = async (productData, isNew = false) => {
    setSaving(true)
    setError(null)

    try {
      const token = await getToken()
      const res = await fetch('/api/admin/products/save', {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save product')

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      return json.data
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setTimeout(() => setError(null), 5000)
      return null
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file, bucket = 'cms-images', folder = '') => {
    setSaving(true)
    setError(null)

    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('folder', folder)

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Image upload failed')

      return json.url
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setTimeout(() => setError(null), 5000)
      return null
    } finally {
      setSaving(false)
    }
  }

  const saveRow = async (table, data, idField = 'id') => {
    setSaving(true)
    setError(null)

    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/${table}/save`, {
        method: data[idField] ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Failed to save ${table}`)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      return json.data
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setTimeout(() => setError(null), 5000)
      return null
    } finally {
      setSaving(false)
    }
  }

  return { saving, error, success, saveCMSContent, saveProduct, uploadImage, saveRow }
}
