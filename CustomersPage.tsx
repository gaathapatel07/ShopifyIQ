import { motion } from 'framer-motion'
import { Users, Repeat, DollarSign, UserMinus, TrendingUp, Upload } from 'lucide-react'
import { MultiLine, SegBar } from '../components/charts'
import Papa from 'papaparse'
import useRetailData from '../hooks/useRetailData'
import { calculateKPIs, normalizeRows } from '../utils/analytics'

const FV = { hidden:{opacity:0,y:10}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.38,delay:i*0.06,ease:[0.22,1,0.36,1]}}) }

const retentionTrend = [
  {month:'Jan',retention:62,churn:12},{month:'Feb',retention:66,churn:10},
  {month:'Mar',retention:71,churn:8},{month:'Apr',retention:74,churn:7},
  {month:'May',retention:79,churn:5},{month:'Jun',retention:84,churn:4},
]
const segments = [
  {label:'Champions',value:842,color:'var(--a)'},
  {label:'Loyal',    value:623,color:'var(--up)'},
  {label:'At Risk',  value:391,color:'var(--warn)'},
  {label:'Lost',     value:284,color:'var(--dn)'},
  {label:'New',      value:201,color:'var(--info)'},
]
const segActions = [
  {label:'Champions',action:'Reward',   c:'var(--a)'},
  {label:'Loyal',    action:'Upsell',   c:'var(--up)'},
  {label:'At Risk',  action:'Re-engage',c:'var(--warn)'},
  {label:'Lost',     action:'Win back', c:'var(--dn)'},
]
const staticCustomers = [
  {id:'#4821',loc:'New York, US', orders:14,ltv:'$6,240',seg:'Champion',sc:'var(--a)'},
  {id:'#3304',loc:'London, UK',   orders:11,ltv:'$4,820',seg:'Champion',sc:'var(--a)'},
  {id:'#5012',loc:'Berlin, DE',   orders:9, ltv:'$3,610',seg:'Loyal',   sc:'var(--up)'},
  {id:'#1998',loc:'Toronto, CA',  orders:8, ltv:'$2,940',seg:'Loyal',   sc:'var(--up)'},
  {id:'#7741',loc:'Sydney, AU',   orders:3, ltv:'$820',  seg:'At Risk', sc:'var(--warn)'},
]

