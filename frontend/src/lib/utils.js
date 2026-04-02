export function formatPrice(n) {
  if (!n) return '—'
  if (n >= 10_000_000) return (n / 10_000_000).toFixed(1).replace(/\.0$/, '') + ' Cr'
  if (n >= 100_000)    return (n / 100_000).toFixed(1).replace(/\.0$/, '')    + ' L'
  return n.toLocaleString('en-PK')
}

export const TYPE_ICONS = {
  villa: '🏡', house: '🏠', apartment: '🏙️', plot: '🌿', commercial: '🏢',
}

export const TYPE_LABELS = {
  villa: 'Villa', house: 'House', apartment: 'Apartment',
  plot: 'Plot', commercial: 'Commercial',
}

export function waLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function cls(...args) {
  return args.filter(Boolean).join(' ')
}
