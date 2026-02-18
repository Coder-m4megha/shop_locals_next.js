import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import OrderDetails from "./order-details"
import OrderStatusUpdate from "./order-status-update"

export const metadata: Metadata = {
  title: "Order Details | Admin Dashboard",
  description: "View and manage order details, update status, and add tracking information",
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  // Fetch the order with all related data
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
        },
      },
      trackingEvents: {
        orderBy: {
          date: "desc",
        },
      },
      statusHistory: {
        orderBy: {
          timestamp: "desc",
        },
      },
    },
  })

  // If order not found, return 404
  if (!order) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <OrderDetails order={order} />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusUpdate
            orderId={order.id}
            currentStatus={order.status as any}
            currentPaymentStatus={order.paymentStatus as any}
            currentTrackingNumber={order.trackingNumber}
          />
        </div>
      </div>
    </main>
  )
}
