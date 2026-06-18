import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ArrowUpRight, Upload, TrendingUp, AlertTriangle, CheckCircle2, DollarSign, ShoppingCart, Users, BarChart3, Database } from 'lucide-react'
import { RevenueSparkline } from '../components/charts'
import KpiMiniChart from '../components/charts/KpiMiniChart'
import Papa from 'papaparse'
import useRetailData from '../hooks/useRetailData'
import { calculateKPIs, getMonthlyRevenue, getTopProducts, normalizeRows } from '../utils/analytics'

const FV = { hidden:{opacity:0,y:10}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.38,delay:i*0.06,ease:[0.22,1,0.36,1]}}) }
const staticRev = [{month:'Jan',revenue:12400},{month:'Feb',revenue:19200},{month:'Mar',revenue:24800},{month:'Apr',revenue:31600},{month:'May',revenue:44200},{month:'Jun',revenue:58100}]
const staticSignals = [
  {icon:TrendingUp,   c:'var(--up)',  bg:'var(--up-bg)',  border:'rgba(82,201,138,0.22)', title:'Electronics +31% WoW',     body:'Strongest category — consider increasing ad spend.'},
  {icon:AlertTriangle,c:'var(--warn)',bg:'var(--warn-bg)',border:'rgba(212,168,85,0.22)', title:'Earbuds Pro — 5 days stock',body:'Urgent restock at current sell rate.'},
  {icon:CheckCircle2, c:'var(--up)',  bg:'var(--up-bg)',  border:'rgba(82,201,138,0.22)', title:'Retention improved +12%',  body:'Email automation at day 7 is working.'},
]
const staticActivity = [
  {c:'var(--a)',   t:'12 new orders placed',  s:'3m ago' },
  {c:'var(--dn)',  t:'Customer #4821 at risk', s:'14m ago'},
  {c:'var(--warn)',t:'Earbuds Pro low stock',  s:'1h ago' },
  {c:'var(--up)', t:'Revenue target hit 78%', s:'2h ago' },
  {c:'var(--a)',  t:'$1,240 order from UK',   s:'3h ago' },
]
const goals = [
  {label:'Revenue',   val:78,c:'var(--a)'},
  {label:'Customers', val:64,c:'var(--up)'},
  {label:'Retention', val:82,c:'var(--a)'},
  {label:'Conversion',val:52,c:'var(--warn)'},
]
function calcDelta(arr:number[]){const p=arr[arr.length-2],c=arr[arr.length-1];const pct=((c-p)/p)*100;return{str:`${pct>=0?'+':''}${pct.toFixed(1)}%`,up:pct>=0}}

