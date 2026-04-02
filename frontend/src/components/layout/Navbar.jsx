import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [pathname])

  function toggle() {
    setOpen(o => {
      document.body.style.overflow = o ? '' : 'hidden'
      return !o
    })
  }

  const links = [
    { href: '/#properties', label: 'Properties' },
    { href: '/#map',        label: 'Locations'  },
    { href: '/#portfolio',  label: 'Portfolio'  },
    { href: '/#contact',    label: 'Contact'    },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '12px 20px' : '18px 20px',
        background: scrolled ? 'rgba(6,6,6,.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(22px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.09)' : 'none',
        transition: 'all .35s',
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 600, letterSpacing: '3px', color: 'var(--gold)', flexShrink: 0 }}>
          Luxe<span style={{ color: 'var(--t)', fontWeight: 300 }}>Estate</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none' }} className="nd">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} style={{ fontSize: '.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--tm)', transition: 'color .3s' }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'var(--tm)'}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop buttons */}
        <div style={{ display: 'flex', gap: 8 }} className="nd">
          <Link to="/admin">
            <button style={{ background: 'none', border: '1px solid var(--gold-b)', color: 'var(--gold)', padding: '8px 16px', borderRadius: 4, fontSize: '.63rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
              ⚙ Admin
            </button>
          </Link>
          <a href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '923177908767'}`} target="_blank" rel="noreferrer">
            <button style={{ background: 'var(--gold)', border: 'none', color: 'var(--d0)', padding: '8px 16px', borderRadius: 4, fontSize: '.63rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
              💬 Chat
            </button>
          </a>
        </div>

        {/* Hamburger — mobile only */}
        <button onClick={toggle} className="nm" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 1001 }}>
          <span style={{ width: 24, height: 2, background: open ? 'var(--gold)' : 'var(--t)', borderRadius: 2, display: 'block', transition: 'all .3s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ width: 24, height: 2, background: 'var(--t)', borderRadius: 2, display: 'block', transition: 'all .3s', opacity: open ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: open ? 'var(--gold)' : 'var(--t)', borderRadius: 2, display: 'block', transition: 'all .3s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 899,
        background: 'rgba(6,6,6,.97)', backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .3s',
      }}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={toggle}
            style={{ fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--tm)', transition: 'color .3s', fontWeight: 300 }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--tm)'}>
            {l.label}
          </a>
        ))}
        <Link to="/admin" onClick={toggle}
          style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 8 }}>
          ⚙ Admin Panel
        </Link>
        <a href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '923177908767'}`}
          target="_blank" rel="noreferrer" onClick={toggle}
          style={{ background: '#25D366', color: 'white', padding: '13px 32px', borderRadius: 4, fontSize: '.76rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
          💬 WhatsApp
        </a>
      </div>

      <style>{`
        .nd { display: flex !important }
        .nm { display: none !important }
        @media (max-width: 768px) {
          .nd { display: none !important }
          .nm { display: flex !important }
        }
      `}</style>
    </>
  )
}