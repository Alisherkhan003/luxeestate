import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatPrice, TYPE_ICONS } from '../../lib/utils'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats,   setStats]   = useState({ total: 0, available: 0, sold: 0 })
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
      if (data) {
        setStats({ total: data.length, available: data.filter(p => p.status === 'available').length, sold: data.filter(p => p.status === 'sold').length })
        setRecent(data.slice(0, 6))
      }
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { icon: '🏘️', num: stats.total,     label: 'Total',     color: '#C9A84C', bg: 'rgba(201,168,76,.1)',  border: 'rgba(201,168,76,.25)' },
    { icon: '✅',  num: stats.available, label: 'Available', color: '#3DBE78', bg: 'rgba(50,180,100,.08)', border: 'rgba(50,180,100,.2)'  },
    { icon: '🔴',  num: stats.sold,      label: 'Sold',      color: '#E05252', bg: 'rgba(224,82,82,.08)',  border: 'rgba(224,82,82,.2)'   },
  ]

  const actions = [
    { icon: '➕', label: 'Add Property', sub: 'List new property', to: '/admin/add',      color: '#C9A84C', bg: 'rgba(201,168,76,.1)',   border: 'rgba(201,168,76,.3)'   },
    { icon: '📋', label: 'All Listings', sub: 'Manage inventory',  to: '/admin/listings', color: '#7eb3ff', bg: 'rgba(100,150,255,.08)', border: 'rgba(100,150,255,.25)' },
    { icon: '🌐', label: 'View Site',    sub: 'Public website',    to: 'ext',             color: '#3DBE78', bg: 'rgba(50,180,100,.08)',  border: 'rgba(50,180,100,.25)'  },
  ]

  return (
    <AdminLayout title="Dashboard">

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {statCards.map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--r)', padding: '18px 14px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 600, color: c.color, lineHeight: 1, marginBottom: 4 }}>
              {loading ? '—' : c.num}
            </div>
            <div style={{ fontSize: '.6rem', color: 'var(--tm)', letterSpacing: '2px', textTransform: 'uppercase' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div style={{ background: 'var(--d2)', border: '1px solid var(--gbb)', borderRadius: 'var(--r)', marginBottom: 18, overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--gbb)' }}>
          <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)' }}>Quick Actions</span>
        </div>
        <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {actions.map(a => (
            <button key={a.label}
              onClick={() => a.to === 'ext' ? window.open('/', '_blank') : navigate(a.to)}
              style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 'var(--rs)', padding: '14px 12px', textAlign: 'left', cursor: 'pointer', transition: 'all .3s', display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${a.color}18` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none' }}>
              <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
              <span style={{ fontSize: '.74rem', fontWeight: 600, color: a.color }}>{a.label}</span>
              <span style={{ fontSize: '.62rem', color: 'var(--tm)', lineHeight: 1.4 }}>{a.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent listings ── */}
      <div style={{ background: 'var(--d2)', border: '1px solid var(--gbb)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--gbb)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)' }}>Recent Listings</span>
          <button onClick={() => navigate('/admin/listings')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '.7rem', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>All →</button>
        </div>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--tm)', fontSize: '.8rem' }}>Loading…</div>
        ) : recent.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🏘️</div>
            <div style={{ color: 'var(--tm)', fontSize: '.82rem', marginBottom: 16 }}>No listings yet.</div>
            <button onClick={() => navigate('/admin/add')}
              style={{ background: 'var(--gold)', color: 'var(--d0)', border: 'none', borderRadius: 'var(--rx)', padding: '10px 22px', fontSize: '.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Add First Property
            </button>
          </div>
        ) : recent.map((p, i) => (
          <div key={p.id} onClick={() => navigate(`/admin/edit/${p.id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', cursor: 'pointer', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--d3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <div style={{ width: 46, height: 38, borderRadius: 7, overflow: 'hidden', background: 'var(--d4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--td)' }}>
              {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : TYPE_ICONS[p.type]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.78rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
              <div style={{ fontSize: '.65rem', color: 'var(--tm)', marginTop: 2 }}>{p.location} · {formatPrice(p.price)}</div>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: 20, fontSize: '.58rem', fontWeight: 600, letterSpacing: '1px',
              textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
              background: p.status === 'available' ? 'rgba(201,168,76,.12)' : 'rgba(224,82,82,.1)',
              color:      p.status === 'available' ? 'var(--gold)'          : '#E05252',
              border:     `1px solid ${p.status === 'available' ? 'rgba(201,168,76,.25)' : 'rgba(224,82,82,.2)'}`,
            }}>
              {p.status === 'available' ? '● Live' : '● Sold'}
            </span>
          </div>
        ))}
      </div>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 520px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important }
        }
        @media (max-width: 340px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important }
        }
      `}</style>
    </AdminLayout>
  )
}