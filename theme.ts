export type Theme = 'dark' | 'light'
export function getTheme(): Theme {
  const t = localStorage.getItem('iq-theme') as Theme | null
  if (t === 'dark' || t === 'light') return t
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark',  theme === 'dark')
  document.documentElement.classList.toggle('light', theme === 'light')
  localStorage.setItem('iq-theme', theme)
}
export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next); return next
}
