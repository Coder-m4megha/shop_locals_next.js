'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Users, Eye, Search, Download, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  createdAt: string
  _count?: {
    orders: number
  }
  orders?: Array<{
    id: string
    orderNumber: string
    total: number
    status: string
    createdAt: string
  }>
}

export default function AdminCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.customers)
      } else {
        toast.error('Failed to fetch customers')
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedCustomer(data.customer)
      } else {
        toast.error('Failed to fetch customer details')
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
      toast.error('Failed to fetch customer details')
    }
  }

  const exportCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Customers exported successfully')
    } catch (error) {
      console.error('Error exporting customers:', error)
      toast.error('Failed to export customers')
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage and view customer information</p>
        </div>
        <Button onClick={exportCustomers} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Customers
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c._count && c._count.orders > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => {
                const createdDate = new Date(c.createdAt)
                const now = new Date()
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={customer.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {customer.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer._count?.orders || 0}</TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCustomerDetails(customer.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                            <DialogDescription>
                              View customer information and order history
                            </DialogDescription>
                          </DialogHeader>
                          {selectedCustomer && (
                            <CustomerDetailsModal customer={selectedCustomer} />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${customer.email}`, '_self')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      {customer.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${customer.phone}`, '_self')}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
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

// Customer Details Modal Component
function CustomerDetailsModal({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
          </div>
          <div>
            <div className="mb-2">
              <span><strong>Role:</strong></span>
              <Badge className="ml-2" variant={customer.role === 'ADMIN' ? 'default' : 'secondary'}>
                {customer.role}
              </Badge>
            </div>
            <div className="mb-2">
              <strong>Joined:</strong> {new Date(customer.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>Total Orders:</strong> {customer.orders?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      {customer.orders && customer.orders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
          <div className="space-y-2">
            {customer.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{order.total.toLocaleString()}</p>
                  <Badge className="text-xs">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
