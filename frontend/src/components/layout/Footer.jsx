import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.5rem',fontWeight:600,letterSpacing:'4px',color:'var(--gold)',display:'block',marginBottom:14}}>
            Luxe<span style={{color:'var(--t)',fontWeight:300}}>Estate</span>
          </span>
          <p style={{fontSize:'.76rem',color:'var(--tm)',lineHeight:1.85,maxWidth:260}}>
            Premium real estate with a personal touch. Every buyer deserves a place they're proud to call home.
          </p>
        </div>
        <div>
          <h4 style={{fontSize:'.6rem',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',marginBottom:17}}>Properties</h4>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
            {['Villa','House','Apartment','Plot','Commercial'].map(t => (
              <li key={t}><Link to={`/properties?type=${t.toLowerCase()}`} style={{fontSize:'.75rem',color:'var(--tm)',transition:'color .3s'}}>{t}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{fontSize:'.6rem',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',marginBottom:17}}>Contact</h4>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
            <li><a href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER}`} target="_blank" rel="noreferrer" style={{fontSize:'.75rem',color:'var(--tm)'}}>WhatsApp Us</a></li>
            <li><a href={`tel:+${import.meta.env.VITE_WA_NUMBER}`} style={{fontSize:'.75rem',color:'var(--tm)'}}>+92 317 7908767</a></li>
          </ul>
        </div>
      </footer>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} LuxeEstate Pakistan. All rights reserved.</span>
        <span>Built for premium real estate.</span>
      </div>
      <style>{`
        .site-footer {
          background: var(--d1);
          border-top: 1px solid var(--gbb);
          padding: 56px 52px 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
        }
        .site-footer-bottom {
          background: var(--d1);
          border-top: 1px solid var(--gbb);
          padding: 16px 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-size: .66rem;
          color: var(--td);
        }
        @media(max-width:768px) {
          .site-footer {
            grid-template-columns: 1fr !important;
            padding: 36px 20px 20px !important;
            gap: 28px !important;
          }
          .site-footer-bottom {
            padding: 14px 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
          }
        }
      `}</style>
    </>
  )
}