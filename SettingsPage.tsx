import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Palette, Shield, CreditCard,
  Store, Plug, Check, Moon, Sun, ChevronRight,
  LogOut, Trash2, Eye, EyeOff,
} from 'lucide-react'
import { get, set } from '../lib/storage'
import { getTheme } from '../lib/theme'
import { useNavigate } from 'react-router-dom'

const FV = { hidden: { opacity:0,y:8 }, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.32,delay:i*0.05,ease:[0.22,1,0.36,1]}}) }

type Tab = 'profile'|'store'|'appearance'|'notifications'|'integrations'|'billing'|'security'

const TABS: {id:Tab;label:string;icon:any}[] = [
  {id:'profile',       label:'Profile',      icon:User      },
  {id:'store',         label:'Store',        icon:Store     },
  {id:'appearance',    label:'Appearance',   icon:Palette   },
  {id:'notifications', label:'Notifications',icon:Bell      },
  {id:'integrations',  label:'Integrations', icon:Plug      },
  {id:'billing',       label:'Billing',      icon:CreditCard},
  {id:'security',      label:'Security',     icon:Shield    },
]

function Toggle({ on, onChange }: { on:boolean; onChange:(v:boolean)=>void }) {
  return (
    <div onClick={() => onChange(!on)} className="settings-toggle"
      style={{ background: on ? 'var(--a)' : 'var(--s3)', cursor:'pointer' }}>
      <div className="settings-toggle-knob"
        style={{ left: on ? 20 : 2, background: on ? 'var(--bg)' : 'var(--ink3)' }} />
    </div>
  )
}

function Row({ label, hint, children }: { label:string; hint?:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, padding:'15px 0', borderBottom:'1px solid var(--b1)' }}>
      <div style={{flex:1}}>
        <p style={{fontSize:13.5,fontWeight:500,color:'var(--ink1)',marginBottom:hint?3:0}}>{label}</p>
        {hint && <p style={{fontSize:12,color:'var(--ink3)',lineHeight:1.5}}>{hint}</p>}
      </div>
      <div style={{flexShrink:0}}>{children}</div>
    </div>
  )
}

function Section({ title, children }: {title:string; children:React.ReactNode}) {
  return (
    <div style={{marginBottom:28}}>
      <p style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em',color:'var(--ink3)',marginBottom:6}}>{title}</p>
      <div className="card" style={{padding:'0 20px'}}>{children}</div>
    </div>
  )
}

function SaveBtn({ onClick, saved }: { onClick:()=>void; saved:boolean }) {
  return (
    <button className="btn-accent" onClick={onClick} style={{fontSize:13,padding:'9px 20px',display:'inline-flex',alignItems:'center',gap:7}}>
      {saved ? <><Check style={{width:14,height:14}}/>Saved!</> : 'Save changes'}
    </button>
  )
}

/* ── PROFILE ── */
function ProfileTab() {
  const navigate = useNavigate()
  const email    = localStorage.getItem('iq-email') || 'user@store.com'
  const [name, setName] = useState(get('profile.name', email.split('@')[0]))
  const [mail, setMail] = useState(get('profile.email', email))
  const [saved, setSaved] = useState(false)

  const save = () => {
    set('profile.name', name); set('profile.email', mail)
    localStorage.setItem('iq-email', mail)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <Section title="Personal information">
        <Row label="Display name" hint="Shown in the sidebar and emails.">
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} style={{width:220}} />
        </Row>
        <Row label="Email address" hint="Used for login and notifications.">
          <input className="input-field" type="email" value={mail} onChange={e => setMail(e.target.value)} style={{width:220}} />
        </Row>
        <Row label="Avatar">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:'var(--a3)',border:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'var(--a)'}}>
              {name.slice(0,2).toUpperCase()}
            </div>
            <button className="btn-ghost" style={{fontSize:12,padding:'6px 12px'}}>Change</button>
          </div>
        </Row>
      </Section>
      <div style={{marginBottom:32}}><SaveBtn onClick={save} saved={saved} /></div>
      <Section title="Danger zone">
        <Row label="Sign out" hint="Sign out from this device.">
          <button className="btn-ghost" style={{fontSize:12.5,display:'inline-flex',alignItems:'center',gap:7,color:'var(--dn)',borderColor:'var(--dn-bg)'}}
            onClick={() => { localStorage.removeItem('iq-email'); navigate('/') }}>
            <LogOut style={{width:13,height:13}}/>Sign out
          </button>
        </Row>
        <Row label="Delete account" hint="Permanently delete your account. Cannot be undone.">
          <button className="btn-ghost" style={{fontSize:12.5,display:'inline-flex',alignItems:'center',gap:7,color:'var(--dn)',borderColor:'var(--dn-bg)'}}>
            <Trash2 style={{width:13,height:13}}/>Delete account
          </button>
        </Row>
      </Section>
    </div>
  )
}

