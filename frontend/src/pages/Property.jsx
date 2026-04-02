import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Toast from '../components/ui/Toast'
import { supabase, WA_NUMBER } from '../lib/supabase'
import { formatPrice, TYPE_ICONS, TYPE_LABELS, waLink } from '../lib/utils'

export default function Property() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [imgIdx,   setImgIdx]   = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single()
      if (error || !data) { navigate('/properties'); return }
      setProperty(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--d0)' }}>
      <div style={{ width: 36, height: 36, border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const p       = property
  const isSold  = p.status === 'sold'
  const imgs    = p.image_urls?.length ? p.image_urls : []
  const icon    = TYPE_ICONS[p.type] || '🏘️'

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--d0)' }}>

        {/* Breadcrumb */}
        <div className="prop-breadcrumb">
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', transition: 'color .3s' }} onMouseEnter={e => e.target.style.color='var(--gold)'} onMouseLeave={e => e.target.style.color='var(--tm)'}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/properties')} style={{ cursor: 'pointer', transition: 'color .3s' }} onMouseEnter={e => e.target.style.color='var(--gold)'} onMouseLeave={e => e.target.style.color='var(--tm)'}>Properties</span>
          <span>›</span>
          <span style={{ color: 'var(--t)' }}>{p.title}</span>
        </div>

        <div className="prop-container">
          <div className="prop-layout">

            {/* Left — Images + details */}
            <div>
              {/* Main image */}
              <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--d3)', aspectRatio: '16/9', marginBottom: 12, position: 'relative' }}>
                {imgs.length > 0 ? (
                  <img src={imgs[imgIdx]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: 'var(--td)', minHeight: 260 }}>{icon}</div>
                )}
                {isSold && (
                  <div style={{ position: 'absolute', top: 18, left: 18, background: '#1a1a1a', color: 'var(--tm)', padding: '6px 14px', borderRadius: 4, fontSize: '.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Sold</div>
                )}
              </div>

              {/* Thumbnail strip */}
              {imgs.length > 1 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                  {imgs.map((url, i) => (
                    <div key={i} onClick={() => setImgIdx(i)}
                      style={{ width: 72, height: 56, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === imgIdx ? 'var(--gold)' : 'transparent'}`, transition: 'border-color .3s', flexShrink: 0 }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile info card — shows above description on small screens */}
              <div className="prop-info-card-mob">
                <PropInfoCard p={p} isSold={isSold} navigate={navigate} />
              </div>

              {/* Description */}
              {p.description && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 600, marginBottom: 14 }}>About This Property</h3>
                  <p style={{ fontSize: '.84rem', color: 'var(--tm)', lineHeight: 1.9 }}>{p.description}</p>
                </div>
              )}

              {/* Specs grid */}
              <div className="prop-specs-grid">
                {[
                  p.area  && { label: 'Area',  val: p.area },
                  p.beds  && p.type !== 'plot' && { label: p.type === 'commercial' ? 'Units' : 'Bedrooms', val: p.beds },
                  p.baths && p.type !== 'plot' && { label: 'Bathrooms', val: p.baths },
                  { label: 'Type',     val: TYPE_LABELS[p.type] || p.type },
                  { label: 'Status',   val: isSold ? 'Sold' : 'Available' },
                  { label: 'Location', val: p.location?.split(',')[0] },
                ].filter(Boolean).map((s, i) => (
                  <div key={i} style={{ background: 'var(--d2)', border: '1px solid var(--gbb)', borderRadius: 'var(--rs)', padding: '18px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '.95rem', fontWeight: 500, marginBottom: 5 }}>{s.val}</div>
                    <div style={{ fontSize: '.58rem', color: 'var(--tm)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Sticky info card (desktop only) */}
            <div className="prop-info-card-desk">
              <PropInfoCard p={p} isSold={isSold} navigate={navigate} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Toast />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }

        .prop-breadcrumb {
          padding: 18px 52px;
          border-bottom: 1px solid var(--gbb);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .68rem;
          color: var(--tm);
          flex-wrap: wrap;
        }
        .prop-container {
          padding: 48px 52px 96px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .prop-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
        }
        .prop-specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .prop-info-card-desk {
          position: sticky;
          top: 110px;
          display: block;
        }
        .prop-info-card-mob {
          display: none;
          margin-bottom: 28px;
        }

        @media(max-width: 900px) {
          .prop-layout {
            grid-template-columns: 1fr !important;
          }
          .prop-info-card-desk {
            display: none !important;
          }
          .prop-info-card-mob {
            display: block !important;
          }
        }
        @media(max-width: 768px) {
          .prop-breadcrumb {
            padding: 14px 16px !important;
          }
          .prop-container {
            padding: 24px 16px 60px !important;
          }
          .prop-specs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media(max-width: 420px) {
          .prop-specs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}

function PropInfoCard({ p, isSold, navigate }) {
  return (
    <>
      <div style={{ background: 'var(--d2)', border: '1px solid var(--gbb)', borderRadius: 'var(--r)', padding: 28 }}>
        <div style={{ fontSize: '.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
          {TYPE_LABELS[p.type]} · {p.location?.split(',')[0]}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, lineHeight: 1.25, marginBottom: 10 }}>{p.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.72rem', color: 'var(--tm)', marginBottom: 22 }}>
          <svg width="11" height="13" viewBox="0 0 12 14" fill="none"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 6 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor" opacity=".5"/></svg>
          {p.location}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 600, color: 'var(--gold)', marginBottom: 6 }}>
          {formatPrice(p.price)}
        </div>
        <div style={{ fontSize: '.68rem', color: 'var(--tm)', marginBottom: 28 }}>Pakistani Rupees</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!isSold ? (
            <>
              <a href={waLink(WA_NUMBER, `I'm interested in "${p.title}" at ${p.location}. Price: PKR ${formatPrice(p.price)}. Please share more details.`)}
                target="_blank" rel="noreferrer"
                style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: 'var(--rx)', padding: 14, fontSize: '.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', transition: 'all .3s' }}>
                💬 WhatsApp Inquiry
              </a>
              <a href={`tel:+${WA_NUMBER}`}
                style={{ background: 'none', border: '1px solid var(--gold-b)', color: 'var(--gold)', borderRadius: 'var(--rx)', padding: 14, fontSize: '.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', transition: 'all .3s' }}>
                📞 Call Now
              </a>
            </>
          ) : (
            <div style={{ background: 'var(--d3)', borderRadius: 'var(--rx)', padding: 16, textAlign: 'center', fontSize: '.78rem', color: 'var(--tm)' }}>
              This property has been sold. Contact us for similar options.
            </div>
          )}
        </div>

        <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--gbb)', fontSize: '.68rem', color: 'var(--td)', textAlign: 'center' }}>
          Listed {new Date(p.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <button onClick={() => navigate('/properties')}
        style={{ width: '100%', marginTop: 12, background: 'none', border: '1px solid var(--gbb)', color: 'var(--tm)', borderRadius: 'var(--rx)', padding: '11px', fontSize: '.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .3s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-b)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gbb)'}>
        ← All Properties
      </button>
    </>
  )
}