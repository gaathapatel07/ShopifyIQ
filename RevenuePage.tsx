import { motion } from 'framer-motion'
import { Download, TrendingUp, Upload } from 'lucide-react'
import { DualAreaChart, SlimBar } from '../components/charts'
import Papa from 'papaparse'
import useRetailData from '../hooks/useRetailData'
import { calculateKPIs, getMonthlyRevenue, getCountryAnalytics, normalizeRows } from '../utils/analytics'

const FV = { hidden:{opacity:0,y:10}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.38,delay:i*0.06,ease:[0.22,1,0.36,1]}}) }

const staticMonthly = [
  {month:'Jan',revenue:12400,gross:9800, orders:94},
  {month:'Feb',revenue:19200,gross:15400,orders:128},
  {month:'Mar',revenue:24800,gross:19600,orders:176},
  {month:'Apr',revenue:31600,gross:25200,orders:241},
  {month:'May',revenue:44200,gross:35600,orders:298},
  {month:'Jun',revenue:58100,gross:47200,orders:402},
]

const staticCategories = [
  {name:'Electronics', revenue:24800,share:42.4,c:'var(--a)'},
  {name:'Wearables',   revenue:18200,share:31.1,c:'var(--up)'},
  {name:'Audio',       revenue:8600, share:14.7,c:'var(--warn)'},
  {name:'Accessories', revenue:6900, share:11.8,c:'var(--info)'},
]

const staticRegions = [
  {country:'United States',rev:42800,orders:402,up:true},
  {country:'United Kingdom',rev:31400,orders:298,up:true},
  {country:'Germany',       rev:24200,orders:186,up:true},
  {country:'Canada',        rev:18100,orders:148,up:true},
  {country:'Australia',     rev:12700,orders:94, up:true},
  {country:'France',        rev:8900, orders:72, up:false},
]