/* ── STORE ── */
function StoreTab() {
  const [name,     setName]     = useState(get('store.name',     'My Shopify Store'))
  const [currency, setCurrency] = useState(get('store.currency', 'USD'))
  const [timezone, setTimezone] = useState(get('store.timezone', 'UTC'))
  const [fiscal,   setFiscal]   = useState(get('store.fiscal',   'January'))
  const [saved, setSaved] = useState(false)

  const save = () => {
    set('store.name',name); set('store.currency',currency)
    set('store.timezone',timezone); set('store.fiscal',fiscal)
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  return (
    <div>
      <Section title="Store details">
        <Row label="Store name"><input className="input-field" value={name} onChange={e=>setName(e.target.value)} style={{width:220}}/></Row>
        <Row label="Default currency">
          <select className="input-field" value={currency} onChange={e=>setCurrency(e.target.value)} style={{width:120}}>
            {['USD','EUR','GBP','CAD','AUD','INR'].map(c=><option key={c}>{c}</option>)}
          </select>
        </Row>
        <Row label="Timezone">
          <select className="input-field" value={timezone} onChange={e=>setTimezone(e.target.value)} style={{width:200}}>
            {['UTC','America/New_York','America/Los_Angeles','Europe/London','Europe/Berlin','Asia/Kolkata','Asia/Tokyo'].map(t=><option key={t}>{t}</option>)}
          </select>
        </Row>
        <Row label="Fiscal year start">
          <select className="input-field" value={fiscal} onChange={e=>setFiscal(e.target.value)} style={{width:130}}>
            {['January','April','July','October'].map(m=><option key={m}>{m}</option>)}
          </select>
        </Row>
      </Section>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

/* ── APPEARANCE ── */
function AppearanceTab() {
  const [dark,    setDark]    = useState(getTheme() === 'dark')
  const [density, setDensity] = useState<'compact'|'default'|'spacious'>(get('ui.density','default'))

  const applyTheme = (isDark: boolean) => {
    setDark(isDark)
    document.documentElement.classList.toggle('dark',  isDark)
    document.documentElement.classList.toggle('light', !isDark)
    localStorage.setItem('iq-theme', isDark ? 'dark' : 'light')
  }

  const saveDensity = (d: 'compact'|'default'|'spacious') => {
    setDensity(d); set('ui.density', d)
  }

  return (
    <div>
      <Section title="Theme">
        <Row label="Color mode" hint="Toggle between sage dark and warm beige light.">
          <div style={{display:'flex',gap:8}}>
            {[{label:'Sage dark',icon:Moon,val:true},{label:'Warm beige',icon:Sun,val:false}].map(o => {
              const Icon = o.icon
              return (
                <button key={o.label} onClick={() => applyTheme(o.val)}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:9,fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'var(--font)',border:dark===o.val?'2px solid var(--a)':'1px solid var(--b2)',background:dark===o.val?'var(--a3)':'var(--s1)',color:dark===o.val?'var(--a)':'var(--ink2)'}}>
                  <Icon style={{width:14,height:14}}/>{o.label}
                </button>
              )
            })}
          </div>
        </Row>
        <Row label="UI density" hint="Controls spacing and information density.">
          <div style={{display:'flex',gap:6}}>
            {(['compact','default','spacious'] as const).map(d => (
              <button key={d} onClick={() => saveDensity(d)}
                style={{padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'var(--font)',border:density===d?'2px solid var(--a)':'1px solid var(--b2)',background:density===d?'var(--a3)':'var(--s1)',color:density===d?'var(--a)':'var(--ink2)',textTransform:'capitalize'}}>
                {d}
              </button>
            ))}
          </div>
        </Row>
      </Section>
      <div className="card" style={{padding:'16px 20px',background:'var(--a4)',border:'1px solid var(--b2)'}}>
        <p style={{fontSize:12.5,color:'var(--ink2)',lineHeight:1.65}}>
          💡 The sage/beige palette is unique to ShopifyIQ. The dark mode uses deep forest greens, while light mode uses warm parchment tones — neither looks like a generic SaaS product.
        </p>
      </div>
    </div>
  )
}

/* ── NOTIFICATIONS ── */
function NotificationsTab() {
  const defaults = {
    revenue_alerts:true, churn_alerts:true, stock_alerts:true,
    ai_insights:true, weekly_report:true, monthly_report:false,
    email_digest:false, browser_push:true,
  }
  const [prefs, setPrefs] = useState(get('notif.prefs', defaults))

  const toggle = (k: keyof typeof defaults) => {
    const next = {...prefs, [k]: !prefs[k]}
    setPrefs(next); set('notif.prefs', next)
  }

  const rows = [
    {section:'Alerts', items:[
      {k:'revenue_alerts',   l:'Revenue anomalies',    h:'Notify when revenue spikes or drops unexpectedly.'},
      {k:'churn_alerts',     l:'Churn risk alerts',    h:'Notify when at-risk customer count increases.'},
      {k:'stock_alerts',     l:'Inventory warnings',   h:'Notify when stock falls below 7 days.'},
      {k:'ai_insights',      l:'AI insights',           h:'Notify when new AI signals are detected.'},
    ]},
    {section:'Reports', items:[
      {k:'weekly_report',    l:'Weekly summary',        h:'Performance digest every Monday.'},
      {k:'monthly_report',   l:'Monthly report',        h:'Detailed report on the 1st of each month.'},
      {k:'email_digest',     l:'Email digest',          h:'All notifications bundled into a daily email.'},
      {k:'browser_push',     l:'Browser push',          h:'Real-time push for critical alerts.'},
    ]},
  ]

  return (
    <div>
      {rows.map(group => (
        <Section key={group.section} title={group.section}>
          {group.items.map(item => (
            <Row key={item.k} label={item.l} hint={item.h}>
              <Toggle on={prefs[item.k as keyof typeof defaults]} onChange={() => toggle(item.k as keyof typeof defaults)} />
            </Row>
          ))}
        </Section>
      ))}
    </div>
  )
}

/* ── INTEGRATIONS ── */
function IntegrationsTab() {
  const [connected, setConnected] = useState(get('integrations', {shopify:true,klaviyo:false,meta:false,google:false,recharge:false,gorgias:false}))

  const toggle = (k: string) => {
    const next = {...connected, [k]: !connected[k as keyof typeof connected]}
    setConnected(next); set('integrations', next)
  }

  const integrations = [
    {id:'shopify',  name:'Shopify',    desc:'Sync products, orders, and customer data.',     icon:'🛍️'},
    {id:'klaviyo',  name:'Klaviyo',    desc:'Connect email campaigns and segment data.',      icon:'📧'},
    {id:'meta',     name:'Meta Ads',   desc:'Import ad spend and ROAS from Meta.',            icon:'📘'},
    {id:'google',   name:'Google Ads', desc:'Import ad spend and conversion data.',           icon:'🎯'},
    {id:'recharge', name:'Recharge',   desc:'Sync subscription revenue and churn data.',      icon:'🔄'},
    {id:'gorgias',  name:'Gorgias',    desc:'Connect support tickets to customer segments.',  icon:'💬'},
  ]

  return (
    <div>
      <Section title="Connected apps">
        {integrations.map(intg => {
          const on = connected[intg.id as keyof typeof connected]
          return (
            <Row key={intg.id} label={`${intg.icon}  ${intg.name}`} hint={intg.desc}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                {on && <span className="badge" style={{background:'var(--up-bg)',color:'var(--up)'}}>Connected</span>}
                <button className={on?'btn-ghost':'btn-accent'} style={{fontSize:12,padding:'6px 14px',...(on?{color:'var(--dn)',borderColor:'var(--dn-bg)'}:{})}}
                  onClick={() => toggle(intg.id)}>
                  {on ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </Row>
          )
        })}
      </Section>
    </div>
  )
}

/* ── BILLING ── */
function BillingTab() {
  const [plan] = useState(get('billing.plan','pro'))
  return (
    <div>
      <Section title="Current plan">
        <Row label="Plan" hint="You are on the Pro plan.">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="badge" style={{background:'var(--a3)',border:'1px solid rgba(126,200,122,0.3)',color:'var(--a)',fontSize:12,padding:'3px 10px'}}>✦ Pro</span>
            <button className="btn-ghost" style={{fontSize:12,padding:'6px 12px'}}>Upgrade</button>
          </div>
        </Row>
        <Row label="Billing cycle" hint="Monthly renewal.">
          <span style={{fontSize:13,color:'var(--ink2)'}}>$79 / month · Renews Jun 1</span>
        </Row>
        <Row label="Payment method" hint="Visa ending in 4242.">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:13,color:'var(--ink2)'}}>•••• 4242</span>
            <button className="btn-ghost" style={{fontSize:12,padding:'6px 12px'}}>Update</button>
          </div>
        </Row>
      </Section>
      <Section title="Invoices">
        {[
          {date:'May 1, 2024', amount:'$79.00'},
          {date:'Apr 1, 2024', amount:'$79.00'},
          {date:'Mar 1, 2024', amount:'$79.00'},
        ].map(inv => (
          <Row key={inv.date} label={inv.date}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--ink1)',fontVariantNumeric:'tabular-nums'}}>{inv.amount}</span>
              <span className="badge" style={{background:'var(--up-bg)',color:'var(--up)'}}>Paid</span>
              <button className="btn-ghost" style={{fontSize:11,padding:'4px 10px'}}>PDF</button>
            </div>
          </Row>
        ))}
      </Section>
    </div>
  )
}

