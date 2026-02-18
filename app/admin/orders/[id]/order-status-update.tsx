"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { updateOrderStatus } from "@/lib/actions/order"

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED"
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: OrderStatus
  currentPaymentStatus: PaymentStatus
  currentTrackingNumber?: string
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTrackingNumber
}: OrderStatusUpdateProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    status: currentStatus,
    paymentStatus: currentPaymentStatus,
    trackingNumber: currentTrackingNumber || "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateOrderStatus(orderId, {
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        trackingNumber: formData.trackingNumber || undefined,
        notes: formData.notes || undefined,
      })

      if (result.success) {
        toast({
          title: "Order Updated",
          description: "Order status has been updated successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Update Failed",
          description: result.message || "Failed to update order status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Order Status</CardTitle>
        <CardDescription>
          Change order status, payment status, and add tracking information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange("paymentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
            <Input
              id="trackingNumber"
              value={formData.trackingNumber}
              onChange={(e) => handleInputChange("trackingNumber", e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any notes about this status update..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Order Status
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
