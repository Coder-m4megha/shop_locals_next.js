import { AdminAuthProvider } from "@/components/admin-auth-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  )
} 