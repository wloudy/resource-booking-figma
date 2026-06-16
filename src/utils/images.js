export function resolveImageUrl(url, fallback) {
  const value = `${url || ''}`.trim()
  if (!value) return fallback
  if (/tenor\.com\/.*\/view\//i.test(value)) return fallback
  const isHttp = /^https?:\/\//i.test(value)
  const isPublicPath = value.startsWith('/')
  const isRelativePath = value.startsWith('./') || value.startsWith('../')
  const isDataUri = value.startsWith('data:image/')
  if (!isHttp && !isPublicPath && !isRelativePath && !isDataUri) return fallback
  return value
}

export function preloadImage(url, fallback, apply) {
  const candidate = resolveImageUrl(url, fallback)
  const image = new Image()
  image.onload = () => apply(candidate)
  image.onerror = () => apply(fallback)
  image.src = candidate
}
