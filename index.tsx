import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line,
} from 'recharts'

const AXIS = {
  tick: { fontSize: 11, fill: 'var(--ink3)', fontFamily: 'var(--font)' },
  tickLine: false as const, axisLine: false as const,
}
const CURSOR = { stroke: 'var(--b3)', strokeWidth: 1, strokeDasharray: '3 3' }
const aDot   = (c: string) => ({ r: 4, fill: c, stroke: 'var(--s0)', strokeWidth: 2 })

function Tip({ active, payload, label, fmt }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--s0)', border:'1px solid var(--b2)', borderRadius:11,
      boxShadow:'var(--shadow-lg)', padding:'8px 12px', fontFamily:'var(--font)', minWidth:120 }}>
      <p style={{ fontSize:11, color:'var(--ink3)', marginBottom:6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background: p.stroke||p.fill }} />
            <span style={{ fontSize:11, color:'var(--ink3)' }}>{p.name}</span>
          </div>
          <span style={{ fontSize:12, fontWeight:600, color:'var(--ink1)', fontVariantNumeric:'tabular-nums' }}>
            {fmt ? fmt(p.value, p.dataKey) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function RevenueSparkline({ data, height = 180 }: {
  data: { month: string; revenue: number }[]; height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top:4, right:4, bottom:0, left:-22 }}>
        <defs>
          <linearGradient id="rsg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--a)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--a)" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--b1)" vertical={false} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={v => `$${v/1000}k`} />
        <Tooltip content={<Tip fmt={(v:number) => `$${v.toLocaleString()}`} />} cursor={CURSOR} />
        <Area type="monotone" dataKey="revenue" name="Revenue"
          stroke="var(--a)" strokeWidth={1.5} fill="url(#rsg)" dot={false} activeDot={aDot('var(--a)')} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function DualAreaChart({ data, height = 200 }: {
  data: { month: string; revenue: number; gross: number }[]; height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top:4, right:4, bottom:0, left:-22 }}>
        <defs>
          <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--a)"  stopOpacity={0.14} />
            <stop offset="100%" stopColor="var(--a)"  stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--up)" stopOpacity={0.10} />
            <stop offset="100%" stopColor="var(--up)" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--b1)" vertical={false} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={v => `$${v/1000}k`} />
        <Tooltip content={<Tip fmt={(v:number) => `$${v.toLocaleString()}`} />} cursor={CURSOR} />
        <Area type="monotone" dataKey="revenue" name="Revenue"
          stroke="var(--a)"  strokeWidth={1.5} fill="url(#dg1)" dot={false} activeDot={aDot('var(--a)')} />
        <Area type="monotone" dataKey="gross"   name="Gross"
          stroke="var(--up)" strokeWidth={1.5} fill="url(#dg2)" dot={false} strokeDasharray="4 4" activeDot={aDot('var(--up)')} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SlimBar({ data, dataKey, height = 160 }: {
  data: any[]; dataKey: string; height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top:4, right:4, bottom:0, left:-24 }} barSize={10}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--b1)" vertical={false} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} />
        <Tooltip content={<Tip />} cursor={{ fill:'var(--s2)', radius:4 }} />
        <Bar dataKey={dataKey} fill="var(--a)" radius={[3,3,0,0]} opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MultiLine({ data, lines, height = 200 }: {
  data: any[]
  lines: { key: string; name: string; color: string; dashed?: boolean }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top:4, right:4, bottom:0, left:-24 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--b1)" vertical={false} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={v => `${v}%`} />
        <Tooltip content={<Tip fmt={(v:number) => `${v}%`} />} cursor={CURSOR} />
        {lines.map(l => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.name}
            stroke={l.color} strokeWidth={1.5} dot={false}
            strokeDasharray={l.dashed ? '4 4' : undefined}
            activeDot={aDot(l.color)} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SegBar({ segments }: { segments: { label:string; value:number; color:string }[] }) {
  const total = segments.reduce((s,x) => s+x.value, 0)
  return (
    <div>
      <div className="seg-bar mb-4">
        {segments.map(s => (
          <div key={s.label} className="seg-chunk" style={{ width:`${(s.value/total)*100}%`, background:s.color }} />
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:s.color, flexShrink:0 }} />
              <span style={{ fontSize:12, color:'var(--ink2)' }}>{s.label}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--ink3)', fontVariantNumeric:'tabular-nums' }}>
                {s.value.toLocaleString()}
              </span>
              <span style={{ fontSize:11, color:'var(--ink4)', width:28, textAlign:'right' }}>
                {((s.value/total)*100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const pts = data.map((v,i) => ({ i, v }))
  const c   = up ? 'var(--up)' : 'var(--dn)'
  return (
    <ResponsiveContainer width={56} height={24}>
      <AreaChart data={pts} margin={{ top:2, right:0, bottom:0, left:0 }}>
        <defs>
          <linearGradient id={`sl-${up}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity={0.22} />
            <stop offset="100%" stopColor={c} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={c} strokeWidth={1.5}
          fill={`url(#sl-${up})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
