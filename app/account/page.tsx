import type { Metadata } from "next"
import AccountDashboard from "./account-dashboard"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "My Account | Mohit Saree Center",
  description: "Manage your account, orders, and preferences.",
}

export default function AccountPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <AccountDashboard />
    </main>
  )
}

