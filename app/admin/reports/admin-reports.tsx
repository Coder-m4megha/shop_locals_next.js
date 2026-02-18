'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Download,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface ReportData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  monthlySales: Array<{
    month: string
    revenue: number
    orders: number
  }>
  ordersByStatus: Array<{
    status: string
    count: number
  }>
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/reports?days=${dateRange}`)
      const data = await response.json()
      
      if (data.success) {
        setReportData(data.data)
      } else {
        toast.error('Failed to fetch report data')
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      toast.error('Failed to fetch report data')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const response = await fetch(`/api/admin/reports/export?days=${dateRange}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-report-${dateRange}days-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Report exported successfully')
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Loading reports...</p>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-8">
        <p>No report data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={reportData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {reportData.revenueGrowth >= 0 ? '+' : ''}{reportData.revenueGrowth.toFixed(1)}%
              </span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className={reportData.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {reportData.orderGrowth >= 0 ? '+' : ''}{reportData.orderGrowth.toFixed(1)}%
              </span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className={reportData.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {reportData.customerGrowth >= 0 ? '+' : ''}{reportData.customerGrowth.toFixed(1)}%
              </span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.ordersByStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'DELIVERED' ? 'bg-green-500' :
                      status.status === 'SHIPPED' ? 'bg-blue-500' :
                      status.status === 'PROCESSING' ? 'bg-yellow-500' :
                      status.status === 'PENDING' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <span className="font-medium">{status.status}</span>
                  </div>
                  <span className="text-2xl font-bold">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
          <CardDescription>Revenue and order trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.monthlySales.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{month.month}</p>
                  <p className="text-sm text-muted-foreground">{month.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{month.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{Math.round(month.revenue / month.orders || 0).toLocaleString()} avg order
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
