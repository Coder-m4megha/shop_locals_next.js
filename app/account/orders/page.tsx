import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { getUserOrders } from "@/lib/actions/order"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Eye, Calendar, CreditCard, RotateCcw } from "lucide-react"
import ReturnRequestModal from "@/components/return-request-modal"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "My Orders | Mohit Saree Center",
  description: "View and track all your orders.",
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const ordersResult = await getUserOrders()
  
  if (!ordersResult.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Failed to load orders. Please try again later.</p>
        </div>
      </div>
    )
  }

  const orders = ordersResult.orders || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentMethod}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status === "DELIVERED" ? "outline" : "default"}>
                      {order.status}
                    </Badge>
                    <div className="text-right">
                      <p className="font-medium">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(order.items?.length || 0) > 3 && (
                      <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          +{(order.items?.length || 0) - 3} more items
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details & Track
                      </Link>
                    </Button>
                    {order.status === "PENDING" && (
                      <Button variant="destructive" className="flex-1">
                        Cancel Order
                      </Button>
                    )}
                    {order.status === "DELIVERED" && (
                      <>
                        <ReturnRequestModal order={order} />
                        <Button variant="outline" className="flex-1">
                          Reorder
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
