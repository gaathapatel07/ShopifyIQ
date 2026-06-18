export interface RetailRow {
  InvoiceNo: string; StockCode: string; Description: string
  Quantity: number; InvoiceDate: string; UnitPrice: number
  CustomerID: number; Country: string
}
export interface KPIData {
  totalRevenue: number; totalOrders: number
  totalCustomers: number; conversionRate: number
}
