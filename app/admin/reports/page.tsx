import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminReports from "./admin-reports"

export const metadata: Metadata = {
  title: "Reports & Analytics | Admin Dashboard",
  description: "View sales reports, analytics, and business insights.",
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/auth/login?type=admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminReports />
    </div>
  )
}
