import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/admin')
  }

  const inp = { width:'100%',background:'var(--d3)',border:'1px solid var(--gbb)',borderRadius:'var(--rx)',color:'var(--t)',fontSize:'.84rem',padding:'12px 16px',outline:'none',transition:'border-color .3s',marginTop:0 }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--d0)',backgroundImage:'radial-gradient(ellipse at 20% 50%,rgba(201,168,76,.06) 0%,transparent 55%)',padding:'20px'}}>
      <div style={{background:'var(--d2)',border:'1px solid var(--gbb)',borderRadius:'var(--r)',padding:'44px 40px',width:'100%',maxWidth:420,animation:'fadeUp .5s ease both'}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.7rem',fontWeight:600,letterSpacing:'4px',color:'var(--gold)'}}>
            Luxe<span style={{color:'var(--t)',fontWeight:300}}>Estate</span>
          </div>
          <div style={{fontSize:'.68rem',letterSpacing:'3px',textTransform:'uppercase',color:'var(--tm)',marginTop:6}}>Admin Panel</div>
        </div>

        {error && (
          <div style={{background:'rgba(224,82,82,.1)',border:'1px solid rgba(224,82,82,.25)',borderRadius:'var(--rx)',padding:'11px 16px',fontSize:'.78rem',color:'var(--red-l)',marginBottom:20,textAlign:'center'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:'.63rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--tm)',marginBottom:7,display:'block'}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              placeholder="admin@luxeestate.pk"
              style={inp}
              onFocus={e=>e.target.style.borderColor='var(--gold-b)'}
              onBlur={e=>e.target.style.borderColor='var(--gbb)'}
            />
          </div>
          <div style={{marginBottom:28}}>
            <label style={{fontSize:'.63rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--tm)',marginBottom:7,display:'block'}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              placeholder="••••••••"
              style={inp}
              onFocus={e=>e.target.style.borderColor='var(--gold-b)'}
              onBlur={e=>e.target.style.borderColor='var(--gbb)'}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{width:'100%',background:'var(--gold)',color:'var(--d0)',border:'none',borderRadius:'var(--rx)',padding:14,fontSize:'.75rem',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
            {loading && <span style={{width:16,height:16,border:'2px solid rgba(0,0,0,.2)',borderTopColor:'var(--d0)',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/>}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:24}}>
          <a href="/" style={{fontSize:'.72rem',color:'var(--tm)',transition:'color .3s'}} onMouseEnter={e=>e.target.style.color='var(--gold)'} onMouseLeave={e=>e.target.style.color='var(--tm)'}>← Back to website</a>
        </div>
      </div>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:480px){
          div[style*="padding:'44px 40px'"] { padding:32px 20px !important }
        }
      `}</style>
    </div>
  )
}