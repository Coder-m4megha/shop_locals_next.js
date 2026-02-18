import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminCustomerManagement from "./admin-customer-management"

export const metadata: Metadata = {
  title: "Customer Management | Admin Dashboard",
  description: "Manage customers, view profiles, and track customer activity.",
}

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/auth/login?type=admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminCustomerManagement />
    </div>
  )
}
