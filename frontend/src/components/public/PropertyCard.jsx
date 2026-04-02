import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice, TYPE_ICONS, TYPE_LABELS, waLink } from '../../lib/utils'
import { WA_NUMBER } from '../../lib/supabase'

export default function PropertyCard({ property: p, delay=0 }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const isSold   = p.status === 'sold'
  const mainImg  = p.image_urls?.[0]

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={()=>navigate(`/properties/${p.id}`)}
      style={{
        background:'var(--d2)', border:`1px solid ${hovered?'var(--gold-b)':'var(--gbb)'}`,
        borderRadius:'var(--r)', overflow:'hidden', cursor:'pointer',
        transform:hovered?'translateY(-6px)':'translateY(0)',
        boxShadow:hovered?'0 24px 60px rgba(0,0,0,.5)':'none',
        transition:'transform .4s cubic-bezier(.25,.46,.45,.94), box-shadow .4s, border-color .3s',
        opacity:isSold?.55:1,
        animation:`fadeUp .5s ${delay}s both`,
      }}>

      {/* Image */}
      <div style={{position:'relative',height:'clamp(180px,25vw,230px)',overflow:'hidden',background:'var(--d3)'}}>
        {mainImg ? (
          <img src={mainImg} alt={p.title} loading="lazy"
            style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .6s',transform:hovered?'scale(1.06)':'scale(1)'}}/>
        ) : (
          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',color:'var(--td)'}}>
            {TYPE_ICONS[p.type]||'🏘️'}
          </div>
        )}
        <span style={{position:'absolute',top:12,left:12,padding:'5px 11px',borderRadius:4,fontSize:'.57rem',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',background:isSold?'#1a1a1a':'var(--gold)',color:isSold?'var(--tm)':'var(--d0)'}}>
          {isSold?'Sold':'Available'}
        </span>
        {!isSold && (
          <a href={waLink(WA_NUMBER,`I'm interested in "${p.title}" at ${p.location}`)}
            target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
            style={{position:'absolute',bottom:12,right:12,width:38,height:38,borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',boxShadow:'0 4px 14px rgba(37,211,102,.4)',opacity:hovered?1:0,transform:hovered?'scale(1)':'scale(.75)',transition:'all .3s',textDecoration:'none'}}>
            💬
          </a>
        )}
      </div>

      {/* Body */}
      <div style={{padding:'18px 16px'}}>
        <div style={{fontSize:'.58rem',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>
          {TYPE_LABELS[p.type]} · {p.location?.split(',')[0]}
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',fontWeight:600,marginBottom:8,lineHeight:1.3}}>
          {p.title}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,fontSize:'.68rem',color:'var(--tm)',marginBottom:14}}>
          <svg width="10" height="12" viewBox="0 0 12 14" fill="none"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 6 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor" opacity=".5"/></svg>
          {p.location}
        </div>
        {(p.area||p.beds||p.baths) && (
          <div style={{display:'flex',gap:14,padding:'11px 0',borderTop:'1px solid var(--gbb)',borderBottom:'1px solid var(--gbb)',marginBottom:14,flexWrap:'wrap'}}>
            {p.beds && p.type!=='plot' && (
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                <span style={{fontSize:'.78rem',fontWeight:500}}>{p.beds}</span>
                <span style={{fontSize:'.55rem',color:'var(--tm)',letterSpacing:'1px',textTransform:'uppercase'}}>{p.type==='commercial'?'Units':'Beds'}</span>
              </div>
            )}
            {p.baths && p.type!=='plot' && (
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                <span style={{fontSize:'.78rem',fontWeight:500}}>{p.baths}</span>
                <span style={{fontSize:'.55rem',color:'var(--tm)',letterSpacing:'1px',textTransform:'uppercase'}}>Baths</span>
              </div>
            )}
            {p.area && (
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                <span style={{fontSize:'.78rem',fontWeight:500}}>{p.area}</span>
                <span style={{fontSize:'.55rem',color:'var(--tm)',letterSpacing:'1px',textTransform:'uppercase'}}>Area</span>
              </div>
            )}
          </div>
        )}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.35rem',fontWeight:600,color:'var(--gold)'}}>
            {formatPrice(p.price)} <small style={{fontFamily:'Montserrat,sans-serif',fontSize:'.62rem',color:'var(--tm)',fontWeight:300}}>PKR</small>
          </div>
          <button style={{width:36,height:36,borderRadius:'50%',border:'1px solid var(--gbb)',background:'none',color:'var(--t)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .3s',flexShrink:0}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--gold)';e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--d0)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.borderColor='var(--gbb)';e.currentTarget.style.color='var(--t)'}}
            onClick={e=>{e.stopPropagation();navigate(`/properties/${p.id}`)}}>→</button>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
