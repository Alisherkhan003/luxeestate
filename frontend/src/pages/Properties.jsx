import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PropertyCard from '../components/public/PropertyCard'
import Toast from '../components/ui/Toast'
import { useProperties } from '../hooks/useProperties'

const TYPES  = ['All','Villa','House','Apartment','Plot','Commercial']
const PRICES = [
  { label:'Any Price',     value:'' },
  { label:'Under 1 Cr',   value:'0-10000000' },
  { label:'1 – 5 Crore',  value:'10000000-50000000' },
  { label:'5 – 10 Crore', value:'50000000-100000000' },
  { label:'10 Crore +',   value:'100000000-999999999' },
]

export default function Properties() {
  const [activeType,    setActiveType]    = useState('All')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [priceFilter,   setPriceFilter]   = useState('')
  const [searchText,    setSearchText]    = useState('')
  const [searchInput,   setSearchInput]   = useState('')

  const [min, max] = priceFilter ? priceFilter.split('-').map(Number) : [null, null]

  const { properties, loading } = useProperties({
    type:     activeType === 'All' ? '' : activeType.toLowerCase(),
    status:   statusFilter,
    minPrice: min || null,
    maxPrice: max || null,
    search:   searchText,
  })

  function handleSearch(e) {
    e.preventDefault()
    setSearchText(searchInput.trim())
  }

  const sel = {
    background: 'var(--d3)',
    border: '1px solid var(--gbb)',
    color: 'var(--t)',
    padding: '9px 32px 9px 14px',
    borderRadius: 'var(--rx)',
    fontSize: '.68rem',
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <>
      <Navbar />

      {/* Page header */}
      <div className="props-header">
        <div style={{ fontSize: '.61rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Our Inventory</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: 24 }}>
          All <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Properties</em>
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="props-search-form">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by title or location…"
            style={{ flex: 1, background: 'var(--d3)', border: '1px solid var(--gbb)', borderRadius: 'var(--rx)', color: 'var(--t)', fontSize: '.82rem', padding: '10px 16px', outline: 'none', minWidth: 0 }}
            onFocus={e => e.target.style.borderColor = 'var(--gold-b)'}
            onBlur={e  => e.target.style.borderColor = 'var(--gbb)'}
          />
          <button type="submit" style={{ background: 'var(--gold)', color: 'var(--d0)', border: 'none', borderRadius: 'var(--rx)', padding: '10px 20px', fontSize: '.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Search
          </button>
          {searchText && (
            <button type="button" onClick={() => { setSearchText(''); setSearchInput('') }}
              style={{ background: 'none', border: '1px solid var(--gbb)', color: 'var(--tm)', borderRadius: 'var(--rx)', padding: '10px 14px', fontSize: '.7rem', cursor: 'pointer', flexShrink: 0 }}>
              ✕
            </button>
          )}
        </form>

        {/* Filters row */}
        <div className="props-filter-row">
          <div className="props-type-scroll">
            {TYPES.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                style={{ background: activeType === t ? 'var(--gold)' : 'var(--d3)', border: `1px solid ${activeType === t ? 'var(--gold)' : 'var(--gbb)'}`, color: activeType === t ? 'var(--d0)' : 'var(--tm)', padding: '8px 20px', borderRadius: 40, fontSize: '.66rem', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .3s', whiteSpace: 'nowrap' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="props-selects">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={sel}>
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} style={sel}>
              {PRICES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="props-grid-section">
        <div style={{ fontSize: '.72rem', color: 'var(--tm)', marginBottom: 28, letterSpacing: '.5px' }}>
          {loading ? 'Loading…' : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} found`}
        </div>

        {loading ? (
          <div className="props-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 400, borderRadius: 'var(--r)', background: 'linear-gradient(90deg,var(--d2) 25%,var(--d3) 50%,var(--d2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏘️</div>
            <div style={{ fontSize: '.9rem', color: 'var(--tm)', marginBottom: 12 }}>No properties match your filters.</div>
            <button onClick={() => { setActiveType('All'); setStatusFilter(''); setPriceFilter(''); setSearchText(''); setSearchInput('') }}
              style={{ background: 'none', border: '1px solid var(--gold-b)', color: 'var(--gold)', padding: '10px 22px', borderRadius: 'var(--rx)', fontSize: '.7rem', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="props-grid">
            {properties.map((p, i) => <PropertyCard key={p.id} property={p} delay={i * 0.05} />)}
          </div>
        )}
      </section>

      <Footer />
      <Toast />
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .props-header {
          padding-top: 120px;
          padding-bottom: 48px;
          padding-left: 52px;
          padding-right: 52px;
          background: var(--d1);
          border-bottom: 1px solid var(--gbb);
        }
        .props-search-form {
          display: flex;
          gap: 10px;
          max-width: 520px;
          margin-bottom: 28px;
        }
        .props-filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .props-type-scroll {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .props-selects {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-left: auto;
        }
        .props-grid-section {
          padding: 52px 52px 96px;
        }
        .props-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        @media(max-width: 768px) {
          .props-header {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 100px !important;
          }
          .props-grid-section {
            padding: 28px 16px 60px !important;
          }
          .props-grid {
            grid-template-columns: repeat(auto-fill, minmax(min(300px,100%), 1fr)) !important;
            gap: 16px !important;
          }
          .props-search-form {
            max-width: 100% !important;
          }
        }
        @media(max-width: 600px) {
          .props-filter-row {
            flex-direction: column;
            align-items: stretch;
          }
          .props-type-scroll {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .props-type-scroll::-webkit-scrollbar { display: none }
          .props-selects {
            margin-left: 0;
            width: 100%;
          }
          .props-selects select { flex: 1; }
        }
      `}</style>
    </>
  )
}