export default function OverviewPage() {
  const {data,setData} = useRetailData()
  const loaded = data.length > 0
  const kpis   = calculateKPIs(data)
  const [tab,setTab]           = useState('6M')
  const [uploading,setUploading] = useState(false)
  const [error,setError]       = useState('')
  const [inputKey,setInputKey] = useState(0)

  const handleFile = (file:File) => {
    if(!file)return
    setUploading(true); setError('')
    Papa.parse(file,{header:true,skipEmptyLines:true,dynamicTyping:false,
      complete:(result:any)=>{
        try{
          const clean=normalizeRows(result.data as any[])
          if(clean.length===0){setError('No valid rows found. Ensure columns: InvoiceNo, Description, Quantity, UnitPrice.')}
          else{setData(clean);setError('')}
        }catch{setError('Failed to parse CSV.')}
        finally{setUploading(false);setInputKey(k=>k+1)}
      },
      error:(err:any)=>{setError(`Parse error: ${err?.message??'unknown'}`);setUploading(false);setInputKey(k=>k+1)},
    })
  }

  const monthlyData = loaded ? getMonthlyRevenue(data) : staticRev
  const topProducts = loaded ? getTopProducts(data) : [
    {name:'Wireless Earbuds Pro', revenue:24800,quantity:310},
    {name:'Smart Watch Series X', revenue:18200,quantity:228},
    {name:'Bluetooth Speaker Max',revenue:15400,quantity:205},
    {name:'USB-C Charging Hub',   revenue:9600, quantity:160},
    {name:'LED Desk Lamp Pro',    revenue:7100, quantity:142},
  ]
  const kpiDef = [
    {label:'Revenue',       icon:DollarSign,  value:loaded?`$${(kpis.totalRevenue/1000).toFixed(1)}K`:'$148.2K', spark:loaded&&monthlyData.length>=2?monthlyData.map(m=>m.revenue):[12400,19200,24800,31600,44200,58100], type:'bar'  as const,color:'var(--a)'},
    {label:'Orders',        icon:ShoppingCart,value:loaded?kpis.totalOrders.toLocaleString():'3,842',            spark:[94,128,176,241,298,402],   type:'bar'  as const,color:'var(--up)'},
    {label:'Customers',     icon:Users,       value:loaded?kpis.totalCustomers.toLocaleString():'2,341',          spark:[880,1040,1280,1620,1900,2341],type:'line' as const,color:'var(--info)'},
    {label:'Avg Order Value',icon:BarChart3,  value:loaded&&kpis.totalOrders>0?`$${Math.round(kpis.totalRevenue/kpis.totalOrders).toLocaleString()}`:'$324', spark:[280,290,304,310,316,324],type:'line' as const,color:'var(--warn)'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h1 style={{fontSize:18,fontWeight:700,letterSpacing:'-0.025em',color:'var(--ink1)'}}>{loaded?'Your Store':'Good morning !'}</h1>
        <p style={{fontSize:12.5,color:'var(--ink3)',marginTop:3}}>{loaded?`${data.length.toLocaleString()} rows loaded · ${kpis.totalOrders.toLocaleString()} orders`:'Upload a CSV to see your real analytics'}</p>
      </div>

      {!loaded&&(
        <div className="card" style={{padding:'52px 24px',textAlign:'center'}}>
          <div style={{width:56,height:56,borderRadius:16,background:'var(--a3)',border:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            <Database style={{width:26,height:26,color:'var(--a)'}}/>
          </div>
          <h3 style={{fontSize:18,fontWeight:700,color:'var(--ink1)',marginBottom:10}}>Connect your store data</h3>
          <p style={{fontSize:13.5,color:'var(--ink3)',maxWidth:360,margin:'0 auto 28px',lineHeight:1.7}}>Upload a CSV export from Shopify to see your real revenue, customers, and product analytics.</p>
          <label htmlFor="csv-main" style={{display:'inline-flex',alignItems:'center',gap:9,fontSize:14,fontWeight:700,color:'var(--bg)',padding:'13px 28px',borderRadius:12,background:uploading?'var(--ink3)':'var(--a)',cursor:uploading?'wait':'pointer',fontFamily:'var(--font)'}}>
            <Upload style={{width:16,height:16}}/>{uploading?'Reading CSV…':'Upload CSV to get started'}
          </label>
          <input key={inputKey} id="csv-main" type="file" accept=".csv,text/csv" disabled={uploading} style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
          {error&&<p style={{fontSize:12.5,color:'var(--dn)',marginTop:14,maxWidth:420,margin:'14px auto 0',lineHeight:1.6}}>⚠ {error}</p>}
          <p style={{fontSize:12,color:'var(--ink4)',marginTop:16}}>Or explore with sample data shown below ↓</p>
        </div>
      )}

      {loaded&&(
        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <span style={{fontSize:12.5,color:'var(--up)',fontWeight:600}}>✓ {data.length.toLocaleString()} rows loaded successfully</span>
          <label htmlFor="csv-replace" className="btn-ghost" style={{fontSize:12,padding:'5px 12px',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
            <Upload style={{width:12,height:12}}/>Replace CSV
          </label>
          <input key={`r${inputKey}`} id="csv-replace" type="file" accept=".csv,text/csv" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}}/>
          {error&&<span style={{fontSize:12,color:'var(--dn)'}}>⚠ {error}</span>}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="mobile-full">
        {kpiDef.map((k,i)=>{
          const Icon=k.icon; const d=calcDelta(k.spark)
          return (
            <motion.div key={k.label} custom={i} variants={FV} initial="hidden" animate="visible"
              className="card lift" style={{padding:'18px 18px 14px',cursor:'default'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <p style={{fontSize:11.5,fontWeight:500,color:'var(--ink3)'}}>{k.label}</p>
                <div style={{width:28,height:28,borderRadius:7,background:'var(--s2)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon style={{width:13,height:13,color:'var(--ink3)'}}/>
                </div>
              </div>
              <p style={{fontSize:28,fontWeight:700,letterSpacing:'-0.04em',color:'var(--ink1)',lineHeight:1,fontVariantNumeric:'tabular-nums',marginBottom:8}}>{k.value}</p>
              <span className="badge" style={{background:d.up?'var(--up-bg)':'var(--dn-bg)',color:d.up?'var(--up)':'var(--dn)',marginBottom:14,display:'inline-flex'}}>
                {d.up?'↑':'↓'} {d.str} vs last period
              </span>
              <KpiMiniChart data={k.spark} type={k.type} color={k.color} height={72}/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
                <span style={{fontSize:9.5,color:'var(--ink4)'}}>Jan</span>
                <span style={{fontSize:9.5,color:'var(--ink4)'}}>Jun</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 220px',gap:12}} className="mobile-full">
        <div style={{display:'flex',flexDirection:'column',gap:12,minWidth:0}}>
          <motion.div custom={0.2} variants={FV} initial="hidden" animate="visible" className="card lift">
            <div style={{padding:'18px 20px 12px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>Revenue Trend</p>
                <p style={{fontSize:11.5,color:'var(--ink3)',marginTop:2}}>{loaded?'From your CSV data':'Monthly performance'}</p>
              </div>
              <div className="time-tabs">
                {['1M','3M','6M','1Y'].map(t=>(<div key={t} className={`time-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</div>))}
              </div>
            </div>
            <div style={{padding:'0 8px 14px'}}><RevenueSparkline data={monthlyData.length?monthlyData:staticRev} height={180}/></div>
          </motion.div>

          <motion.div custom={0.25} variants={FV} initial="hidden" animate="visible" className="card lift">
            <div style={{padding:'14px 20px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',gap:9}}>
              <div style={{width:24,height:24,borderRadius:7,background:'var(--a3)',border:'1px solid rgba(126,200,122,0.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Zap style={{width:12,height:12,color:'var(--a)'}}/>
              </div>
              <span style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>AI Signals</span>
              <span style={{marginLeft:'auto',fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:99,background:'var(--a)',color:'var(--bg)'}}>3 NEW</span>
            </div>
            <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}>
              {staticSignals.map((s,i)=>{
                const Icon=s.icon
                return (
                  <motion.div key={s.title} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.07}}
                    style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 12px',borderRadius:10,background:s.bg,border:`1px solid ${s.border}`,cursor:'default'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor=s.c}
                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor=s.border}>
                    <Icon style={{width:14,height:14,flexShrink:0,marginTop:2,color:s.c}}/>
                    <div>
                      <p style={{fontSize:12.5,fontWeight:600,color:'var(--ink1)'}}>{s.title}</p>
                      <p style={{fontSize:11.5,marginTop:3,color:'var(--ink3)',lineHeight:1.5}}>{s.body}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div custom={0.3} variants={FV} initial="hidden" animate="visible" className="card lift">
            <div style={{padding:'14px 20px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>Top Products</span>
              {loaded?<span style={{fontSize:11,color:'var(--a)',fontWeight:500}}>From your data</span>
                :<button style={{display:'flex',alignItems:'center',gap:4,fontSize:11.5,color:'var(--a)',background:'none',border:'none',cursor:'pointer',fontWeight:500}}>View all <ArrowUpRight style={{width:12,height:12}}/></button>}
            </div>
            {topProducts.map((p,i)=>{
              const maxRev=topProducts[0]?.revenue||1
              return (
                <motion.div key={p.name} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35+i*0.05}}
                  className="data-row" style={{display:'flex',alignItems:'center',gap:10,padding:'9px 20px',borderBottom:i<topProducts.length-1?'1px solid var(--b1)':'none'}}>
                  <span style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--ink4)',width:14,textAlign:'right',flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:12.5,color:'var(--ink1)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:'var(--mono)',color:'var(--ink1)',flexShrink:0,fontVariantNumeric:'tabular-nums'}}>${(p.revenue/1000).toFixed(1)}K</span>
                  <div style={{width:48,height:4,background:'var(--s2)',borderRadius:99,overflow:'hidden',flexShrink:0}}>
                    <div style={{height:'100%',background:'var(--a)',borderRadius:99,width:`${(p.revenue/maxRev)*100}%`,opacity:0.75}}/>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <motion.div custom={0.2} variants={FV} initial="hidden" animate="visible" className="card lift" style={{padding:'18px'}}>
            <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)',marginBottom:4}}>Monthly Goals</p>
            <p style={{fontSize:11,color:'var(--ink3)',marginBottom:18}}>vs targets</p>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {goals.map((g,i)=>(
                <div key={g.label}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:12,color:'var(--ink2)'}}>{g.label}</span>
                    <span style={{fontSize:11.5,fontWeight:700,fontFamily:'var(--mono)',color:'var(--ink1)'}}>{g.val}%</span>
                  </div>
                  <div style={{height:4,background:'var(--s2)',borderRadius:99,overflow:'hidden'}}>
                    <motion.div initial={{width:0}} animate={{width:`${g.val}%`}} transition={{delay:0.4+i*0.08,duration:0.6,ease:'easeOut'}}
                      style={{height:'100%',background:g.c,borderRadius:99}}/>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div custom={0.25} variants={FV} initial="hidden" animate="visible" className="card lift">
            <div style={{padding:'14px 16px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>Activity</span>
              <div style={{width:7,height:7,borderRadius:'50%',background:'var(--up)',boxShadow:'0 0 8px var(--up)',animation:'pulseDot 2s ease infinite'}}/>
            </div>
            {staticActivity.map((a,i)=>(
              <div key={i} className="data-row" style={{display:'flex',alignItems:'center',gap:9,padding:'8px 16px',borderBottom:i<staticActivity.length-1?'1px solid var(--b1)':'none'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:a.c,flexShrink:0}}/>
                <span style={{fontSize:11.5,color:'var(--ink2)',flex:1,lineHeight:1.4}}>{a.t}</span>
                <span style={{fontSize:10.5,color:'var(--ink4)',flexShrink:0}}>{a.s}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
