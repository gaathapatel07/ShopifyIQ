import type { RetailRow, KPIData } from '../data/types'

export function normalizeRows(raw: any[]): RetailRow[] {
  return raw.map(row => {
    const invoiceNo   = String(row.InvoiceNo ?? row.invoiceno ?? row['Invoice No'] ?? row.invoice_no ?? '').trim()
    const description = String(row.Description ?? row.description ?? row.desc ?? '').trim()
    const quantity    = parseFloat(String(row.Quantity ?? row.quantity ?? row.qty ?? '0').replace(/,/g,''))
    const unitPrice   = parseFloat(String(row.UnitPrice ?? row.unitprice ?? row['Unit Price'] ?? row.price ?? '0').replace(/[^0-9.-]/g,''))
    const stockCode   = String(row.StockCode ?? row.stockcode ?? row['Stock Code'] ?? '').trim()
    const invoiceDate = String(row.InvoiceDate ?? row.invoicedate ?? row['Invoice Date'] ?? row.date ?? '').trim()
    const customerID  = parseInt(String(row.CustomerID ?? row.customerid ?? row['Customer ID'] ?? row.customer_id ?? '0').replace(/\D/g,'')) || 0
    const country     = String(row.Country ?? row.country ?? '').trim()
    if (!invoiceNo || !description) return null
    if (invoiceNo.startsWith('C')) return null
    if (quantity <= 0 || unitPrice <= 0) return null
    if (isNaN(quantity) || isNaN(unitPrice)) return null
    return { InvoiceNo: invoiceNo, StockCode: stockCode, Description: description, Quantity: quantity, InvoiceDate: invoiceDate, UnitPrice: unitPrice, CustomerID: customerID, Country: country } as RetailRow
  }).filter(Boolean) as RetailRow[]
}

export function calculateKPIs(data: RetailRow[]): KPIData {
  if (!data.length) return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, conversionRate: 4.8 }
  const totalRevenue   = data.reduce((s,r) => s + r.Quantity * r.UnitPrice, 0)
  const totalOrders    = new Set(data.map(r => r.InvoiceNo)).size
  const totalCustomers = new Set(data.filter(r => r.CustomerID > 0).map(r => r.CustomerID)).size
  return { totalRevenue, totalOrders, totalCustomers, conversionRate: 4.8 }
}

const MO: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}

export function getMonthlyRevenue(data: RetailRow[]): { month: string; revenue: number }[] {
  const map: Record<string,number> = {}
  data.forEach(r => {
    if (!r.InvoiceDate) return
    let d = new Date(r.InvoiceDate.trim())
    if (isNaN(d.getTime())) {
      const parts = r.InvoiceDate.split(/[\/\-]/)
      if (parts.length >= 3) d = new Date(`${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`)
    }
    if (isNaN(d.getTime())) return
    const month = d.toLocaleString('default', { month: 'short' })
    map[month] = (map[month] ?? 0) + r.Quantity * r.UnitPrice
  })
  return Object.entries(map)
    .sort(([a],[b]) => (MO[a]??0) - (MO[b]??0))
    .map(([month,revenue]) => ({ month, revenue: Math.round(revenue) }))
}

export function getTopProducts(data: RetailRow[]): { name: string; revenue: number; quantity: number }[] {
  const map: Record<string,{revenue:number;quantity:number}> = {}
  data.forEach(r => {
    const name = r.Description?.trim().slice(0,40)
    if (!name || name.length < 3) return
    if (!map[name]) map[name] = { revenue:0, quantity:0 }
    map[name].revenue  += r.Quantity * r.UnitPrice
    map[name].quantity += r.Quantity
  })
  return Object.entries(map)
    .map(([name,v]) => ({ name, revenue: Math.round(v.revenue), quantity: Math.round(v.quantity) }))
    .sort((a,b) => b.revenue - a.revenue).slice(0,5)
}

export function getCountryAnalytics(data: RetailRow[]): { country: string; revenue: number; orders: number }[] {
  const map: Record<string,{revenue:number;orders:Set<string>}> = {}
  data.forEach(r => {
    const c = r.Country?.trim()
    if (!c || c === 'Unspecified') return
    if (!map[c]) map[c] = { revenue:0, orders: new Set() }
    map[c].revenue += r.Quantity * r.UnitPrice
    map[c].orders.add(r.InvoiceNo)
  })
  return Object.entries(map)
    .map(([country,v]) => ({ country, revenue: Math.round(v.revenue), orders: v.orders.size }))
    .sort((a,b) => b.revenue - a.revenue).slice(0,6)
}