export default function CustomersPage() {
  const {data, setData} = useRetailData()
  const loaded = data.length > 0
  const kpis   = calculateKPIs(data)

  const handleCSV = (file: File) => {
    Papa.parse(file, {
      header:true, skipEmptyLines:true,
      complete:(r:any) => setData(normalizeRows(r.data as any[]))
    })
  }

  const kpiCards = [
    {label:'Retention Rate', value:'84%',   delta:'+12%',   up:true,  icon:Users     },
    {label:'Lifetime Value', value: loaded && kpis.totalCustomers > 0
      ? `$${Math.round(kpis.totalRevenue / kpis.totalCustomers).toLocaleString()}`
      : '$1,240',                           delta:'+8.3%',  up:true,  icon:DollarSign},
    {label:'Repeat Rate',    value:'62%',   delta:'+18%',   up:true,  icon:Repeat    },
    {label:'Churn Rate',     value:'4%',    delta:'−3.1pp', up:true,  icon:UserMinus },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:18,fontWeight:700,letterSpacing:'-0.025em',color:'var(--ink1)'}}>Customers</h1>
          <p style={{fontSize:12.5,color:'var(--ink3)',marginTop:3}}>
            {loaded ? `${kpis.totalCustomers.toLocaleString()} customers · ${kpis.totalOrders.toLocaleString()} orders` : 'Retention, segments, and lifetime value'}
          </p>
        </div>
        <label className="btn-ghost" style={{fontSize:12.5,padding:'7px 14px',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:7}}>
          <Upload style={{width:14,height:14}}/>{loaded ? 'Replace CSV' : 'Import CSV'}
          <input type="file" accept=".csv,text/csv" style={{display:'none'}}
            onChange={e=>{const f=e.target.files?.[0];if(f)handleCSV(f)}}/>
        </label>
      </div>

      {/* Stat rail */}
      <div className="stat-rail" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {kpiCards.map((k,i)=>{
          const Icon=k.icon
          return (
            <motion.div key={k.label} custom={i} variants={FV} initial="hidden" animate="visible"
              className="stat-cell" style={{borderRight:i<3?'1px solid var(--b1)':'none'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
                <div>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em',color:'var(--ink3)',marginBottom:10}}>{k.label}</p>
                  <p style={{fontSize:22,fontWeight:700,letterSpacing:'-0.03em',color:'var(--ink1)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{k.value}</p>
                  <span className="badge" style={{marginTop:9,display:'inline-flex',background:k.up?'var(--up-bg)':'var(--dn-bg)',color:k.up?'var(--up)':'var(--dn)'}}>
                    {k.up?'↑':'↓'} {k.delta}
                  </span>
                </div>
                <div style={{width:32,height:32,borderRadius:9,background:'var(--s2)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon style={{width:15,height:15,color:'var(--ink3)'}}/>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:12}} className="mobile-full">
        <motion.div custom={0.2} variants={FV} initial="hidden" animate="visible" className="card lift">
          <div style={{padding:'18px 20px 12px',display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>Retention vs Churn</p>
              <p style={{fontSize:11.5,color:'var(--ink3)',marginTop:2}}>6-month trajectory</p>
            </div>
            <div style={{display:'flex',gap:14,fontSize:11,color:'var(--ink3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:14,height:2,background:'var(--a)',borderRadius:1}}/>Retention</div>
              <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:14,borderBottom:'2px dashed var(--dn)'}}/>Churn</div>
            </div>
          </div>
          <div style={{padding:'0 8px 12px'}}>
            <MultiLine data={retentionTrend} lines={[
              {key:'retention',name:'Retention',color:'var(--a)'},
              {key:'churn',    name:'Churn',    color:'var(--dn)',dashed:true},
            ]} height={190}/>
          </div>
          <div style={{margin:'0 16px 14px',padding:'10px 14px',borderRadius:10,background:'var(--up-bg)',border:'1px solid rgba(82,201,138,0.2)',display:'flex',alignItems:'flex-start',gap:9}}>
            <TrendingUp style={{width:13,height:13,flexShrink:0,marginTop:2,color:'var(--up)'}}/>
            <p style={{fontSize:11.5,lineHeight:1.55,color:'var(--ink2)'}}>
              Churn dropped <strong style={{color:'var(--ink1)'}}>12%→4%</strong> over 6 months. Post-purchase email at day 7 is the primary driver — projected to push retention above 88% by Q3.
            </p>
          </div>
        </motion.div>

        <motion.div custom={0.25} variants={FV} initial="hidden" animate="visible" className="card lift" style={{padding:'20px'}}>
          <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)',marginBottom:3}}>Customer Segments</p>
          <p style={{fontSize:11.5,color:'var(--ink3)',marginBottom:18}}>RFM classification</p>
          <SegBar segments={segments}/>
          <div style={{marginTop:20,paddingTop:16,borderTop:'1px solid var(--b1)'}}>
            <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--ink3)',marginBottom:10}}>Recommended Actions</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {segActions.map(s=>(
                <div key={s.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:7,height:7,borderRadius:2,background:s.c}}/>
                    <span style={{fontSize:12,color:'var(--ink2)'}}>{s.label}</span>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,padding:'3px 9px',borderRadius:6,background:'var(--s2)',border:'1px solid var(--b1)',color:'var(--ink3)'}}>{s.action}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Customer table */}
      <motion.div custom={0.3} variants={FV} initial="hidden" animate="visible" className="card">
        <div style={{padding:'14px 20px',borderBottom:'1px solid var(--b1)'}}>
          <p style={{fontSize:13,fontWeight:600,color:'var(--ink1)'}}>High-Value Customers</p>
          <p style={{fontSize:11.5,color:'var(--ink3)',marginTop:2}}>Ranked by lifetime value</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'80px 1fr 70px 80px 90px',gap:'0 16px',padding:'8px 20px 6px',background:'var(--s1)',borderBottom:'1px solid var(--b1)'}}>
          {['ID','Location','Orders','LTV','Segment'].map(h=>(
            <span key={h} style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--ink3)'}}>{h}</span>
          ))}
        </div>
        {staticCustomers.map((c,i)=>(
          <motion.div key={c.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35+i*0.05}}
            className="data-row" style={{display:'grid',gridTemplateColumns:'80px 1fr 70px 80px 90px',gap:'0 16px',alignItems:'center',padding:'10px 20px',borderBottom:i<staticCustomers.length-1?'1px solid var(--b1)':'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:26,height:26,borderRadius:7,background:'var(--a3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--a)',flexShrink:0}}>
                {c.id.slice(1,3)}
              </div>
              <span style={{fontSize:12,fontFamily:'var(--mono)',fontWeight:500,color:'var(--ink1)'}}>{c.id}</span>
            </div>
            <span style={{fontSize:12.5,color:'var(--ink2)'}}>{c.loc}</span>
            <span style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--ink2)',fontVariantNumeric:'tabular-nums'}}>{c.orders}</span>
            <span style={{fontSize:12.5,fontWeight:700,fontFamily:'var(--mono)',color:'var(--ink1)',fontVariantNumeric:'tabular-nums'}}>{c.ltv}</span>
            <span style={{fontSize:11,fontWeight:600,padding:'3px 8px',borderRadius:6,background:`${c.sc}18`,color:c.sc,display:'inline-block'}}>{c.seg}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
