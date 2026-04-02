import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast, { showToast } from '../../components/ui/Toast'
import { supabase } from '../../lib/supabase'
import { createProperty, updateProperty, uploadImages } from '../../hooks/useProperties'

const EMPTY = {
  title: '', type: 'villa', status: 'available',
  price: '', location: '', area: '', beds: '', baths: '',
  description: '', image_urls: [], featured: false,
}

export default function AdminAddEdit() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isEdit    = Boolean(id)

  const [form,     setForm]     = useState(EMPTY)
  const [files,    setFiles]    = useState([])
  const [previews, setPreviews] = useState([])
  const [saving,   setSaving]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [drag,     setDrag]     = useState(false)
  const [loading,  setLoading]  = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    async function load() {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single()
      if (error || !data) { navigate('/admin/listings'); return }
      setForm({ ...EMPTY, ...data })
      setLoading(false)
    }
    load()
  }, [id])

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleFiles(newFiles) {
    const arr = Array.from(newFiles)
    setFiles(prev => [...prev, ...arr])
    arr.forEach(f => {
      const url = URL.createObjectURL(f)
      setPreviews(prev => [...prev, url])
    })
  }

  function removeNewImage(idx) {
    setFiles(prev    => prev.filter((_,i) => i !== idx))
    setPreviews(prev => prev.filter((_,i) => i !== idx))
  }

  function removeExistingImage(url) {
    setField('image_urls', form.image_urls.filter(u => u !== url))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim())    { showToast('Title is required', 'error');    return }
    if (!form.location.trim()) { showToast('Location is required', 'error'); return }
    if (!form.price)           { showToast('Price is required', 'error');    return }

    setSaving(true); setProgress(10)
    let allImageUrls = [...form.image_urls]
    if (files.length > 0) {
      setProgress(30)
      try {
        const uploaded = await uploadImages(files)
        allImageUrls = [...allImageUrls, ...uploaded]
        setProgress(70)
      } catch { showToast('Image upload failed — property saved without new images', 'error') }
    }
    setProgress(85)
    const payload = { ...form, price: Number(form.price), image_urls: allImageUrls }
    const { error } = isEdit ? await updateProperty(id, payload) : await createProperty(payload)
    setProgress(100); setSaving(false)
    if (error) { showToast('Error: ' + error.message, 'error'); setProgress(0); return }
    showToast(isEdit ? '✅ Property updated!' : '✅ Property published!', 'success')
    setTimeout(() => navigate('/admin/listings'), 1000)
  }

  const inp = (key, type='text', placeholder='') => ({
    value: form[key], onChange: e => setField(key, e.target.value),
    type, placeholder,
    style: { width:'100%', background:'var(--d3)', border:'1px solid var(--gbb)', borderRadius:'var(--rx)', color:'var(--t)', fontSize:'.83rem', padding:'11px 14px', outline:'none', transition:'border-color .3s' },
    onFocus: e => e.target.style.borderColor = 'var(--gold-b)',
    onBlur:  e => e.target.style.borderColor = 'var(--gbb)',
  })

  const selStyle = { width:'100%', background:'var(--d3)', border:'1px solid var(--gbb)', borderRadius:'var(--rx)', color:'var(--t)', fontSize:'.83rem', padding:'11px 32px 11px 14px', outline:'none', cursor:'pointer' }
  const lbl = txt => <label style={{ fontSize:'.63rem', letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--tm)', marginBottom:7, display:'block' }}>{txt}</label>

  if (loading) return (
    <AdminLayout title={isEdit ? 'Edit Property' : 'Add Property'}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80 }}>
        <div style={{ width:32, height:32, border:'2px solid var(--gold)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title={isEdit ? 'Edit Property' : 'Add Property'}>
      <form onSubmit={handleSubmit}>
        <div className="addedit-layout">

          {/* Left column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Basic info */}
            <div style={{ background:'var(--d2)', border:'1px solid var(--gbb)', borderRadius:'var(--r)', padding:24 }}>
              <div style={{ fontSize:'.78rem', fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', marginBottom:20 }}>Basic Information</div>
              <div className="addedit-form-grid">
                <div style={{ gridColumn:'1/-1' }}>
                  {lbl('Property Title *')}
                  <input {...inp('title','text','e.g. Palm Crest Villa, DHA Phase 6')} />
                </div>
                <div>
                  {lbl('Type *')}
                  <select value={form.type} onChange={e => setField('type', e.target.value)} style={selStyle}>
                    {['villa','house','apartment','plot','commercial'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  {lbl('Status')}
                  <select value={form.status} onChange={e => setField('status', e.target.value)} style={selStyle}>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  {lbl('Location *')}
                  <input {...inp('location','text','e.g. DHA Phase 6, Lahore')} />
                </div>
                <div>
                  {lbl('Area / Size')}
                  <input {...inp('area','text','e.g. 1 Kanal, 10 Marla')} />
                </div>
                <div>
                  {lbl('Price (PKR) *')}
                  <input {...inp('price','number','e.g. 32000000')} />
                </div>
                <div>
                  {lbl('Bedrooms')}
                  <input {...inp('beds','text','e.g. 5')} />
                </div>
                <div>
                  {lbl('Bathrooms')}
                  <input {...inp('baths','text','e.g. 4')} />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  {lbl('Description')}
                  <textarea
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    placeholder="Describe the property…"
                    rows={4}
                    style={{ width:'100%', background:'var(--d3)', border:'1px solid var(--gbb)', borderRadius:'var(--rx)', color:'var(--t)', fontSize:'.83rem', padding:'11px 14px', outline:'none', transition:'border-color .3s', resize:'vertical', minHeight:100 }}
                    onFocus={e => e.target.style.borderColor = 'var(--gold-b)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--gbb)'}
                  />
                </div>
                <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:10 }}>
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setField('featured', e.target.checked)}
                    style={{ accentColor:'var(--gold)', width:16, height:16, cursor:'pointer' }} />
                  <label htmlFor="featured" style={{ fontSize:'.78rem', color:'var(--tm)', cursor:'pointer' }}>Mark as Featured property</label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div style={{ background:'var(--d2)', border:'1px solid var(--gbb)', borderRadius:'var(--r)', padding:24 }}>
              <div style={{ fontSize:'.78rem', fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', marginBottom:16 }}>Property Photos</div>
              <div
                onClick={() => document.getElementById('fileInput').click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
                style={{ border:`2px dashed ${drag ? 'var(--gold)' : 'var(--gbb)'}`, borderRadius:'var(--rs)', padding:28, textAlign:'center', cursor:'pointer', transition:'all .3s', background: drag ? 'var(--gold-dim)' : 'var(--d3)', marginBottom:16 }}>
                <input id="fileInput" type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
                <div style={{ fontSize:'2rem', marginBottom:8, opacity:.5 }}>📷</div>
                <div style={{ fontSize:'.78rem', color:'var(--tm)' }}>Click or drag & drop photos here</div>
                <div style={{ fontSize:'.66rem', color:'var(--td)', marginTop:4 }}>JPG, PNG, WEBP — multiple allowed</div>
              </div>
              {form.image_urls.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:'.64rem', color:'var(--td)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:8 }}>Current Images</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {form.image_urls.map((url, i) => (
                      <div key={i} style={{ position:'relative', width:80, height:64, borderRadius:8, overflow:'hidden', border:'1px solid var(--gbb)', flexShrink:0 }}>
                        <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        <button type="button" onClick={() => removeExistingImage(url)}
                          style={{ position:'absolute', top:2, right:2, width:18, height:18, borderRadius:'50%', background:'rgba(0,0,0,.8)', border:'none', color:'white', fontSize:'.6rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {previews.length > 0 && (
                <div>
                  <div style={{ fontSize:'.64rem', color:'var(--td)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:8 }}>New Images (to upload)</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {previews.map((url, i) => (
                      <div key={i} style={{ position:'relative', width:80, height:64, borderRadius:8, overflow:'hidden', border:'2px solid var(--gold-b)', flexShrink:0 }}>
                        <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        <button type="button" onClick={() => removeNewImage(i)}
                          style={{ position:'absolute', top:2, right:2, width:18, height:18, borderRadius:'50%', background:'rgba(0,0,0,.8)', border:'none', color:'white', fontSize:'.6rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column — summary + submit */}
          <div className="addedit-sidebar">
            <div style={{ background:'var(--d2)', border:'1px solid var(--gbb)', borderRadius:'var(--r)', padding:24, marginBottom:14 }}>
              <div style={{ fontSize:'.78rem', fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', marginBottom:18 }}>Summary</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:'.78rem' }}>
                {[
                  { label:'Title',    val: form.title    || '—' },
                  { label:'Type',     val: form.type || '—' },
                  { label:'Status',   val: form.status },
                  { label:'Price',    val: form.price ? `PKR ${Number(form.price).toLocaleString()}` : '—' },
                  { label:'Location', val: form.location || '—' },
                  { label:'Area',     val: form.area     || '—' },
                ].map(r => (
                  <div key={r.label} style={{ display:'flex', justifyContent:'space-between', gap:8, paddingBottom:10, borderBottom:'1px solid var(--gbb)' }}>
                    <span style={{ color:'var(--tm)', flexShrink:0 }}>{r.label}</span>
                    <span style={{ textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{r.val}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ color:'var(--tm)' }}>Images</span>
                  <span>{form.image_urls.length + previews.length} photo{form.image_urls.length + previews.length !== 1 ? 's':''}</span>
                </div>
              </div>
            </div>
            {saving && (
              <div style={{ marginBottom:14 }}>
                <div style={{ height:3, background:'var(--d4)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'var(--gold)', borderRadius:2, width:`${progress}%`, transition:'width .3s' }} />
                </div>
                <div style={{ fontSize:'.66rem', color:'var(--tm)', marginTop:5, textAlign:'center' }}>
                  {progress < 70 ? 'Uploading images…' : progress < 90 ? 'Saving property…' : 'Almost done…'}
                </div>
              </div>
            )}
            <button type="submit" disabled={saving}
              style={{ width:'100%', background:'var(--gold)', color:'var(--d0)', border:'none', borderRadius:'var(--rx)', padding:14, fontSize:'.75rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', cursor:saving?'not-allowed':'pointer', opacity:saving?.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:10 }}>
              {saving && <span style={{ width:16, height:16, border:'2px solid rgba(0,0,0,.2)', borderTopColor:'var(--d0)', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />}
              {saving ? 'Saving…' : isEdit ? '💾 Update Property' : '🚀 Publish Property'}
            </button>
            <button type="button" onClick={() => navigate('/admin/listings')}
              style={{ width:'100%', background:'none', border:'1px solid var(--gbb)', color:'var(--tm)', borderRadius:'var(--rx)', padding:'11px', fontSize:'.68rem', letterSpacing:'1.5px', textTransform:'uppercase', cursor:'pointer', transition:'all .3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-b)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gbb)'}>
              Cancel
            </button>
          </div>
        </div>
      </form>

      <Toast />
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        .addedit-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }
        .addedit-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .addedit-sidebar {
          position: sticky;
          top: 24px;
        }
        @media(max-width: 900px) {
          .addedit-layout {
            grid-template-columns: 1fr !important;
          }
          .addedit-sidebar {
            position: static !important;
          }
        }
        @media(max-width: 500px) {
          .addedit-form-grid {
            grid-template-columns: 1fr !important;
          }
          .addedit-form-grid > div[style*="gridColumn"] {
            grid-column: 1 !important;
          }
        }
      `}</style>
    </AdminLayout>
  )
}