/* ── SECURITY ── */
function SecurityTab() {
  const [show, setShow] = useState(false)
  const [curr, setCurr] = useState('')
  const [newP, setNewP] = useState('')
  const [conf, setConf] = useState('')
  const [saved, setSaved] = useState(false)
  const [twofa, setTwofa] = useState(get('security.2fa', false))
  const sessions = [
    {device:'Chrome · Windows 11',  location:'New Delhi, IN',  last:'Active now',  current:true},
    {device:'Safari · iPhone 15',   location:'New Delhi, IN',  last:'2h ago',      current:false},
    {device:'Chrome · MacBook Pro', location:'Mumbai, IN',     last:'Yesterday',   current:false},
  ]

  const save = () => {
    if (newP && newP===conf && curr) {
      setSaved(true); setCurr(''); setNewP(''); setConf('')
      setTimeout(()=>setSaved(false),2000)
    }
  }

  const toggle2fa = (v: boolean) => { setTwofa(v); set('security.2fa', v) }

  return (
    <div>
      <Section title="Change password">
        <Row label="Current password">
          <div style={{position:'relative'}}>
            <input className="input-field" type={show?'text':'password'} value={curr} onChange={e=>setCurr(e.target.value)} style={{width:220,paddingRight:38}}/>
            <button type="button" onClick={()=>setShow(s=>!s)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--ink3)'}}>
              {show?<EyeOff style={{width:14,height:14}}/>:<Eye style={{width:14,height:14}}/>}
            </button>
          </div>
        </Row>
        <Row label="New password" hint="Minimum 8 characters.">
          <input className="input-field" type="password" value={newP} onChange={e=>setNewP(e.target.value)} style={{width:220}}/>
        </Row>
        <Row label="Confirm password">
          <input className="input-field" type="password" value={conf} onChange={e=>setConf(e.target.value)} style={{width:220}}/>
        </Row>
      </Section>
      <div style={{marginBottom:28}}><SaveBtn onClick={save} saved={saved} /></div>
      <Section title="Two-factor authentication">
        <Row label="Authenticator app" hint="Use Google Authenticator or Authy.">
          <Toggle on={twofa} onChange={toggle2fa}/>
        </Row>
      </Section>
      <Section title="Active sessions">
        {sessions.map((s,i) => (
          <Row key={i} label={s.device} hint={`${s.location} · ${s.last}`}>
            {s.current
              ? <span className="badge" style={{background:'var(--up-bg)',color:'var(--up)'}}>This device</span>
              : <button className="btn-ghost" style={{fontSize:12,padding:'5px 12px',color:'var(--dn)'}}>Revoke</button>
            }
          </Row>
        ))}
      </Section>
    </div>
  )
}

