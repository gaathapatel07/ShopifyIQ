/**
 * KPI Mini Charts — Polar-style
 * bar  → vertical bars (revenue, orders)
 * line → smooth line with dots (customers, AOV)
 * area → filled area (retention)
 */
import {
  ResponsiveContainer, AreaChart, Area,
  LineChart, Line, BarChart, Bar, Tooltip,
} from 'recharts'

interface Props {
  data: number[]
  type?: 'bar' | 'line' | 'area'
  color?: string
  height?: number
}

function Tip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--s0)', border: '1px solid var(--b2)', borderRadius: 8,
      padding: '5px 9px', fontSize: 11, fontFamily: 'var(--font)',
      color: 'var(--ink1)', boxShadow: 'var(--shadow-lg)', fontVariantNumeric: 'tabular-nums',
    }}>
      {typeof payload[0].value === 'number' && payload[0].value > 1000
        ? `$${payload[0].value.toLocaleString()}`
        : payload[0].value.toLocaleString()}
    </div>
  )
}

export default function KpiMiniChart({ data, type = 'bar', color = 'var(--a)', height = 72 }: Props) {
  const pts = data.map((v, i) => ({ i, v }))

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={pts} margin={{ top: 2, right: 1, bottom: 0, left: 1 }} barCategoryGap="28%">
          <Tooltip content={<Tip />} cursor={{ fill: 'var(--b1)', radius: 3 }} />
          <Bar dataKey="v" fill={color} radius={[3, 3, 0, 0]} opacity={0.80} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={pts} margin={{ top: 6, right: 4, bottom: 4, left: 4 }}>
          <Tooltip content={<Tip />} cursor={{ stroke: 'var(--b2)', strokeDasharray: '3 3' }} />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2}
            dot={{ r: 3, fill: color, stroke: 'var(--s0)', strokeWidth: 2 }}
            activeDot={{ r: 4.5, fill: color, stroke: 'var(--s0)', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // area
  const id = `kc-${Math.random().toString(36).slice(2, 7)}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={pts} margin={{ top: 6, right: 4, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Tooltip content={<Tip />} cursor={{ stroke: 'var(--b2)', strokeDasharray: '3 3' }} />
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          fill={`url(#${id})`} dot={false}
          activeDot={{ r: 4.5, fill: color, stroke: 'var(--s0)', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
