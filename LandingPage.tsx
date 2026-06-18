import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Leaf, Check, TrendingUp, Users, Bot,
  BarChart3, Package, Globe, Zap, Moon, Sun,
} from 'lucide-react'
import { RevenueSparkline } from '../charts'
import { getTheme } from '../../lib/theme'
import { useState } from 'react'

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const rev6m = [
  { month: 'Jan', revenue: 12400 }, { month: 'Feb', revenue: 19200 },
  { month: 'Mar', revenue: 24800 }, { month: 'Apr', revenue: 31600 },
  { month: 'May', revenue: 44200 }, { month: 'Jun', revenue: 58100 },
]

const features = [
  { icon: BarChart3,   title: 'Revenue Analytics',  desc: 'Track revenue, gross profit, and category performance in one timeline view with AI-detected anomalies.' },
  { icon: Bot,         title: 'AI Copilot',          desc: 'Ask questions in plain English. Get strategic answers grounded in your actual store data.' },
  { icon: Users,       title: 'Customer Segments',   desc: 'Automatic RFM segmentation identifies Champions, Loyal, At-Risk, and Lost customers instantly.' },
  { icon: Package,     title: 'Inventory Signals',   desc: 'Predict stockouts before they happen. Ranked by revenue impact so you act on what matters most.' },
  { icon: Globe,       title: 'Regional Insights',   desc: 'Know which markets are over or underperforming and get actionable recovery recommendations.' },
  { icon: TrendingUp,  title: 'Live Signals',        desc: 'Real-time anomaly detection alerts you to spikes, churn risk, and unusual patterns instantly.' },
]

const testimonials = [
  { q: '"ShopifyIQ identified our highest-LTV segments. We tripled retention in 90 days."', n: 'Sarah K.',  r: 'Head of Growth · Marble Store',  i: 'SK' },
  { q: '"The AI Copilot is like having a senior analyst embedded in our business 24/7."',    n: 'Marcus L.', r: 'Founder · Drift Supply Co.',       i: 'ML' },
  { q: '"We recovered $48K in one quarter just by acting on the at-risk customer alerts."',  n: 'Priya N.',  r: 'CEO · NovaBrew',                   i: 'PN' },
]

