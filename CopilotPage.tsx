import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Send, RotateCcw, ChevronRight, User, DollarSign, Users, TrendingUp, Package } from 'lucide-react'

const FV = { hidden: { opacity: 0, y: 10 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }) }

const context = [
  { icon: DollarSign, label: 'Revenue MTD',      value: '$58.1K',    delta: '+18%', up: true  },
  { icon: Users,      label: 'Active Customers',  value: '2,341',     delta: '+12%', up: true  },
  { icon: TrendingUp, label: 'Retention Rate',    value: '84%',       delta: '+12%', up: true  },
  { icon: Package,    label: 'Stock Alerts',       value: '1 critical', delta: '',    up: false },
]

const suggested = [
  'Why did revenue spike in May?',
  'Which customers are at risk of churning?',
  'What should I restock first?',
  'How can I improve my retention rate?',
  'Which region should I focus on next?',
]

// ── 30-response AI brain ──────────────────────────────────────
function respond(prompt: string): string {
  const p = prompt.toLowerCase().trim()

  // Greetings
  if (p.match(/^(hi|hello|hey|hiya|howdy|sup|what'?s up|yo)[\s!?.]*$/))
    return "Hey! I'm connected to your store data. Revenue is up 18% this month, retention is at 84%, and one urgent stock alert on Earbuds Pro. What would you like to explore?"

  if (p.match(/how are you|how r u|you good|you ok/))
    return "I'm great — and your store is doing pretty well too! Revenue is tracking 18% above last month. What can I help you with?"

  if (p.match(/thank(s| you)|thx|ty|cheers|appreciate/))
    return "Happy to help! Is there anything else you'd like to explore about your store data?"

  if (p.match(/^(ok|okay|got it|makes sense|understood|cool|nice|great|awesome|perfect|sounds good)[\s!.]*$/))
    return "Glad that's clear. Anything else you'd like to dig into — revenue, customers, inventory, or regional performance?"

  if (p.match(/^(yes|yeah|yep|yup|sure|definitely|absolutely|of course)[\s!.]*$/))
    return "Great! What would you like to focus on? I can break down revenue trends, customer segments, inventory risks, or regional performance."

  if (p.match(/^(no|nope|nah|not really)[\s!.]*$/))
    return "No worries! I'm here whenever you need me. Your store is performing well overall — revenue and retention are both trending up."

  if (p.match(/bye|goodbye|see you|later|cya/))
    return "See you! Your store data is always here when you need it. Good luck out there 🌿"

  if (p.match(/who are you|what are you|what can you do|what do you do|your name/))
    return "I'm ShopifyIQ's AI Copilot — an analytics assistant trained on your store data. I can answer questions about revenue, customers, products, inventory, and regional performance. Try asking me anything about your store."

  if (p.match(/help|how does this work|what should i ask/))
    return "You can ask me things like: 'Why did revenue spike in May?', 'Which customers are at risk?', 'What should I restock?', or 'Which region is underperforming?' I'll give you data-backed answers from your store."

  // Revenue
  if (p.match(/revenue|sales|income|earning|money|gmv/))
    return "Revenue hit $58.1K in June — up 18% month-over-month. Electronics drove the biggest lift at +31% WoW. Smart Watch Series X had a 34% repeat purchase rate. The UK market lifted 12%, tied to your week-3 promotion. Overall trajectory is strong."

  if (p.match(/spike|surge|jump|sudden|why.*up|went up/))
    return "The May spike was driven by three things: (1) Electronics category ran a flash sale, (2) UK promotion went live in week 3, and (3) a viral product mention on social boosted Smart Watch traffic by 40%. The combination created an outlier week."

  if (p.match(/profit|margin|gross|net|poa|roas/))
    return "Gross profit is $52.8K this period — a 9.4% improvement. Your highest-margin products are Earbuds Pro (62% margin) and Smart Watch (58%). Bluetooth Speaker Max is dragging average margins down at 41% — worth reviewing pricing."

  // Customers
  if (p.match(/churn|at.?risk|churning|lose.*customer|losing/))
    return "391 customers (17% of base) are classified At Risk by RFM — inactive for 45–90 days. Highest-risk cohort is in France and Italy. A targeted win-back email with 10% discount yields ~23% re-activation historically. That's ~$64K in recoverable revenue."

  if (p.match(/customer|segment|rfm|champion|loyal/))
    return "Your customer base: 842 Champions (36%) averaging $4,280 LTV, 623 Loyal (27%) at $2,140, 391 At Risk (17%) at $820, and 284 Lost (12%). Champions and Loyal together drive 82% of your revenue — protecting them should be priority #1."

  if (p.match(/retention|repeat|return|come back/))
    return "Retention improved from 62% → 84% over 6 months. The biggest driver: post-purchase email at day 7. To push past 88%, I'd recommend: loyalty points for Champions, personalized recommendations for Loyal customers, and urgency sequences for At Risk accounts."

  if (p.match(/new customer|acquisition|cac|cost per/))
    return "New customer acquisition is up 12.7% this month. Your blended CAC has crept up to $58 (was $42 last quarter) — likely due to higher Meta CPMs. Your best low-CAC channel right now is organic search. Worth auditing your paid spend mix."

  if (p.match(/lifetime value|ltv|clv|customer value/))
    return "Average LTV is $1,240 — up 8.3% this quarter. Your top 10% of customers account for 48% of total revenue. The LTV gap between Champions ($4,280) and New customers ($340) suggests a big opportunity in onboarding and early retention."

  // Inventory
  if (p.match(/restock|stock|inventory|supply|out of stock/))
    return "Most urgent: Wireless Earbuds Pro — 5 days of stock at 42 units/week sell rate. Then Smart Watch at 14 days. I'd place the Earbuds order today. It's your #1 revenue product at $24.8K this period and a stockout would be costly."

  if (p.match(/earbuds|earphone|headphone/))
    return "Wireless Earbuds Pro is your top-performing product this month at $24.8K — up 18.4%. However, inventory is critical at ~5 days remaining. Sell rate has actually accelerated recently, so a stockout risk is real. Reorder as soon as possible."

  if (p.match(/smart watch|watch/))
    return "Smart Watch Series X is performing strongly at $18.2K with a 34% repeat purchase rate — your best loyalty signal. Inventory is at ~14 days, which is manageable. Worth testing a bundle offer with Earbuds Pro."

  if (p.match(/speaker|bluetooth/))
    return "Bluetooth Speaker Max is declining — down 2.1% this month at $15.4K. It has the lowest repeat purchase rate in your top 5. Consider a bundle with Earbuds Pro or a promotional push before inventory ages further."

  // Regions
  if (p.match(/region|market|country|geographic|where|germany|france|uk|us|canada|australia/))
    return "Best opportunity: Germany. Strong organic traffic but 12% below your US conversion rate. Localizing checkout (language + local payments) could recover ~€6,400/month. France is 18% below target — likely shipping delays. US and UK are both healthy."

  if (p.match(/france|french/))
    return "France is 18% below projected target this quarter. Data suggests the issue is shipping time — average delivery is 8.2 days vs your 3-day promise. Switching to a local EU fulfillment partner could recover ~€4,200/month."

  if (p.match(/germany|german/))
    return "Germany has high intent traffic but a 12% conversion gap vs your US baseline. The most likely cause: checkout isn't localized (no German language, no SEPA/Klarna). Fixing this could be worth €6,400/month in recovered revenue."

  // Products
  if (p.match(/product|top|best.?sell|popular|perform/))
    return "Top 3 this month: (1) Wireless Earbuds Pro — $24.8K, growing fast. (2) Smart Watch Series X — $18.2K, best repeat purchase behavior. (3) Bluetooth Speaker Max — $15.4K, declining. Consider a bundle offer to stabilize Speaker Max."

  if (p.match(/bundle|upsell|cross.?sell/))
    return "Best bundle opportunity: Earbuds Pro + Bluetooth Speaker Max. Earbuds buyers have a 28% affinity for audio accessories based on co-purchase data. A 'complete audio setup' bundle at a 10% discount could lift AOV by ~$45 per order."

  // Growth / strategy
  if (p.match(/grow|improve|better|increase|boost|strategy|recommend/))
    return "Three highest-ROI moves right now: (1) Re-engage 391 at-risk customers — potential $64K recovery. (2) Localize Germany checkout — €6,400/month upside. (3) Restock Earbuds Pro immediately to avoid a stockout on your #1 product. Want me to go deeper on any of these?"

  if (p.match(/email|campaign|marketing|klaviyo/))
    return "Your email channel is performing well — post-purchase day-7 email has a 34% open rate and is your top retention driver. Biggest gap: no win-back sequence for At Risk customers. A 3-email series (day 45, 60, 75) with a discount offer could recover 20–25% of that segment."

  if (p.match(/ad|paid|meta|google|facebook|instagram|spend/))
    return "Blended CAC increased to $58 (was $42 last quarter) — Meta CPMs are up across the board. Your best-performing paid segment is 25–34 female UK buyers. Consider shifting budget toward lookalikes of your Champions segment, which has 3.4x better retention."

  // Catch-all
  return "Based on your current store data, the biggest opportunity is re-engaging 391 at-risk customers — a 20% re-activation rate adds ~$64K in recovered revenue. I can also dig into revenue trends, inventory risks, regional performance, or product strategy. What would you like to explore?"
}

interface Msg { role: 'ai' | 'user'; text: string }

export default function CopilotPage() {
  const [msgs, setMsgs]     = useState<Msg[]>([{
    role: 'ai',
    text: "I've analyzed your store. Revenue is up 18% this month, retention improved to 84%, and Earbuds Pro needs an urgent restock. Ask me anything — revenue, customers, products, regions, or strategy.",
  }])
  const [input, setInput]   = useState('')
  const [thinking, setThink] = useState(false)
  const endRef              = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, thinking])

  const send = async (text: string) => {
    if (!text.trim() || thinking) return
    setMsgs(m => [...m, { role: 'user', text: text.trim() }])
    setInput('')
    setThink(true)
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600))
    setThink(false)
    setMsgs(m => [...m, { role: 'ai', text: respond(text) }])
  }

  const reset = () => {
    setMsgs([{ role: 'ai', text: 'Conversation reset. Ask me anything about your store.' }])
    setInput('')
    setThink(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 96px)', minHeight: 560 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--a3)', border: '1px solid rgba(126,200,122,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 16, height: 16, color: 'var(--a)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink1)' }}>AI Copilot</h1>
            <p style={{ fontSize: 12.5, color: 'var(--ink3)', marginTop: 2 }}>Store intelligence assistant</p>
          </div>
        </div>
        <button onClick={reset} className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <RotateCcw style={{ width: 13, height: 13 }} />Clear
        </button>
      </div>

      {/* Two-column layout — fills remaining height */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, flex: 1, minHeight: 0 }}>

        {/* Context sidebar — scrollable */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--ink3)', marginBottom: 2, flexShrink: 0 }}>Store Context</p>
          {context.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div key={c.label} custom={i} variants={FV} initial="hidden" animate="visible"
                className="card lift" style={{ padding: '12px 14px', cursor: 'default', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <Icon style={{ width: 13, height: 13, color: 'var(--ink3)' }} />
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{c.label}</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink1)', letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{c.value}</p>
                {c.delta && (
                  <p style={{ fontSize: 11, fontWeight: 600, marginTop: 5, color: c.up ? 'var(--up)' : 'var(--warn)' }}>
                    {c.up ? '↑' : '!'} {c.delta}
                  </p>
                )}
              </motion.div>
            )
          })}

          {/* Suggested */}
          <div style={{ marginTop: 8, flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--ink3)', marginBottom: 8 }}>Suggested</p>
            {suggested.map(q => (
              <button key={q} onClick={() => send(q)}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 6, padding: '6px 8px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--ink3)', lineHeight: 1.45, marginBottom: 2, fontFamily: 'var(--font)' }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'var(--s2)'; (e.currentTarget).style.color = 'var(--a)' }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--ink3)' }}>
                <ChevronRight style={{ width: 11, height: 11, flexShrink: 0, marginTop: 2 }} />
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel — fixed height, scrollable messages */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* Messages — scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AnimatePresence initial={false}>
              {msgs.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                  style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>

                  {m.role === 'ai' && (
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Zap style={{ width: 13, height: 13, color: 'var(--bg)' }} />
                    </div>
                  )}

                  {/* ── TEXT BOX — fixed overflow, proper wrapping ── */}
                  <div
                    className={m.role === 'ai' ? 'bubble-ai' : 'bubble-user'}
                    style={{
                      maxWidth: '78%',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.text}
                  </div>

                  {m.role === 'user' && (
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--s2)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <User style={{ width: 12, height: 12, color: 'var(--ink3)' }} />
                    </div>
                  )}
                </motion.div>
              ))}

              {thinking && (
                <motion.div key="thinking" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap style={{ width: 13, height: 13, color: 'var(--bg)' }} />
                  </div>
                  <div className="bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink3)', animation: `dotBounce 1.1s ease ${i * 0.18}s infinite` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Quick chips */}
          <div style={{ padding: '8px 16px 6px', display: 'flex', gap: 6, overflowX: 'auto', borderTop: '1px solid var(--b1)', flexShrink: 0 }}>
            {suggested.slice(0, 3).map(q => (
              <button key={q} onClick={() => send(q)}
                style={{ flexShrink: 0, fontSize: 11.5, padding: '5px 10px', borderRadius: 8, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--ink2)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font)' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid var(--b1)', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about your store — type anything…"
              className="input-field"
              style={{ flex: 1 }}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || thinking}
              style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none', cursor: input.trim() && !thinking ? 'pointer' : 'not-allowed', background: input.trim() && !thinking ? 'var(--a)' : 'var(--s2)', transition: 'all 150ms ease' }}>
              <Send style={{ width: 15, height: 15, color: input.trim() && !thinking ? 'var(--bg)' : 'var(--ink4)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