/* ── MAIN ── */
export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>(get('settings.tab','profile') as Tab)

  const setTabPersist = (t: Tab) => { setTab(t); set('settings.tab', t) }

  const panels: Record<Tab,React.ReactNode> = {
    profile:       <ProfileTab/>,
    store:         <StoreTab/>,
    appearance:    <AppearanceTab/>,
    notifications: <NotificationsTab/>,
    integrations:  <IntegrationsTab/>,
    billing:       <BillingTab/>,
    security:      <SecurityTab/>,
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h1 style={{fontSize:18,fontWeight:700,letterSpacing:'-0.025em',color:'var(--ink1)'}}>Settings</h1>
        <p style={{fontSize:12.5,color:'var(--ink3)',marginTop:3}}>Manage your account, store, and preferences</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'196px 1fr',gap:20,alignItems:'start'}} className="mobile-full">

        {/* Sidebar */}
        <motion.div variants={FV} initial="hidden" animate="visible" className="card" style={{padding:'8px'}}>
          {TABS.map(t => {
            const Icon = t.icon; const active = tab===t.id
            return (
              <button key={t.id} onClick={()=>setTabPersist(t.id)}
                style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:9,fontSize:13,fontWeight:active?600:400,background:active?'var(--a3)':'transparent',color:active?'var(--a)':'var(--ink2)',border:'none',cursor:'pointer',textAlign:'left',fontFamily:'var(--font)',marginBottom:2,transition:'all 130ms ease'}}>
                <Icon style={{width:15,height:15,flexShrink:0}}/>
                {t.label}
                <ChevronRight style={{width:12,height:12,marginLeft:'auto',opacity:active?1:0.3}}/>
              </button>
            )
          })}
        </motion.div>

        {/* Content */}
        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25,ease:[0.22,1,0.36,1]}}>
          {panels[tab]}
        </motion.div>
      </div>
    </div>
  )
}
