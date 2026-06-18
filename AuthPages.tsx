import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Check, Leaf } from 'lucide-react'
import { applyTheme, getTheme } from '../lib/theme'

function AuthShell({ children, panel }: { children: React.ReactNode; panel: React.ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg)' }}>
      {/* Left decorative panel */}
      <div style={{ display:'none', width:400, flexShrink:0, background:'var(--s0)', borderRight:'1px solid var(--b1)', padding:'40px 40px', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}
        className="lg:!flex">
        {/* Subtle radial glow */}
        <div style={{ position:'absolute', bottom:'-15%', right:'-15%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, var(--a-glow), transparent 65%)', pointerEvents:'none' }} />
        {/* Dot grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, var(--b2) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:0.5, pointerEvents:'none' }} />
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:52 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'var(--a)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 14px var(--a-glow)' }}>
              <Leaf style={{ width:14, height:14, color:'var(--bg)' }} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, letterSpacing:'-0.02em', color:'var(--ink1)' }}>ShopifyIQ</span>
          </div>
          {panel}
        </div>
        {/* Testimonial */}
        <div style={{ position:'relative', background:'var(--s1)', border:'1px solid var(--b2)', borderRadius:14, padding:'18px 20px' }}>
          <p style={{ fontSize:13.5, lineHeight:1.65, color:'var(--ink2)', marginBottom:14 }}>
            "Real-time insights, clean UI, and the AI Copilot is genuinely useful. Exactly what a Shopify merchant needs."
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--a3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--a)' }}>GP</div>
            <div>
              <p style={{ fontSize:12.5, fontWeight:600, color:'var(--ink1)' }}>Gaatha Patel</p>
              <p style={{ fontSize:11.5, color:'var(--ink3)' }}>Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form area */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
          style={{ width:'100%', maxWidth:360 }}>
          {/* Mobile logo */}
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:36 }} className="lg:hidden">
            <div style={{ width:28, height:28, borderRadius:8, background:'var(--a)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Leaf style={{ width:14, height:14, color:'var(--bg)' }} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, letterSpacing:'-0.02em', color:'var(--ink1)' }}>ShopifyIQ</span>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, rightSlot, ...props }: { label: string; rightSlot?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
        <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--ink3)' }}>{label}</label>
        {rightSlot}
      </div>
      <input className="input-field" {...props} />
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    localStorage.setItem('iq-email', email)
    applyTheme(getTheme())
    navigate('/dashboard')
  }

  return (
    <AuthShell
      panel={
        <>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.035em', lineHeight:1.15, color:'var(--ink1)', marginBottom:16 }}>
            Revenue intelligence<br />for serious merchants.
          </h2>
          <p style={{ fontSize:14, lineHeight:1.7, color:'var(--ink3)' }}>
            Know who will churn, what to restock, and exactly where your growth is coming from.
          </p>
        </>
      }
    >
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.025em', color:'var(--ink1)', marginBottom:6 }}>Sign in</h1>
      <p style={{ fontSize:13.5, color:'var(--ink3)', marginBottom:28 }}>Welcome back.</p>

      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Field label="Email" type="email" value={email} required placeholder="you@store.com"
          onChange={e => setEmail(e.target.value)} />

        <Field label="Password"
          rightSlot={<a href="#" style={{ fontSize:11.5, color:'var(--a)', textDecoration:'none' }}>Forgot?</a>}
          type={show ? 'text' : 'password'} value={password} required placeholder="••••••••"
          onChange={e => setPassword(e.target.value)}
        />
        {/* Show/hide toggle overlay */}
        <div style={{ position:'relative', marginTop:-14 }}>
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--ink3)', marginTop:-7 }}>
            {show ? <EyeOff style={{ width:15, height:15 }} /> : <Eye style={{ width:15, height:15 }} />}
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-accent" style={{ width:'100%', marginTop:4 }}>
          {loading
            ? <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            : <><span>Continue</span><ArrowRight style={{ width:15, height:15 }} /></>
          }
        </button>
      </form>

      <p style={{ fontSize:12.5, textAlign:'center', marginTop:22, color:'var(--ink3)' }}>
        No account?{' '}
        <Link to="/signup" style={{ color:'var(--a)', fontWeight:500, textDecoration:'none' }}>Create one free</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthShell>
  )
}

const features = [
  'AI-powered revenue analytics',
  'RFM customer segmentation',
  'Real-time inventory signals',
  'Export reports & dashboards',
]

export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    localStorage.setItem('iq-email', email)
    applyTheme(getTheme())
    navigate('/dashboard')
  }

  return (
    <AuthShell
      panel={
        <>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.035em', lineHeight:1.15, color:'var(--ink1)', marginBottom:20 }}>
            Everything you need<br />to grow revenue.
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {features.map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:20, height:20, borderRadius:6, background:'var(--up-bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Check style={{ width:11, height:11, color:'var(--up)' }} />
                </div>
                <span style={{ fontSize:13.5, color:'var(--ink2)' }}>{f}</span>
              </div>
            ))}
          </div>
        </>
      }
    >
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.025em', color:'var(--ink1)', marginBottom:6 }}>Create account</h1>
      <p style={{ fontSize:13.5, color:'var(--ink3)', marginBottom:28 }}>Free to start. No credit card required.</p>

      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Field label="Work email" type="email" value={email} required placeholder="you@store.com"
          onChange={e => setEmail(e.target.value)} />
        <Field label="Password" type="password" value={password} required placeholder="Min. 8 characters"
          minLength={8} onChange={e => setPassword(e.target.value)} />

        <button type="submit" disabled={loading} className="btn-accent" style={{ width:'100%', marginTop:4 }}>
          {loading
            ? <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            : <><span>Get started free</span><ArrowRight style={{ width:15, height:15 }} /></>
          }
        </button>
      </form>

      <p style={{ fontSize:12.5, textAlign:'center', marginTop:22, color:'var(--ink3)' }}>
        Already have an account?{' '}
        <Link to="/" style={{ color:'var(--a)', fontWeight:500, textDecoration:'none' }}>Sign in</Link>
      </p>
      <p style={{ fontSize:11.5, textAlign:'center', marginTop:10, color:'var(--ink4)', lineHeight:1.6 }}>
        By signing up you agree to our Terms and Privacy Policy.
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthShell>
  )
}
