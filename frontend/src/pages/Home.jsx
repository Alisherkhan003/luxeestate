import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PropertyCard from '../components/public/PropertyCard'
import Toast, { showToast } from '../components/ui/Toast'
import { useProperties } from '../hooks/useProperties'
import { formatPrice, waLink, TYPE_ICONS } from '../lib/utils'
import { WA_NUMBER } from '../lib/supabase'

const TYPES  = ['All','Villa','House','Apartment','Plot','Commercial']
const PRICES = [
  {label:'Any Price',    value:''},
  {label:'Under 1 Cr',  value:'0-10000000'},
  {label:'1 – 5 Crore', value:'10000000-50000000'},
  {label:'5 – 10 Crore',value:'50000000-100000000'},
  {label:'10 Crore +',  value:'100000000-999999999'},
]

export default function Home() {
  const navigate = useNavigate()
  const [activeType,   setActiveType]   = useState('All')
  const [statusFilter, setStatusFilter] = useState('')
  const [priceFilter,  setPriceFilter]  = useState('')
  const [heroSearch,   setHeroSearch]   = useState('')
  const [heroType,     setHeroType]     = useState('')
  const [heroPrice,    setHeroPrice]    = useState('')
  const [filters, setFilters] = useState({type:'',status:'',search:'',minPrice:null,maxPrice:null})
  const revRefs = useRef([])

  const { properties, loading } = useProperties(filters)

  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)} })
    },{threshold:.1})
    revRefs.current.forEach(r=>r&&obs.observe(r))
    return ()=>obs.disconnect()
  },[properties])

  function addRev(el){ if(el&&!revRefs.current.includes(el)) revRefs.current.push(el) }

  function applyFilters({type,status,price,search}){
    const t = type   !== undefined ? type   : activeType==='All'?'':activeType.toLowerCase()
    const s = status !== undefined ? status : statusFilter
    const p = price  !== undefined ? price  : priceFilter
    const q = search !== undefined ? search : filters.search
    const [mn,mx] = p ? p.split('-').map(Number) : [null,null]
    setFilters({type:t,status:s,minPrice:mn||null,maxPrice:mx||null,search:q})
  }

  function handleHeroSearch(){
    const [mn,mx] = heroPrice?heroPrice.split('-').map(Number):[null,null]
    setFilters({type:heroType,status:'',search:heroSearch,minPrice:mn||null,maxPrice:mx||null})
    document.getElementById('properties')?.scrollIntoView({behavior:'smooth'})
  }

  function sharePortfolio(){
    const url = window.location.origin
    if(navigator.share) navigator.share({title:'LuxeEstate Portfolio',url})
    else if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>showToast('🔗 Link copied!','info'))
  }

  const available = properties.filter(p=>p.status==='available')
  const sold      = properties.filter(p=>p.status==='sold')

  return (
    <>
      <Navbar/>

      {/* HERO */}
      <section id="hero" style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:"url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80&auto=format&fit=crop') center/cover no-repeat",filter:'brightness(.32) saturate(.7)'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(6,6,6,.08),rgba(6,6,6,.6))'}}/>
        <div style={{position:'relative',zIndex:2,textAlign:'center',padding:'120px 20px 80px',maxWidth:900,width:'100%',animation:'fadeUp .9s .15s both'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:12,fontSize:'.6rem',letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:18}}>
            <span style={{width:28,height:1,background:'var(--gold)',opacity:.5,display:'block'}}/>
            Premium Real Estate · Pakistan
            <span style={{width:28,height:1,background:'var(--gold)',opacity:.5,display:'block'}}/>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2.4rem,7vw,6rem)',fontWeight:300,lineHeight:1.08,letterSpacing:1,marginBottom:18}}>
            Find Your <em style={{fontStyle:'italic',color:'var(--gold)'}}>Perfect</em><br/>Dream Property
          </h1>
          <p style={{fontSize:'clamp(.78rem,2vw,.9rem)',color:'var(--tm)',maxWidth:420,margin:'0 auto 36px',lineHeight:1.9}}>
            Curated villas, apartments & plots — handpicked with transparency and trust.
          </p>

          {/* Search bar */}
          <div className="hero-search-bar">
            <input value={heroSearch} onChange={e=>setHeroSearch(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleHeroSearch()}
              placeholder="Search location, name…"
              style={{flex:1,minWidth:100,background:'none',border:'none',outline:'none',color:'var(--t)',fontSize:'.82rem',padding:'6px 0'}}/>
            <div className="hs-extras" style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:1,height:22,background:'rgba(255,255,255,.12)'}}/>
              <select value={heroType} onChange={e=>setHeroType(e.target.value)}
                style={{background:'none !important',backgroundImage:'none !important',border:'none',color:'var(--tm)',fontSize:'.74rem',padding:'0 4px',minWidth:70}}>
                <option value="">Any Type</option>
                {['villa','house','apartment','plot','commercial'].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <button onClick={handleHeroSearch} style={{background:'var(--gold)',border:'none',color:'var(--d0)',padding:'12px 22px',borderRadius:50,fontSize:'.68rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',flexShrink:0,transition:'all .3s'}}>
              Search
            </button>
          </div>

          {/* Stats */}
          <div style={{display:'flex',gap:40,justifyContent:'center',marginTop:48,flexWrap:'wrap'}}>
            {[{num:available.length||'—',lbl:'Available'},{num:sold.length||'—',lbl:'Sold'},{num:'100%',lbl:'Trusted'}].map(s=>(
              <div key={s.lbl} style={{textAlign:'center'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:600,color:'var(--gold)',display:'block',lineHeight:1}}>{s.num}</span>
                <span style={{fontSize:'.58rem',letterSpacing:'2px',textTransform:'uppercase',color:'var(--tm)',marginTop:4,display:'block'}}>{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div id="properties" className="filter-bar">
        <div className="filter-type-row">
          {TYPES.map(t=>(
            <button key={t} onClick={()=>{setActiveType(t);applyFilters({type:t==='All'?'':t.toLowerCase()})}}
              style={{background:activeType===t?'var(--gold)':'var(--d2)',border:`1px solid ${activeType===t?'var(--gold)':'var(--gbb)'}`,color:activeType===t?'var(--d0)':'var(--tm)',padding:'7px 16px',borderRadius:40,fontSize:'.64rem',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',transition:'all .3s',whiteSpace:'nowrap'}}>
              {t}
            </button>
          ))}
        </div>
        <div className="filter-select-row">
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);applyFilters({status:e.target.value})}}
            style={{background:'var(--d2)',border:'1px solid var(--gbb)',color:'var(--t)',padding:'7px 32px 7px 12px',borderRadius:'var(--rx)',fontSize:'.66rem',outline:'none'}}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
          <select value={priceFilter} onChange={e=>{setPriceFilter(e.target.value);applyFilters({price:e.target.value})}}
            style={{background:'var(--d2)',border:'1px solid var(--gbb)',color:'var(--t)',padding:'7px 32px 7px 12px',borderRadius:'var(--rx)',fontSize:'.66rem',outline:'none'}}>
            {PRICES.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* PROPERTY GRID */}
      <section style={{paddingBottom:80,paddingLeft:20,paddingRight:20}}>
        <div ref={addRev} className="reveal" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{fontSize:'.6rem',letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>Our Inventory</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:300}}>
              Available <em style={{fontStyle:'italic',color:'var(--gold)'}}>Properties</em>
            </h2>
          </div>
          <p style={{fontSize:'.78rem',color:'var(--tm)'}}>{loading?'Loading…':`${properties.length} found`}</p>
        </div>

        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(320px,100%),1fr))',gap:20}}>
            {[1,2,3].map(i=><div key={i} style={{height:380,borderRadius:'var(--r)',background:'linear-gradient(90deg,var(--d2) 25%,var(--d3) 50%,var(--d2) 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.5s infinite'}}/>)}
          </div>
        ) : properties.length===0 ? (
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontSize:'3rem',marginBottom:12}}>🏘️</div>
            <div style={{color:'var(--tm)',fontSize:'.84rem',marginBottom:16}}>No properties match your filters.</div>
            <button onClick={()=>{setActiveType('All');setStatusFilter('');setPriceFilter('');setFilters({type:'',status:'',search:'',minPrice:null,maxPrice:null})}}
              style={{background:'none',border:'1px solid var(--gold-b)',color:'var(--gold)',padding:'9px 20px',borderRadius:'var(--rx)',fontSize:'.68rem',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer'}}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(320px,100%),1fr))',gap:20}}>
            {properties.map((p,i)=><PropertyCard key={p.id} property={p} delay={i*.06}/>)}
          </div>
        )}
      </section>

      {/* MAP */}
      <section id="map" style={{background:'var(--d1)',padding:'80px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(340px,100%),1fr))',gap:48,alignItems:'center',maxWidth:1100,margin:'0 auto'}}>
          <div ref={addRev} className="reveal">
            <div style={{fontSize:'.6rem',letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:10}}>Find Us</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:300,lineHeight:1.2,marginBottom:14}}>
              Precise <em style={{fontStyle:'italic',color:'var(--gold)'}}>Location</em><br/>Tracking
            </h2>
            <p style={{fontSize:'.78rem',color:'var(--tm)',lineHeight:1.85,marginBottom:24}}>Every property is geotagged so customers can see exactly where it is before visiting.</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {available.slice(0,4).map(p=>(
                <div key={p.id} onClick={()=>navigate(`/properties/${p.id}`)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'var(--d2)',border:'1px solid var(--gbb)',borderRadius:'var(--rs)',cursor:'pointer',transition:'border-color .3s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold-b)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--gbb)'}>
                  <div style={{width:36,height:36,background:'var(--gold-dim)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',flexShrink:0}}>{TYPE_ICONS[p.type]||'🏘️'}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'.78rem',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.title}</div>
                    <div style={{fontSize:'.65rem',color:'var(--tm)'}}>{p.location}</div>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',color:'var(--gold)',fontWeight:600,whiteSpace:'nowrap'}}>{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          </div>
          <div ref={addRev} className="reveal" style={{height:420,background:'var(--d2)',border:'1px solid var(--gbb)',borderRadius:'var(--r)',overflow:'hidden',position:'relative',minHeight:300}}>
            <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=74.28,31.48,74.40,31.56&layer=mapnik"
              style={{width:'100%',height:'100%',border:'none',filter:'invert(.88) hue-rotate(188deg) saturate(.75) brightness(.68)'}} loading="lazy" title="Map"/>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}}>
              <div style={{width:16,height:16,background:'var(--gold)',borderRadius:'50%',border:'2.5px solid white',boxShadow:'0 0 0 6px rgba(201,168,76,.22)',animation:'pulse 2s infinite'}}/>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" style={{padding:'80px 20px',background:'var(--d0)'}}>
        <div ref={addRev} className="reveal" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:36,flexWrap:'wrap',gap:16,maxWidth:1100,margin:'0 auto 36px'}}>
          <div>
            <div style={{fontSize:'.6rem',letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>Digital Catalog</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:300}}>
              Shareable <em style={{fontStyle:'italic',color:'var(--gold)'}}>Portfolio</em>
            </h2>
          </div>
          <p style={{fontSize:'.78rem',color:'var(--tm)',maxWidth:320,lineHeight:1.8}}>Send one link — customers see all available properties instantly.</p>
        </div>

        {available.length>0 ? (
          <div ref={addRev} className="reveal portfolio-grid">
            {available.slice(0,6).map((p,i)=>(
              <div key={p.id} onClick={()=>navigate(`/properties/${p.id}`)}
                style={{position:'relative',overflow:'hidden',cursor:'pointer',background:'var(--d3)',aspectRatio:'4/3'}}
                onMouseEnter={e=>{ const img=e.currentTarget.querySelector('img'); if(img) img.style.transform='scale(1.07)' }}
                onMouseLeave={e=>{ const img=e.currentTarget.querySelector('img'); if(img) img.style.transform='scale(1)' }}>
                {p.image_urls?.[0]
                  ? <img src={p.image_urls[0]} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .5s'}}/>
                  : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem'}}>{TYPE_ICONS[p.type]}</div>
                }
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(6,6,6,.8) 0%,transparent 55%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:14}}>
                  <div style={{fontSize:'.55rem',letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold)',marginBottom:3}}>{p.type}</div>
                  <div style={{fontSize:'.78rem',fontWeight:500}}>{p.title}</div>
                  <div style={{fontSize:'.7rem',color:'var(--gold)'}}>{formatPrice(p.price)} PKR</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'40px 20px',color:'var(--tm)',marginBottom:32}}>No available properties yet.</div>
        )}

        <div ref={addRev} className="reveal" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',maxWidth:1100,margin:'0 auto'}}>
          <button onClick={sharePortfolio} style={{background:'var(--gold)',color:'var(--d0)',padding:'13px 28px',borderRadius:4,border:'none',fontSize:'.7rem',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',transition:'all .3s'}}>
            🔗 Share Portfolio
          </button>
          <a href={waLink(WA_NUMBER,'Check out these premium properties from LuxeEstate Pakistan: '+window.location.origin)} target="_blank" rel="noreferrer"
            style={{background:'#1C5E2F',color:'#7FFFC4',border:'1px solid rgba(37,211,102,.3)',padding:'13px 28px',borderRadius:4,fontSize:'.7rem',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>
            💬 Share on WhatsApp
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{background:'var(--d1)',padding:'80px 20px',textAlign:'center'}}>
        <div ref={addRev} className="reveal" style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{fontSize:'.6rem',letterSpacing:'4px',textTransform:'uppercase',color:'var(--gold)',marginBottom:10}}>Get In Touch</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:300,marginBottom:14}}>
            Ready to <em style={{fontStyle:'italic',color:'var(--gold)'}}>Find</em> Your Home?
          </h2>
          <p style={{fontSize:'.78rem',color:'var(--tm)',margin:'0 auto 36px',maxWidth:380,lineHeight:1.85}}>Reach out directly — we respond within minutes on WhatsApp.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14}}>
            {[
              {href:`https://wa.me/${WA_NUMBER}?text=Hello!+I'm+interested+in+a+property.`,icon:'💬',label:'WhatsApp',val:'+92 317 7908767'},
              {href:`tel:+${WA_NUMBER}`,icon:'📞',label:'Call',val:'+92 317 7908767'},
              {href:'/properties',icon:'🏛️',label:'Properties',val:'View All Listings'},
            ].map(c=>(
              <a key={c.label} href={c.href}
                style={{background:'var(--d2)',border:'1px solid var(--gbb)',borderRadius:'var(--r)',padding:'24px 16px',display:'block',transition:'all .3s',textDecoration:'none'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold-b)';e.currentTarget.style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gbb)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{fontSize:'1.7rem',marginBottom:10}}>{c.icon}</div>
                <div style={{fontSize:'.64rem',letterSpacing:'2px',textTransform:'uppercase',color:'var(--tm)',marginBottom:5}}>{c.label}</div>
                <div style={{fontSize:'.78rem',color:'var(--t)'}}>{c.val}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer/>

      {/* WhatsApp float */}
      <a href={waLink(WA_NUMBER,"Hello! I found LuxeEstate website and I'm interested in a property.")} target="_blank" rel="noreferrer"
        style={{position:'fixed',bottom:22,right:22,zIndex:800,width:52,height:52,borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',boxShadow:'0 8px 28px rgba(37,211,102,.45)',animation:'float 3s ease-in-out infinite',textDecoration:'none'}}>
        💬
      </a>

      <Toast/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulse   { 0%,100%{box-shadow:0 0 0 6px rgba(201,168,76,.2)} 50%{box-shadow:0 0 0 16px rgba(201,168,76,.04)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
        .reveal.vis{opacity:1;transform:translateY(0)}

        /* Hero search bar */
        .hero-search-bar {
          display:flex;
          align-items:center;
          gap:8px;
          background:rgba(255,255,255,.07);
          backdrop-filter:blur(28px);
          border:1px solid rgba(255,255,255,.13);
          border-radius:60px;
          padding:6px 6px 6px 20px;
          max-width:680px;
          margin:0 auto;
          box-shadow:0 20px 60px rgba(0,0,0,.45);
        }
        .hs-extras { display:flex }

        /* Filter bar */
        .filter-bar {
          padding:48px 20px 32px;
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }
        .filter-type-row {
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
          flex:1;
        }
        .filter-select-row {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          align-items:center;
          margin-left:auto;
        }

        /* Portfolio grid */
        .portfolio-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr));
          gap:3px;
          border-radius:var(--r);
          overflow:hidden;
          border:1px solid var(--gbb);
          margin-bottom:32px;
          max-width:1100px;
          margin-left:auto;
          margin-right:auto;
        }

        @media(max-width:600px){
          .hero-search-bar { padding:6px 6px 6px 14px; border-radius:14px; }
          .hs-extras { display:none }
          .filter-bar { padding:28px 16px 20px; flex-direction:column; align-items:stretch; }
          .filter-type-row { overflow-x:auto; flex-wrap:nowrap; padding-bottom:4px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
          .filter-type-row::-webkit-scrollbar { display:none }
          .filter-select-row { margin-left:0; width:100%; }
          .filter-select-row select { flex:1; }
          .portfolio-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:400px){
          .portfolio-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </>
  )
}