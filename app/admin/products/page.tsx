import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminProductManagement from "./admin-product-management"

export const metadata: Metadata = {
  title: "Product Management | Admin Dashboard",
  description: "Manage products, inventory, and pricing.",
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/auth/login?type=admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminProductManagement />
    </div>
  )
}