const ticker = [
  'Revenue +31% — Marble Store',
  'Churn 12%→4% in 90 days — Glow Labs',
  'Recovered $48K from at-risk customers — NovaBrew',
  'AI predicted stockout 6 days early — Drift Supply',
  '3.2× ad spend ROI — Aurelia',
  '+€6.4K/month from checkout localisation — Nova EU',
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(getTheme() === 'dark')

  const applyTheme = (isDark: boolean) => {
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
    localStorage.setItem('iq-theme', isDark ? 'dark' : 'light')
  }

  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  // Typography scale — editorial, left-aligned, matching screenshots
  const H1: React.CSSProperties = {
    fontSize: 'clamp(52px, 7vw, 96px)',
    fontWeight: 800,
    lineHeight: 1.0,
    letterSpacing: '-0.04em',
    color: 'var(--ink1)',
  }
  const H2: React.CSSProperties = {
    fontSize: 'clamp(36px, 4vw, 56px)',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.035em',
    color: 'var(--ink1)',
  }
  const accent: React.CSSProperties = {
    color: 'var(--a)',
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--ink1)', overflowX: 'hidden' }}>

      {/* ── NAV — clean, minimal, exactly like screenshot ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 58,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--b1)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf style={{ width: 15, height: 15, color: 'var(--bg)' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink1)' }}>ShopifyIQ</span>
        </div>

        {/* Center links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hidden md:flex">
          {['Features', 'Dashboard'].map(item => (
            <button key={item} onClick={() => scroll(item.toLowerCase())}
              style={{ fontSize: 14, color: 'var(--ink2)', padding: '6px 14px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink2)')}>
              {item}
            </button>
          ))}
        </div>

        {/* Right CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => applyTheme(!dark)}
            style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--s1)', border: '1px solid var(--b2)', cursor: 'pointer', color: 'var(--ink2)' }}>
            {dark ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
          </button>
          <button onClick={() => navigate('/login')}
            style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink1)', padding: '8px 18px', borderRadius: 10, background: 'transparent', border: '1px solid var(--b3)', cursor: 'pointer', fontFamily: 'var(--font)' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--s2)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
            Sign in
          </button>
          <button onClick={() => navigate('/signup')}
            style={{ fontSize: 14, fontWeight: 600, color: 'var(--bg)', padding: '8px 20px', borderRadius: 10, background: 'var(--a)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}>
            Start free
          </button>
        </div>
      </nav>

      {/* ── HERO — left-aligned editorial, matching screenshots exactly ── */}
      <section style={{ padding: '80px 40px 72px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 99, padding: '6px 16px', marginBottom: 32, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--a3)', border: '1px solid rgba(126,200,122,0.30)', color: 'var(--a)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--a)', flexShrink: 0 }} />
            AI Commerce Intelligence
          </div>

          {/* Headline — matches screenshot typography exactly */}
          <h1 style={{ ...H1, maxWidth: 620, marginBottom: 24 }}>
            Make smarter<br />
            ecommerce<br />
            <span style={accent}>decisions</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--ink2)', maxWidth: 480, lineHeight: 1.7, marginBottom: 36 }}>
            ShopifyIQ transforms your store data into AI-powered insights, forecasting,
            customer intelligence, and growth opportunities — all in one elegant analytics platform.
          </p>

          {/* CTAs — match screenshot button style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/signup')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 15, fontWeight: 700, color: 'var(--bg)', padding: '13px 26px', borderRadius: 12, background: 'var(--a)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}>
              Start free <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button onClick={() => scroll('dashboard')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 15, fontWeight: 600, color: 'var(--ink1)', padding: '13px 26px', borderRadius: 12, background: 'transparent', border: '1.5px solid var(--b3)', cursor: 'pointer', fontFamily: 'var(--font)' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--s2)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
              Book demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ borderTop: '1px solid var(--b1)', borderBottom: '1px solid var(--b1)', overflow: 'hidden', padding: '10px 0' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_, o) => (
            <div key={o} style={{ display: 'flex', flexShrink: 0 }}>
              {ticker.map((t, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 32px', fontSize: 12.5, color: 'var(--ink3)', whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--ink2)' }}>{t.split('—')[0]}</span>
                  {t.includes('—') && <span>— {t.split('—')[1]}</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── DASHBOARD SECTION — matches screenshot 4 ── */}
      <section id="dashboard" style={{ padding: '80px 40px 64px', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--a)', marginBottom: 16 }}>Dashboard</p>
          <h2 style={{ ...H2, maxWidth: 520, marginBottom: 14 }}>
            Intelligence, beautifully<br />composed
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ink3)', maxWidth: 420, marginBottom: 40, lineHeight: 1.7 }}>
            Every important signal from your store surfaced at the right moment with AI-powered analytics.
          </p>
        </Reveal>

        {/* Dashboard preview — matches screenshot 4 layout */}
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }} className="mobile-full">

            {/* Revenue chart card */}
            <div className="card" style={{ padding: '28px 28px 20px', background: 'var(--s0)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink3)', marginBottom: 8 }}>Revenue MTD</p>
                  <p style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.045em', color: 'var(--ink1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>$148.2K</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, padding: '4px 10px', borderRadius: 8, background: 'var(--up-bg)', fontSize: 12, fontWeight: 600, color: 'var(--up)' }}>
                    ↑ 18.2% vs last month
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 2, background: 'var(--s2)', border: '1px solid var(--b1)', borderRadius: 8, padding: 3 }}>
                  {['1M', '3M', '6M'].map((t, i) => (
                    <div key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, cursor: 'pointer', ...(i === 2 ? { background: 'var(--s0)', color: 'var(--ink1)', boxShadow: 'var(--shadow-sm)' } : { color: 'var(--ink3)' }) }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <RevenueSparkline data={rev6m} height={220} />
            </div>

            {/* AI Copilot card — matches screenshot 4 exactly */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot style={{ width: 18, height: 18, color: 'var(--bg)' }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink1)' }}>AI Copilot</span>
              </div>

              {/* Conversation preview */}
              <div style={{ fontSize: 13.5, color: 'var(--ink2)', lineHeight: 1.65 }}>
                Revenue is up 18% this month. Biggest risk: 391 at-risk customers worth approximately $64K in future revenue.
              </div>

              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--s1)', border: '1px solid var(--b1)', fontSize: 13.5, color: 'var(--ink1)', lineHeight: 1.6 }}>
                Which market should we focus on next?
              </div>

              <div style={{ fontSize: 13.5, color: 'var(--ink2)', lineHeight: 1.65 }}>
                Germany shows strong traffic growth but conversion is still 12% below average.
              </div>

              <button onClick={() => navigate('/signup')}
                style={{ marginTop: 'auto', width: '100%', padding: '12px', borderRadius: 10, background: 'var(--s1)', border: '1px solid var(--b2)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink1)', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 150ms' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--s2)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--s1)'}>
                Try AI Copilot free
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '64px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--a)', marginBottom: 16 }}>Features</p>
          <h2 style={{ ...H2, maxWidth: 500, marginBottom: 40 }}>Built for serious merchants</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="mobile-full">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="feat-card">
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--a3)', border: '1px solid rgba(126,200,122,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon style={{ width: 18, height: 18, color: 'var(--a)' }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink1)', marginBottom: 9 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '64px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ ...H2, maxWidth: 400, marginBottom: 40 }}>Merchants trust ShopifyIQ</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {testimonials.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.07}>
              <div className="card lift" style={{ padding: '24px', cursor: 'default' }}>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--ink2)', marginBottom: 20 }}>{t.q}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--a3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--a)', flexShrink: 0 }}>{t.i}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink1)' }}>{t.n}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{t.r}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION — matches screenshot 3 exactly ── */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div className="cta-section" style={{ padding: '72px 40px', textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 99, padding: '6px 16px', marginBottom: 28, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--a3)', border: '1px solid rgba(126,200,122,0.30)', color: 'var(--a)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--a)', flexShrink: 0 }} />
                Get started today
              </div>

              {/* Headline — matches screenshot 3 */}
              <h2 style={{ ...H2, marginBottom: 16 }}>
                Your store data is<br />
                trying to tell you <span style={accent}>something</span>
              </h2>

              <p style={{ fontSize: 15, color: 'var(--ink2)', marginBottom: 36, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 36px' }}>
                More than 2,400 merchants already use ShopifyIQ to predict churn and uncover hidden growth opportunities.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/signup')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 15, fontWeight: 700, color: 'var(--bg)', padding: '13px 28px', borderRadius: 12, background: 'var(--a)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}>
                  Start free <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
                <button onClick={() => navigate('/login')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 15, fontWeight: 600, color: 'var(--ink1)', padding: '13px 26px', borderRadius: 12, background: 'transparent', border: '1.5px solid var(--b3)', cursor: 'pointer', fontFamily: 'var(--font)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--s2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '24px 40px', borderTop: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf style={{ width: 13, height: 13, color: 'var(--bg)' }} />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink1)' }}>ShopifyIQ</span>
          <span style={{ fontSize: 12.5, color: 'var(--ink4)', marginLeft: 8 }}>© 2024 · AI Commerce Intelligence</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Docs', 'Status'].map(l => (
            <span key={l} style={{ fontSize: 13, color: 'var(--ink3)', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink3)')}>
              {l}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}
