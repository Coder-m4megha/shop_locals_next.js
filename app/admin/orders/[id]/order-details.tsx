"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

// Helper function to format date
const formatDate = (date: Date) => {
  return format(date, "MMM d, yyyy")
}

// Helper function to format date and time
const formatDateTime = (date: Date) => {
  return format(date, "MMM d, yyyy 'at' h:mm a")
}

// Get status icon based on status
const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return <Package className="h-5 w-5 text-yellow-500" />
    case "PROCESSING":
      return <Clock className="h-5 w-5 text-blue-500" />
    case "SHIPPED":
      return <Truck className="h-5 w-5 text-purple-500" />
    case "DELIVERED":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "CANCELLED":
    case "RETURNED":
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

export default function OrderDetails({ order }: { order: any }) {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-500">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Badge
            className={`
              ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
              ${order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" : ""}
              ${order.status === "SHIPPED" ? "bg-purple-100 text-purple-800" : ""}
              ${order.status === "DELIVERED" ? "bg-green-100 text-green-800" : ""}
              ${order.status === "CANCELLED" ? "bg-red-100 text-red-800" : ""}
              ${order.status === "RETURNED" ? "bg-gray-100 text-gray-800" : ""}
            `}
          >
            {order.status}
          </Badge>
          <Badge
            className={`
              ${order.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
              ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : ""}
              ${order.paymentStatus === "FAILED" ? "bg-red-100 text-red-800" : ""}
              ${order.paymentStatus === "REFUNDED" ? "bg-gray-100 text-gray-800" : ""}
            `}
          >
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Order Details and History */}
        <div className="space-y-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                {order.items.length} {order.items.length === 1 ? "item" : "items"} in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0 border">
                      <Image
                        src={item.product.imageUrls?.[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                          {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                        </div>
                        <p className="text-lg font-medium mt-2 sm:mt-0">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
              <CardDescription>Delivery progress updates</CardDescription>
            </CardHeader>
            <CardContent>
              {order.trackingEvents.length > 0 ? (
                <div className="space-y-4">
                  {order.trackingEvents.map((event: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div>
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(event.date)}
                        </p>
                        {event.description && <p className="text-sm mt-1">{event.description}</p>}
                        {event.location && (
                          <p className="text-sm text-gray-500">Location: {event.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tracking events recorded yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
              <CardDescription>Order status audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              {order.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {order.statusHistory.map((history: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 shrink-0">
                        {getStatusIcon(history.status)}
                      </div>
                      <div>
                        <p className="font-medium">{history.status}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(history.timestamp)}
                        </p>
                        {history.notes && <p className="text-sm mt-1">{history.notes}</p>}
                        {history.updatedBy && (
                          <p className="text-sm text-gray-500">
                            Updated by: {history.updatedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No status history available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary and Customer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <p>{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Delivery Method</p>
                  <p>{order.deliveryMethod.replace("_", " ")}</p>
                </div>

                {order.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium mb-1">Tracking Number</p>
                    <p>{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Name</p>
                <p>{order.user.name || `${order.user.firstName || ''} ${order.user.lastName || ''}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p>{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-sm font-medium mb-1">Phone</p>
                  <p>{order.user.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
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
        </div>
      </div>
    </div>
  )
}
