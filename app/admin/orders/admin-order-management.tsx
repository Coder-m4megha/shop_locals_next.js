'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Package, Eye, Search, Filter, Download, Truck, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: {
    name: string
    imageUrls: string
  }
}

interface Order {
  id: string
  orderNumber: string
  userId: string
  status: string
  total: number
  createdAt: string
  updatedAt: string
  shippingAddress: any
  user?: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AdminOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Order status updated successfully')
        fetchOrders()
        setSelectedOrder(null)
      } else {
        toast.error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const exportOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Orders exported successfully')
    } catch (error) {
      console.error('Error exporting orders:', error)
      toast.error('Failed to export orders')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <Button onClick={exportOrders} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'PROCESSING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                              View and manage order information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <OrderDetailsModal 
                              order={selectedOrder} 
                              onStatusUpdate={updateOrderStatus}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Order Details Modal Component
function OrderDetailsModal({ order, onStatusUpdate }: { 
  order: Order, 
  onStatusUpdate: (orderId: string, status: string) => void 
}) {
  const [newStatus, setNewStatus] = useState(order.status)

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Name:</strong> {order.user?.name}</p>
            <p><strong>Email:</strong> {order.user?.email}</p>
            <p><strong>Phone:</strong> {order.user?.phone}</p>
          </div>
          <div>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹{order.total.toLocaleString()}</p>
            <p><strong>Current Status:</strong> 
              <Badge className={`ml-2 ${statusColors[order.status as keyof typeof statusColors]}`}>
                {order.status}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Order Items</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p className="font-medium">{item.product?.name || 'Product'}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Update Status */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Update Status</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => onStatusUpdate(order.id, newStatus)}
            disabled={newStatus === order.status}
          >
            Update Status
          </Button>
        </div>
      </div>
    </div>
  )
}
