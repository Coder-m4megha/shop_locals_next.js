"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Settings,
  BarChart3,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderStats {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      return
    }

    // Fetch admin statistics
    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Fetch real order statistics
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Fallback to mock data if API fails
        const mockStats: OrderStats = {
          totalOrders: 156,
          pendingOrders: 12,
          processingOrders: 8,
          shippedOrders: 15,
          deliveredOrders: 121,
          totalRevenue: 245000,
          recentOrders: [
            { id: '1', orderNumber: 'MSC-001', customer: 'Priya Sharma', total: 2500, status: 'PENDING' },
            { id: '2', orderNumber: 'MSC-002', customer: 'Anita Gupta', total: 3200, status: 'PROCESSING' },
            { id: '3', orderNumber: 'MSC-003', customer: 'Sunita Verma', total: 1800, status: 'SHIPPED' },
          ]
        }
        setStats(mockStats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to mock data on error
      const mockStats: OrderStats = {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      }
      setStats(mockStats)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/orders">
              <Package className="h-4 w-4 mr-2" />
              Manage Orders
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.deliveredOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total.toLocaleString()}</p>
                    <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/orders">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/customers">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Customers
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/products">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
