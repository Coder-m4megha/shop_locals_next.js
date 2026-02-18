import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminSettings from "./admin-settings"

export const metadata: Metadata = {
  title: "Settings | Admin Dashboard",
  description: "Manage application settings and configurations.",
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/auth/login?type=admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminSettings />
    </div>
  )
}
