import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useProperties, updateProperty, deleteProperty } from '../../hooks/useProperties'
import { showToast } from '../../components/ui/Toast'
import Toast from '../../components/ui/Toast'
import { formatPrice, TYPE_ICONS, TYPE_LABELS } from '../../lib/utils'

export default function AdminListings() {
  const navigate = useNavigate()
  const [search,  setSearch]  = useState('')
  const [typeF,   setTypeF]   = useState('')
  const [statusF, setStatusF] = useState('')
  const [delId,   setDelId]   = useState(null)

  const { properties, loading, refetch } = useProperties({
    type:   typeF,
    status: statusF,
    search: search,
  })

  async function handleToggle(p) {
    const newStatus = p.status === 'available' ? 'sold' : 'available'
    const { error } = await updateProperty(p.id, { status: newStatus })
    if (error) { showToast('Error updating status', 'error'); return }
    showToast(newStatus === 'sold' ? '🔴 Marked as Sold' : '🟢 Marked as Available', 'info')
    refetch()
  }

  async function handleDelete(id) {
    const { error } = await deleteProperty(id)
    if (error) { showToast('Error deleting property', 'error'); return }
    showToast('🗑 Property deleted', 'info')
    setDelId(null)
    refetch()
  }

  const sel = { background: 'var(--d3)', border: '1px solid var(--gbb)', color: 'var(--t)', padding: '8px 32px 8px 14px', borderRadius: 'var(--rx)', fontSize: '.68rem', outline: 'none', cursor: 'pointer' }

  const TYPE_COLORS = {
    villa:      { bg:'rgba(201,168,76,.12)', color:'var(--gold)' },
    house:      { bg:'rgba(100,150,255,.1)', color:'#7eb3ff' },
    apartment:  { bg:'rgba(150,100,255,.1)', color:'#c87eff' },
    plot:       { bg:'rgba(50,180,100,.1)',  color:'#3DBE78' },
    commercial: { bg:'rgba(255,150,50,.1)',  color:'#ffaa50' },
  }

  return (
    <AdminLayout title="All Listings">
      {/* Toolbar */}
      <div className="listings-toolbar">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search properties…"
          style={{ flex: 1, minWidth: 160, background: 'var(--d3)', border: '1px solid var(--gbb)', borderRadius: 'var(--rx)', color: 'var(--t)', fontSize: '.8rem', padding: '9px 14px', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--gold-b)'}
          onBlur={e  => e.target.style.borderColor = 'var(--gbb)'}
        />
        <select value={typeF}   onChange={e => setTypeF(e.target.value)}   style={sel}>
          <option value="">All Types</option>
          {['villa','house','apartment','plot','commercial'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} style={sel}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <button onClick={() => navigate('/admin/add')}
          style={{ background: 'var(--gold)', color: 'var(--d0)', border: 'none', borderRadius: 'var(--rx)', padding: '9px 20px', fontSize: '.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          + Add New
        </button>
      </div>

      {/* Count */}
      <div style={{ fontSize: '.7rem', color: 'var(--tm)', marginBottom: 16 }}>
        {loading ? 'Loading…' : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`}
      </div>

      {/* Table card */}
      <div style={{ background: 'var(--d2)', border: '1px solid var(--gbb)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--tm)', fontSize: '.8rem' }}>Loading…</div>
        ) : properties.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏘️</div>
            <div style={{ color: 'var(--tm)', fontSize: '.82rem', marginBottom: 16 }}>No properties found.</div>
            <button onClick={() => navigate('/admin/add')} style={{ background: 'var(--gold)', color: 'var(--d0)', border: 'none', borderRadius: 'var(--rx)', padding: '10px 22px', fontSize: '.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Add First Property</button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="listings-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Property', 'Type', 'Price', 'Location', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '.62rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--tm)', textAlign: 'left', borderBottom: '1px solid var(--gbb)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => {
                    const tc = TYPE_COLORS[p.type] || { bg: 'var(--d4)', color: 'var(--tm)' }
                    return (
                      <tr key={p.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,.04)', transition: 'background .2s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--d3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 52, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--d4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: 'var(--td)' }}>
                              {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : TYPE_ICONS[p.type]}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '.8rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{p.title}</div>
                              <div style={{ fontSize: '.65rem', color: 'var(--td)', marginTop: 2 }}>
                                {new Date(p.created_at).toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'numeric'})}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '.6rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', background: tc.bg, color: tc.color, whiteSpace: 'nowrap' }}>
                            {TYPE_LABELS[p.type] || p.type}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', fontWeight: 600, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                          {formatPrice(p.price)} <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.6rem', color: 'var(--tm)', fontWeight: 300 }}>PKR</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '.76rem', color: 'var(--tm)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.location}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button onClick={e => { e.stopPropagation(); handleToggle(p) }}
                              style={{ width: 44, height: 23, borderRadius: 23, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .3s', background: p.status === 'available' ? 'var(--green)' : 'var(--d5)', flexShrink: 0 }}>
                              <span style={{ position: 'absolute', top: 3.5, left: p.status === 'available' ? 'calc(100% - 19.5px)' : 3.5, width: 16, height: 16, background: p.status === 'available' ? 'var(--green-l)' : '#777', borderRadius: '50%', transition: 'all .3s', display: 'block' }} />
                            </button>
                            <span style={{ fontSize: '.65rem', color: p.status === 'available' ? 'var(--green-l)' : 'var(--tm)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              {p.status === 'available' ? 'Live' : 'Sold'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={e => { e.stopPropagation(); navigate(`/admin/edit/${p.id}`) }}
                              style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gbb)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', transition: 'all .3s', color: 'var(--tm)' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-b)'; e.currentTarget.style.color = 'var(--gold)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gbb)';    e.currentTarget.style.color = 'var(--tm)'  }}
                              title="Edit">✏️</button>
                            <button onClick={e => { e.stopPropagation(); setDelId(p.id) }}
                              style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gbb)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', transition: 'all .3s', color: 'var(--tm)' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,82,82,.4)'; e.currentTarget.style.color = 'var(--red-l)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gbb)';         e.currentTarget.style.color = 'var(--tm)'  }}
                              title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="listings-cards">
              {properties.map(p => {
                const tc = TYPE_COLORS[p.type] || { bg: 'var(--d4)', color: 'var(--tm)' }
                return (
                  <div key={p.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 52, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--d4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : TYPE_ICONS[p.type]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '.82rem', fontWeight: 500, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: '.68rem', color: 'var(--tm)', marginBottom: 4 }}>{p.location}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: '.58rem', fontWeight: 600, background: tc.bg, color: tc.color }}>{TYPE_LABELS[p.type]}</span>
                          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: 'var(--gold)', fontWeight: 600 }}>{formatPrice(p.price)} <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '.6rem', color: 'var(--tm)', fontWeight: 300 }}>PKR</span></span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => handleToggle(p)}
                          style={{ width: 44, height: 23, borderRadius: 23, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .3s', background: p.status === 'available' ? 'var(--green)' : 'var(--d5)' }}>
                          <span style={{ position: 'absolute', top: 3.5, left: p.status === 'available' ? 'calc(100% - 19.5px)' : 3.5, width: 16, height: 16, background: p.status === 'available' ? 'var(--green-l)' : '#777', borderRadius: '50%', transition: 'all .3s', display: 'block' }} />
                        </button>
                        <span style={{ fontSize: '.65rem', color: p.status === 'available' ? 'var(--green-l)' : 'var(--tm)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {p.status === 'available' ? 'Live' : 'Sold'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => navigate(`/admin/edit/${p.id}`)}
                          style={{ padding: '7px 14px', borderRadius: 'var(--rx)', border: '1px solid var(--gbb)', background: 'none', color: 'var(--tm)', fontSize: '.68rem', cursor: 'pointer' }}>✏️ Edit</button>
                        <button onClick={() => setDelId(p.id)}
                          style={{ padding: '7px 14px', borderRadius: 'var(--rx)', border: '1px solid rgba(224,82,82,.2)', background: 'none', color: 'var(--red-l)', fontSize: '.68rem', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--d2)', border: '1px solid var(--gbb)', borderRadius: 'var(--r)', padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', animation: 'fadeUp .3s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: 10 }}>Delete Property?</h3>
            <p style={{ fontSize: '.8rem', color: 'var(--tm)', marginBottom: 28, lineHeight: 1.7 }}>This action cannot be undone. The property and all its images will be permanently deleted.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDelId(null)} style={{ padding: '10px 24px', borderRadius: 'var(--rx)', border: '1px solid var(--gbb)', background: 'none', color: 'var(--tm)', fontSize: '.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(delId)} style={{ padding: '10px 24px', borderRadius: 'var(--rx)', border: 'none', background: 'var(--red-l)', color: 'white', fontSize: '.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}

      <Toast />
      <style>{`
        .listings-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .listings-table-wrap {
          overflow-x: auto;
          display: block;
        }
        .listings-cards {
          display: none;
        }
        @media(max-width: 700px) {
          .listings-toolbar {
            gap: 8px;
          }
          .listings-toolbar input {
            min-width: 100% !important;
            order: -1;
          }
          .listings-table-wrap { display: none !important }
          .listings-cards { display: block !important }
        }
      `}</style>
    </AdminLayout>
  )
}