

import type { Metadata } from "next"
import AdminDashboard from "./admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Mohit Saree Center",
  description: "Administrative dashboard for managing orders, customers, and products.",
}

export default function AdminPage() {
  return (
    <main>
      <AdminDashboard />
    </main>
  )
}
