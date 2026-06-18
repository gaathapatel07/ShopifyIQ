import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, TrendingUp, Users, Bot, Settings, Bell, Moon, Sun, LogOut, Search, X, Menu, Leaf, ArrowRight, ChevronRight } from 'lucide-react'
import { getTheme, toggleTheme } from '../lib/theme'

const NAV = [
  { path:'/dashboard',           label:'Overview',   icon:LayoutDashboard, exact:true  },
  { path:'/dashboard/revenue',   label:'Revenue',    icon:TrendingUp                   },
  { path:'/dashboard/customers', label:'Customers',  icon:Users                        },
  { path:'/dashboard/copilot',   label:'AI Copilot', icon:Bot,             badge:true  },
]
const ALL = [...NAV, { path:'/dashboard/settings', label:'Settings', icon:Settings, exact:false }]

function Cmd({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const [q,setQ]  = useState('')
  const ref       = useRef<HTMLInputElement>(null)
  const navigate  = useNavigate()
  const items     = ALL.filter(n => !q || n.label.toLowerCase().includes(q.toLowerCase()))
  useEffect(()=>{ if(open){setQ('');setTimeout(()=>ref.current?.focus(),30)} },[open])
  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if(e.key==='Escape')onClose() }; window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h) },[onClose])
  return (
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
          className="cmd-overlay" onClick={onClose}>
          <motion.div initial={{opacity:0,scale:0.96,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.96}}
            transition={{duration:0.18,ease:[0.22,1,0.36,1]}} className="cmd-box" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:'1px solid var(--b1)'}}>
              <Search className="w-4 h-4" style={{color:'var(--ink3)',flexShrink:0}}/>
              <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search pages, actions…"
                className="input-field" style={{border:'none',background:'transparent',padding:0,fontSize:13}}/>
              <kbd style={{fontSize:10,padding:'2px 6px',borderRadius:4,background:'var(--s2)',color:'var(--ink3)',fontFamily:'var(--mono)',flexShrink:0}}>ESC</kbd>
            </div>
            <div style={{padding:'6px 0'}}>
              <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--ink3)',padding:'4px 16px 8px'}}>Pages</p>
              {items.map(item=>{
                const Icon=item.icon
                return (
                  <button key={item.path} onClick={()=>{navigate(item.path);onClose()}}
                    style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'9px 16px',background:'transparent',border:'none',cursor:'pointer',fontFamily:'var(--font)'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='var(--s2)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <div style={{width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:'var(--s2)',border:'1px solid var(--b1)',flexShrink:0}}>
                      <Icon className="w-3.5 h-3.5" style={{color:'var(--ink3)'}}/>
                    </div>
                    <span style={{fontSize:13,color:'var(--ink1)'}}>{item.label}</span>
                    <ArrowRight className="w-3 h-3" style={{color:'var(--ink4)',marginLeft:'auto'}}/>
                  </button>
                )
              })}
            </div>
            <div style={{display:'flex',gap:16,padding:'8px 16px',borderTop:'1px solid var(--b1)',fontSize:10,color:'var(--ink4)',fontFamily:'var(--mono)'}}>
              <span>↵ open</span><span>↑↓ navigate</span><span style={{marginLeft:'auto'}}>⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NotifPanel({ onClose }:{onClose:()=>void}) {
  const items=[
    {c:'var(--a)',   t:'Revenue milestone hit', b:'June exceeded $58K target.'},
    {c:'var(--warn)',t:'Inventory alert',        b:'Earbuds Pro — 5 days stock.'},
    {c:'var(--up)',  t:'New AI insight ready',   b:'Churn analysis updated.'},
  ]
  return (
    <motion.div initial={{opacity:0,y:6,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:4}} transition={{duration:0.15}}
      style={{position:'absolute',right:0,top:'calc(100% + 8px)',width:272,background:'var(--s0)',border:'1px solid var(--b2)',borderRadius:14,boxShadow:'var(--shadow-xl)',overflow:'hidden',zIndex:50}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid var(--b1)'}}>
        <span style={{fontSize:12,fontWeight:600,color:'var(--ink1)'}}>Notifications</span>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer'}}><X className="w-3.5 h-3.5" style={{color:'var(--ink3)'}}/></button>
      </div>
      {items.map((n,i)=>(
        <div key={i} className="data-row" style={{display:'flex',alignItems:'flex-start',gap:12,padding:'10px 16px',borderBottom:'1px solid var(--b1)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:n.c,flexShrink:0,marginTop:5}}/>
          <div>
            <p style={{fontSize:12,fontWeight:500,color:'var(--ink1)'}}>{n.t}</p>
            <p style={{fontSize:11,marginTop:2,color:'var(--ink3)'}}>{n.b}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default function AppLayout() {
  const [dark,setDark]     = useState(getTheme()==='dark')
  const [cmd,setCmd]       = useState(false)
  const [notif,setNotif]   = useState(false)
  const [mobile,setMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setCmd(true)} }; window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h) },[])
  useEffect(()=>{
    if(!notif)return
    const h=(e:MouseEvent)=>{ if(!(e.target as HTMLElement).closest('[data-notif]'))setNotif(false) }
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h)
  },[notif])

  const onToggle=()=>{ const next=toggleTheme(); setDark(next==='dark') }
  const email    = localStorage.getItem('iq-email')||'user@store.com'
  const initials = email.slice(0,2).toUpperCase()
  const signOut  = ()=>{ localStorage.removeItem('iq-email'); navigate('/login') }
  const pageLabel= ALL.find(n=>location.pathname===n.path||location.pathname.startsWith(n.path+'/'))?.label??'Overview'
  const settingsActive = location.pathname==='/dashboard/settings'

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'var(--bg)'}}>
      <Cmd open={cmd} onClose={()=>setCmd(false)}/>
      <AnimatePresence>
        {mobile&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,zIndex:40,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)'}}
            onClick={()=>setMobile(false)}/>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside style={{position:'fixed',top:0,left:0,zIndex:50,height:'100%',width:224,background:'var(--s0)',borderRight:'1px solid var(--b1)',display:'flex',flexDirection:'column',transition:'transform 200ms ease'}}
        className={`lg:translate-x-0 ${mobile?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 18px',height:52,borderBottom:'1px solid var(--b1)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:26,height:26,borderRadius:8,background:'var(--a)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px var(--a-glow)'}}>
              <Leaf className="w-3.5 h-3.5" style={{color:'var(--bg)'}}/>
            </div>
            <span style={{fontSize:13.5,fontWeight:700,letterSpacing:'-0.02em',color:'var(--ink1)'}}>ShopifyIQ</span>
          </div>
          <button className="lg:hidden" onClick={()=>setMobile(false)} style={{background:'none',border:'none',cursor:'pointer'}}>
            <X className="w-4 h-4" style={{color:'var(--ink3)'}}/>
          </button>
        </div>

        <nav style={{flex:1,padding:'12px 10px',overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
          {NAV.map(item=>{
            const Icon=item.icon
            const active=item.exact?location.pathname===item.path:location.pathname.startsWith(item.path)
            return (
              <NavLink key={item.path} to={item.path} end={item.exact} onClick={()=>setMobile(false)}
                style={{display:'flex',alignItems:'center',gap:9,padding:'7px 10px',borderRadius:9,fontSize:13,fontWeight:500,textDecoration:'none',position:'relative',background:active?'var(--a3)':'transparent',color:active?'var(--a)':'var(--ink3)'}}
                onMouseEnter={!active?e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='var(--s2)';el.style.color='var(--ink1)'}:undefined}
                onMouseLeave={!active?e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='transparent';el.style.color='var(--ink3)'}:undefined}>
                {active&&<div className="nav-active-bar"/>}
                <Icon className="w-4 h-4" style={{flexShrink:0}}/>
                {item.label}
                {item.badge&&<span style={{marginLeft:'auto',fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:99,background:'var(--a)',color:'var(--bg)',letterSpacing:'0.03em'}}>AI</span>}
                {!active&&<ChevronRight className="w-3 h-3" style={{marginLeft:'auto',color:'var(--ink4)',opacity:0}}/>}
              </NavLink>
            )
          })}
        </nav>

        <div style={{padding:'8px 10px 12px',borderTop:'1px solid var(--b1)'}}>
          <button onClick={()=>{navigate('/dashboard/settings');setMobile(false)}}
            style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'7px 10px',borderRadius:9,fontSize:13,fontWeight:settingsActive?600:500,background:settingsActive?'var(--a3)':'transparent',color:settingsActive?'var(--a)':'var(--ink3)',border:'none',cursor:'pointer',textAlign:'left',fontFamily:'var(--font)',marginBottom:2,position:'relative'}}
            onMouseEnter={!settingsActive?e=>{(e.currentTarget).style.background='var(--s2)';(e.currentTarget).style.color='var(--ink1)'}:undefined}
            onMouseLeave={!settingsActive?e=>{(e.currentTarget).style.background='transparent';(e.currentTarget).style.color='var(--ink3)'}:undefined}>
            {settingsActive&&<div className="nav-active-bar"/>}
            <Settings className="w-4 h-4"/>Settings
          </button>
          <button onClick={signOut}
            style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'7px 10px',borderRadius:9,fontSize:13,background:'transparent',border:'none',cursor:'pointer',color:'var(--ink3)',textAlign:'left',fontFamily:'var(--font)',marginBottom:6}}
            onMouseEnter={e=>{(e.currentTarget).style.background='var(--dn-bg)';(e.currentTarget).style.color='var(--dn)'}}
            onMouseLeave={e=>{(e.currentTarget).style.background='transparent';(e.currentTarget).style.color='var(--ink3)'}}>
            <LogOut className="w-4 h-4"/>Sign out
          </button>
          <div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:9,background:'var(--s1)'}}>
            <div style={{width:26,height:26,borderRadius:7,background:'var(--a3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--a)',flexShrink:0}}>{initials}</div>
            <span style={{fontSize:12,fontWeight:500,color:'var(--ink2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{email}</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',marginLeft:224}}>
        <header style={{height:52,background:'var(--s0)',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button className="lg:hidden" style={{color:'var(--ink3)',background:'none',border:'none',cursor:'pointer',padding:6}} onClick={()=>setMobile(true)}>
              <Menu className="w-4 h-4"/>
            </button>
            <span style={{fontSize:13,fontWeight:500,color:'var(--ink3)'}}>{pageLabel}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <button onClick={()=>setCmd(true)}
              style={{display:'flex',alignItems:'center',gap:8,padding:'5px 12px',background:'var(--s1)',border:'1px solid var(--b1)',borderRadius:9,fontSize:12,color:'var(--ink3)',cursor:'pointer',minWidth:160}}
              onMouseEnter={e=>(e.currentTarget).style.borderColor='var(--b2)'}
              onMouseLeave={e=>(e.currentTarget).style.borderColor='var(--b1)'}>
              <Search className="w-3.5 h-3.5"/><span>Search…</span>
              <kbd style={{marginLeft:'auto',fontSize:10,padding:'1px 5px',borderRadius:4,background:'var(--s2)',color:'var(--ink4)',fontFamily:'var(--mono)'}}>⌘K</kbd>
            </button>
            <button onClick={onToggle}
              style={{width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',border:'none',cursor:'pointer',color:'var(--ink3)'}}
              onMouseEnter={e=>(e.currentTarget).style.background='var(--s2)'}
              onMouseLeave={e=>(e.currentTarget).style.background='transparent'}>
              {dark?<Sun className="w-4 h-4"/>:<Moon className="w-4 h-4"/>}
            </button>
            <div style={{position:'relative'}} data-notif="">
              <button onClick={()=>setNotif(n=>!n)}
                style={{width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',border:'none',cursor:'pointer',color:'var(--ink3)',position:'relative'}}
                onMouseEnter={e=>(e.currentTarget).style.background='var(--s2)'}
                onMouseLeave={e=>(e.currentTarget).style.background='transparent'}>
                <Bell className="w-4 h-4"/>
                <span style={{position:'absolute',top:8,right:8,width:6,height:6,borderRadius:'50%',background:'var(--a)',boxShadow:'0 0 8px var(--a-glow)',animation:'pulseDot 2s ease infinite'}}/>
              </button>
              <AnimatePresence>{notif&&<NotifPanel onClose={()=>setNotif(false)}/>}</AnimatePresence>
            </div>
          </div>
        </header>
        <main style={{flex:1,overflowY:'auto'}}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:0.22,ease:[0.22,1,0.36,1]}} style={{maxWidth:1280,margin:'0 auto',padding:24}}>
              <Outlet/>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
