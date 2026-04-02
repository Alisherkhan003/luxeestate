import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin',          icon: '📊', label: 'Dashboard',   exact: true },
  { to: '/admin/listings', icon: '🏘️', label: 'All Listings' },
  { to: '/admin/add',      icon: '➕', label: 'Add Property' },
]

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  function SidebarContent({ onClose }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--gbb)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, letterSpacing: '3px', color: 'var(--gold)' }}>
              Luxe<span style={{ color: 'var(--t)', fontWeight: 300 }}>Estate</span>
            </div>
            <div style={{ fontSize: '.55rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--td)', marginTop: 3 }}>Admin Panel</div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--tm)', fontSize: '1.3rem', cursor: 'pointer', padding: 4 }}>✕</button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: '14px 10px', flex: 1 }}>
          <div style={{ fontSize: '.54rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--td)', padding: '0 10px', marginBottom: 8 }}>Menu</div>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.exact} onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderRadius: 'var(--rs)', fontSize: '.76rem', textDecoration: 'none',
                color: isActive ? 'var(--gold)' : 'var(--tm)',
                background: isActive ? 'var(--gold-dim)' : 'none',
                border: isActive ? '1px solid var(--gold-b)' : '1px solid transparent',
                transition: 'all .25s', marginBottom: 3,
              })}>
              <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}

          <div style={{ fontSize: '.54rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--td)', padding: '0 10px', marginBottom: 8, marginTop: 18 }}>Site</div>
          <a href="/" target="_blank" rel="noreferrer" onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--rs)', fontSize: '.76rem', textDecoration: 'none', color: 'var(--tm)', transition: 'all .25s', marginBottom: 3 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--d3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>🌐</span>
            View Website
          </a>
        </nav>

        {/* User + signout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--gbb)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--rs)', background: 'var(--d2)', marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--gold-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', color: 'var(--gold)', flexShrink: 0 }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ fontSize: '.64rem', color: 'var(--tm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {user?.email}
            </div>
          </div>
          <button onClick={handleSignOut}
            style={{ width: '100%', background: 'none', border: '1px solid rgba(224,82,82,.2)', color: 'var(--red-l)', padding: 9, borderRadius: 'var(--rx)', fontSize: '.65rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all .3s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,82,82,.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--d0)' }}>

      {/* Desktop sidebar */}
      <aside className="admin-sidebar" style={{ width: 240, flexShrink: 0, background: 'var(--d1)', borderRight: '1px solid var(--gbb)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {sideOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
          <aside style={{ width: 260, background: 'var(--d1)', borderRight: '1px solid var(--gbb)', height: '100vh', overflowY: 'auto', animation: 'slideIn .25s ease', flexShrink: 0 }}>
            <SidebarContent onClose={() => setSideOpen(false)} />
          </aside>
          <div onClick={() => setSideOpen(false)} style={{ flex: 1, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)' }} />
        </div>
      )}

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: 'var(--d1)', borderBottom: '1px solid var(--gbb)', padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile menu toggle */}
            <button onClick={() => setSideOpen(true)} className="mob-menu-btn"
              style={{ background: 'none', border: '1px solid var(--gbb)', color: 'var(--tm)', width: 36, height: 36, borderRadius: 'var(--rx)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0, display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              ☰
            </button>
            <span style={{ fontSize: '.88rem', fontWeight: 500, letterSpacing: '.5px' }}>{title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="date-txt" style={{ fontSize: '.66rem', color: 'var(--tm)' }}>
              {new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {/* Mobile signout */}
            <button onClick={handleSignOut} className="mob-signout"
              style={{ background: 'none', border: '1px solid rgba(224,82,82,.2)', color: 'var(--red-l)', padding: '6px 12px', borderRadius: 'var(--rx)', fontSize: '.62rem', cursor: 'pointer', display: 'none' }}>
              Exit
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @media (max-width: 768px) {
          .admin-sidebar  { display: none !important }
          .mob-menu-btn   { display: flex !important }
          .mob-signout    { display: block !important }
          .date-txt       { display: none !important }
        }
      `}</style>
    </div>
  )
}