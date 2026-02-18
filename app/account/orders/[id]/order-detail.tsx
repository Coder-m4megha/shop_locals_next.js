"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin, Loader2, AlertTriangle, ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getOrderById, cancelOrder } from "@/lib/actions/order"
import { quickAddToCart } from "@/lib/actions/cart"
import { addToWishlist } from "@/lib/actions/wishlist"

interface OrderDetailProps {
  id: string
}

interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    images: string[]
  }
  quantity: number
  price: number
  size?: string
  color?: string
}

interface TrackingEvent {
  status: string
  date: string
  description: string
  location?: string
}

interface Address {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  items: OrderItem[]
  trackingNumber?: string
  trackingEvents: TrackingEvent[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: string
  address?: Address
  statusHistory: Array<{
    status: string
    timestamp: string
    notes: string
  }>
}

interface OrderItemResponse {
  id: string
  product: {
    id: string
    name: string
    imageUrls: string | null
  }
  quantity: number
  price: number
  size: string | null
  color: string | null
}

interface TrackingEventResponse {
  status: string
  date: Date
  description: string | null
  location: string | null
}

interface StatusHistoryResponse {
  status: string
  timestamp: Date
  notes: string | null
}

interface AddressResponse {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

interface OrderResponse {
  id: string
  orderNumber: string
  createdAt: Date
  status: string
  items: OrderItemResponse[]
  trackingNumber: string | null
  trackingEvents: TrackingEventResponse[] | null
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: string
  address: AddressResponse | null
  statusHistory: StatusHistoryResponse[] | null
}

export default function OrderDetail({ id }: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [processingItemId, setProcessingItemId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const result = await getOrderById(id)
        if (result.success && result.order) {
          const orderData = result.order as OrderResponse
          // Transform the data to match our interface
          const transformedOrder: Order = {
            id: orderData.id,
            orderNumber: orderData.orderNumber,
            createdAt: orderData.createdAt.toISOString(),
            status: orderData.status,
            items: orderData.items.map((item: OrderItemResponse) => ({
              id: item.id,
              product: {
                id: item.product.id,
                name: item.product.name,
                images: item.product.imageUrls ? JSON.parse(item.product.imageUrls) : []
              },
              quantity: item.quantity,
              price: item.price,
              size: item.size || undefined,
              color: item.color || undefined
            })),
            trackingNumber: orderData.trackingNumber || undefined,
            trackingEvents: (orderData.trackingEvents || []).map((event: TrackingEventResponse) => ({
              status: event.status,
              date: event.date.toISOString(),
              description: event.description || '',
              location: event.location || undefined
            })),
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: orderData.paymentStatus,
            address: orderData.address ? {
              name: orderData.address.name,
              address: orderData.address.address,
              city: orderData.address.city,
              state: orderData.address.state,
              pincode: orderData.address.pincode,
              phone: orderData.address.phone
            } : undefined,
            statusHistory: (orderData.statusHistory || []).map((history: StatusHistoryResponse) => ({
              status: history.status,
              timestamp: history.timestamp.toISOString(),
              notes: history.notes || ''
            }))
          }
          setOrder(transformedOrder)
        } else {
          toast({
            title: "Error",
            description: result.message || "Order not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id, toast])

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      })
      return
    }

    setIsCancelling(true)
    try {
      const result = await cancelOrder(id, cancelReason)
      if (result.success) {
        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled successfully.",
        })
        // Update the order status in the UI
        setOrder((prev) => {
          if (!prev) return null
          return {
            ...prev,
            status: "CANCELLED",
            statusHistory: [
              {
                status: "CANCELLED",
                timestamp: new Date().toISOString(),
                notes: `Cancelled by customer. Reason: ${cancelReason}`,
              },
              ...prev.statusHistory,
            ],
            trackingEvents: [
              {
                status: "Cancelled",
                date: new Date().toISOString(),
                description: `Order cancelled by customer. Reason: ${cancelReason}`,
              },
              ...prev.trackingEvents,
            ],
          }
        })
        setCancelDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to cancel order:", error)
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleAddToCart = async (productId: string, itemId: string) => {
    if (processingItemId === itemId) return

    setProcessingItemId(itemId)
    try {
      const result = await quickAddToCart(productId)

      if (result.success) {
        toast({
          title: "Added to cart",
          description: "The product has been added to your cart.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add product to cart.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingItemId(null)
    }
  }

  const handleAddToWishlist = async (productId: string, itemId: string) => {
    if (processingItemId === itemId) return

    setProcessingItemId(itemId)
    try {
      const result = await addToWishlist(productId)

      if (result.success) {
        toast({
          title: "Added to wishlist",
          description: "The product has been added to your wishlist.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add product to wishlist.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingItemId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
      case "PENDING":
        return <Package className="h-5 w-5 text-primary" />
      case "Order Processed":
      case "PROCESSING":
        return <Clock className="h-5 w-5 text-primary" />
      case "Shipped":
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-primary" />
      case "Delivered":
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "Cancelled":
      case "CANCELLED":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-primary" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Order not found</h2>
        <p className="text-muted-foreground mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/account?tab=orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account?tab=orders" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.orderNumber}</CardTitle>
                <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              <Badge
                variant={
                  order.status === "DELIVERED"
                    ? "outline"
                    : order.status === "CANCELLED"
                      ? "destructive"
                      : "default"
                }
              >
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                          {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                        </div>
                        <p className="text-lg font-serif mt-2 sm:mt-0">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/products/${encodeURIComponent(item.product.name)}`}>View Product</Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToCart(item.product.id, item.id)}
                          disabled={processingItemId === item.id}
                        >
                          {processingItemId === item.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 mr-1" />
                          )}
                          Add to Cart
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToWishlist(item.product.id, item.id)}
                          disabled={processingItemId === item.id}
                        >
                          {processingItemId === item.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Heart className="h-4 w-4 mr-1" />
                          )}
                          Add to Wishlist
                        </Button>

                        {order.status === "DELIVERED" && (
                          <Button variant="outline" size="sm">
                            Write a Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(order.status === "PENDING" || order.status === "PROCESSING") && (
                <div className="flex justify-end mt-6 gap-2">
                  <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel Order</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for cancelling this order. This will help us improve our service.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea
                          placeholder="Reason for cancellation"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={isCancelling}>
                          Back
                        </Button>
                        <Button variant="destructive" onClick={handleCancelOrder} disabled={isCancelling}>
                          {isCancelling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Confirm Cancellation"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {order.status === "DELIVERED" && (
                <div className="flex justify-end mt-6 gap-2">
                  <Button>Order Again</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>
                {order.trackingNumber
                  ? `Tracking Number: ${order.trackingNumber}`
                  : order.status === "SHIPPED" || order.status === "DELIVERED"
                    ? `Tracking Number: MSC${order.orderNumber.slice(-6)}${new Date(order.createdAt).getFullYear()}`
                    : "Tracking information"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {order.trackingEvents.length > 0 ? (
                  order.trackingEvents.map((event, index) => (
                    <div key={index} className="flex mb-8 last:mb-0">
                      <div className="mr-4 relative">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          {getStatusIcon(event.status)}
                        </div>
                        {index < order.trackingEvents.length - 1 && (
                          <div className="absolute top-10 left-1/2 w-0.5 h-full -translate-x-1/2 bg-border" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                        </p>
                        <p className="text-sm mt-1">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Show sample tracking data based on order status
                  (() => {
                    const sampleEvents = []
                    const orderDate = new Date(order.createdAt)

                    // Always show order placed
                    sampleEvents.push({
                      status: "Order Placed",
                      date: orderDate,
                      description: "Your order has been successfully placed and is being processed.",
                      location: "Online Store"
                    })

                    if (order.status !== "CANCELLED") {
                      // Add processing event (1 day after order)
                      const processingDate = new Date(orderDate)
                      processingDate.setDate(processingDate.getDate() + 1)
                      sampleEvents.push({
                        status: "Order Processed",
                        date: processingDate,
                        description: "Your order has been processed and is being prepared for shipment.",
                        location: "Mohit Saree Center, Kanpur"
                      })

                      if (order.status === "SHIPPED" || order.status === "DELIVERED") {
                        // Add shipped event (2 days after order)
                        const shippedDate = new Date(orderDate)
                        shippedDate.setDate(shippedDate.getDate() + 2)
                        const trackingNumber = order.trackingNumber || `MSC${order.orderNumber.slice(-6)}${new Date(order.createdAt).getFullYear()}`
                        sampleEvents.push({
                          status: "Shipped",
                          date: shippedDate,
                          description: `Your order has been shipped with tracking number ${trackingNumber}.`,
                          location: "Kanpur Distribution Center"
                        })

                        if (order.status === "DELIVERED") {
                          // Add delivered event (4 days after order)
                          const deliveredDate = new Date(orderDate)
                          deliveredDate.setDate(deliveredDate.getDate() + 4)
                          sampleEvents.push({
                            status: "Delivered",
                            date: deliveredDate,
                            description: "Your order has been successfully delivered.",
                            location: order.address ? `${order.address.city}, ${order.address.state}` : "Delivery Address"
                          })
                        }
                      }
                    } else {
                      // Add cancelled event
                      const cancelledDate = new Date(orderDate)
                      cancelledDate.setDate(cancelledDate.getDate() + 1)
                      sampleEvents.push({
                        status: "Cancelled",
                        date: cancelledDate,
                        description: "Your order has been cancelled as requested.",
                        location: "Mohit Saree Center, Kanpur"
                      })
                    }

                    return sampleEvents.reverse().map((event, index) => (
                      <div key={index} className="flex mb-8 last:mb-0">
                        <div className="mr-4 relative">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {getStatusIcon(event.status)}
                          </div>
                          {index < sampleEvents.length - 1 && (
                            <div className="absolute top-10 left-1/2 w-0.5 h-full -translate-x-1/2 bg-border" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString()}
                          </p>
                          <p className="text-sm mt-1">{event.description}</p>
                          {event.location && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  })()
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.tax.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <p>{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Payment Status</p>
                  <Badge
                    variant={
                      order.paymentStatus === "PAID"
                        ? "default"
                        : order.paymentStatus === "FAILED"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                  </Badge>
                </div>

                {order.status === "DELIVERED" && (
                  <div>
                    <p className="text-sm font-medium mb-1">Delivered On</p>
                    <p>
                      {order.trackingEvents.find((e) => e.status === "Delivered")
                        ? new Date(
                            order.trackingEvents.find((e) => e.status === "Delivered")!.date,
                          ).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.address.name}</p>
                    <p>{order.address.address}</p>
                    <p>
                      {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                    <p className="mt-2">Phone: {order.address.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Contact Customer Support</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/faq">View FAQs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}