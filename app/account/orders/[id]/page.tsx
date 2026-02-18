import type { Metadata } from "next"
import OrderDetail from "./order-detail"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Order Details | Mohit Saree Center",
  description: "View and track your order details.",
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <OrderDetail id={params.id} />
    </main>
  )
}

