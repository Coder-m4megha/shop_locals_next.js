import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminOrderManagement from "./admin-order-management"

export const metadata: Metadata = {
  title: "Order Management | Admin Dashboard",
  description: "Manage customer orders, track shipments, and update order status.",
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/login?type=admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminOrderManagement />
    </div>
  )
}
