import { useEffect, useState } from 'react'

let toastFn = null
export function showToast(message, type = 'info') {
  toastFn?.(message, type)
}

export default function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    toastFn = (message, type) => {
      setToast({ message, type })
      setTimeout(() => setToast(null), 3500)
    }
    return () => { toastFn = null }
  }, [])

  if (!toast) return null

  const colors = {
    success: { bg:'#1A5C3A', color:'#3DBE78' },
    error:   { bg:'#5c1a1a', color:'#FFA0A0' },
    info:    { bg:'var(--d2)', color:'var(--gold)', border:'1px solid var(--gold-b)' },
  }
  const c = colors[toast.type] || colors.info

  return (
    <div style={{
      position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)',
      zIndex:1100, padding:'12px 26px', borderRadius:40,
      background:c.bg, color:c.color, border:c.border||'none',
      fontSize:'.77rem', letterSpacing:'.3px', whiteSpace:'nowrap',
      boxShadow:'0 8px 28px rgba(0,0,0,.4)',
      animation:'toastIn .3s ease',
    }}>
      {toast.message}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  )
}
