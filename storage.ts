export function get<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(`iq:${key}`); return v !== null ? JSON.parse(v) : fallback } catch { return fallback }
}
export function set<T>(key: string, value: T): void {
  try { localStorage.setItem(`iq:${key}`, JSON.stringify(value)) } catch {}
}