export default function RevenuePage() {
  const { data, setData } = useRetailData()
  const loaded = data.length > 0
  const kpis   = calculateKPIs(data)

  const handleCSV = (file: File) => {
    Papa.parse(file, { header:true, skipEmptyLines:true, complete:(r:any) => setData(normalizeRows(r.data)) })
  }

  // Build monthly data from CSV — merge with gross estimate (70% of revenue)
  const rawMonthly = loaded ? getMonthlyRevenue(data) : staticMonthly
  const monthly = rawMonthly.map(m => ({
    ...m,
    gross: Math.round((m.revenue as number) * 0.72),
    orders: staticMonthly.find(s => s.month === m.month)?.orders ?? 0,
  }))

  const regions = loaded ? getCountryAnalytics(data).map((r,i) => ({ country:r.country, rev:r.revenue, orders:r.orders, up:i<4 })) : staticRegions
  const totalRegRev = regions.reduce((s,r) => s+r.rev, 0)
  const maxCatRev   = staticCategories[0].revenue

  const kpis4 = [
    { label:'Total Revenue',   value: loaded ? `$${(kpis.totalRevenue/1000).toFixed(1)}K`  : '$148.2K', delta:'+18.2%', up:true  },
    { label:'Gross Profit',    value: loaded ? `$${(kpis.totalRevenue*0.72/1000).toFixed(1)}K` : '$52.8K', delta:'+9.4%', up:true  },
    { label:'Avg Order Value', value: loaded && kpis.totalOrders>0 ? `$${Math.round(kpis.totalRevenue/kpis.totalOrders)}` : '$324',  delta:'+7.1%', up:true  },
    { label:'Refund Rate',     value:'2.3%', delta:'−0.8%', up:true },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:18,fontWeight:700,letterSpacing:'-0.025em',color:'var(--ink1)'}}>Revenue</h1>
          <p style={{fontSize:12.5,color:'var(--ink3)',marginTop:3}}>
            {loaded ? `${data.length.toLocaleString()} rows · ${kpis.totalOrders} orders analysed` : 'June 2024 · 6-month view'}
          </p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <label className="btn-ghost" style={{fontSize:12.5,padding:'7px 14px',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:7}}>
            <Upload style={{width:14,height:14}} />{loaded ? 'Replace CSV' : 'Import CSV'}
            <input type="file" accept=".csv" style={{display:'none'}} onChange={e => e.target.files?.[0] && handleCSV(e.target.files[0])} />
          </label>
          <button className="btn-ghost" style={{fontSize:12.5,padding:'7px 14px',display:'flex',alignItems:'center',gap:7}}>
            <Download style={{width:14,height:14}}/>Export
          </button>
        </div>
      </div>

      {/* Stat rail */}
      <div className="stat-rail" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {kpis4.map((k,i) => (
          <motion.div key={k.label} custom={i} variants={FV} initial="hidden" animate="visible"
            className="stat-cell" style={{borderRight:i<3?'1px solid var(--b1)':'none'}}>
            <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em',color:'var(--ink3)',marginBottom:10}}>{k.label}</p>
            <p style={{fontSize:22,fontWeight:700,letterSpacing:'-0.03em',color:'var(--ink1)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{k.value}</p>
            <span className="badge" style={{marginTop:9,display:'inline-flex',background:k.up?'var(--up-bg)':'var(--dn-bg)',color:k.up?'var(--up)':'var(--dn)'}}>
              {k.up?'↑':'↓'} {k.delta}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Main chart */}
      <motion.div custom={0.2} variants={FV} initial="hidden" animate="visible" className="card lift">
        <div style={{padding:'18px 20px 12px',display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
          <div>
            <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>Revenue vs Gross Profit</p>
            <p style={{fontSize:11.5,color:'var(--ink3)',marginTop:2}}>{loaded ? 'From your CSV data' : '6-month trend'}</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14,fontSize:11,color:'var(--ink3)'}}>
            <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:14,height:2,background:'var(--a)',borderRadius:1}}/>Revenue</div>
            <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:14,height:0,borderBottom:'2px dashed var(--up)'}}/>Gross</div>
          </div>
        </div>
        <div style={{padding:'0 8px 14px'}}><DualAreaChart data={monthly} height={210} /></div>
      </motion.div>

      {/* Category + Orders */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}} className="mobile-full">
        <motion.div custom={0.25} variants={FV} initial="hidden" animate="visible" className="card lift" style={{padding:'20px'}}>
          <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)',marginBottom:4}}>By Category</p>
          <p style={{fontSize:11.5,color:'var(--ink3)',marginBottom:20}}>Revenue share this period</p>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {staticCategories.map((c,i) => (
              <div key={c.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:12.5,color:'var(--ink2)'}}>{c.name}</span>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <span style={{fontSize:11,color:'var(--ink3)'}}>{c.share}%</span>
                    <span style={{fontSize:12.5,fontWeight:600,fontFamily:'var(--mono)',color:'var(--ink1)',fontVariantNumeric:'tabular-nums'}}>${(c.revenue/1000).toFixed(1)}K</span>
                  </div>
                </div>
                <div style={{height:4,background:'var(--s2)',borderRadius:99,overflow:'hidden'}}>
                  <motion.div initial={{width:0}} animate={{width:`${(c.revenue/maxCatRev)*100}%`}}
                    transition={{delay:0.3+i*0.07,duration:0.55,ease:'easeOut'}}
                    style={{height:'100%',background:c.c,borderRadius:99}} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div custom={0.3} variants={FV} initial="hidden" animate="visible" className="card lift" style={{padding:'20px'}}>
          <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)',marginBottom:4}}>Order Volume</p>
          <p style={{fontSize:11.5,color:'var(--ink3)',marginBottom:16}}>Monthly count</p>
          <SlimBar data={staticMonthly} dataKey="orders" height={160} />
        </motion.div>
      </div>

      {/* Regions table */}
      <motion.div custom={0.35} variants={FV} initial="hidden" animate="visible" className="card">
        <div style={{padding:'14px 20px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>By Region</p>
            <p style={{fontSize:11.5,color:'var(--ink3)',marginTop:2}}>{loaded ? 'From your data' : 'Top markets this period'}</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11.5,color:'var(--a)'}}>
            <TrendingUp style={{width:13,height:13}}/>Overall +14.2%
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto auto auto',gap:'0 16px',padding:'8px 20px 6px',background:'var(--s1)',borderBottom:'1px solid var(--b1)'}}>
          {['#','Market','Revenue','Orders','Share'].map(h => (
            <span key={h} style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--ink3)'}}>{h}</span>
          ))}
        </div>
        {regions.map((r,i) => (
          <motion.div key={r.country} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4+i*0.05}}
            className="data-row" style={{display:'grid',gridTemplateColumns:'auto 1fr auto auto auto',gap:'0 16px',alignItems:'center',padding:'10px 20px',borderBottom:i<regions.length-1?'1px solid var(--b1)':'none'}}>
            <span style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--ink4)'}}>{i+1}</span>
            <span style={{fontSize:13,fontWeight:500,color:'var(--ink1)'}}>{r.country}</span>
            <span style={{fontSize:12.5,fontWeight:600,fontFamily:'var(--mono)',color:'var(--ink1)',fontVariantNumeric:'tabular-nums'}}>${(r.rev/1000).toFixed(1)}K</span>
            <span style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--ink2)',fontVariantNumeric:'tabular-nums'}}>{r.orders.toLocaleString()}</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{flex:1,height:3,background:'var(--s2)',borderRadius:99,overflow:'hidden',minWidth:40}}>
                <div style={{height:'100%',background:'var(--a)',borderRadius:99,opacity:0.65,width:`${totalRegRev>0?(r.rev/regions[0].rev)*100:0}%`}} />
              </div>
              <span style={{fontSize:11,color:'var(--ink4)',width:28,textAlign:'right'}}>{totalRegRev>0?((r.rev/totalRegRev)*100).toFixed(0):0}%</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
