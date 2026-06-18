import { useState } from 'react'
import type { RetailRow } from '../data/types'
export default function useRetailData() {
  const [data, setData]       = useState<RetailRow[]>([])
  const [loading, setLoading] = useState(false)
  return { data, setData, loading, setLoading }
}
