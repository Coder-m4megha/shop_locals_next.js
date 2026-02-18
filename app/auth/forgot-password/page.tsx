import type { Metadata } from "next"
import ForgotPasswordForm from "./forgot-password-form"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Forgot Password | Mohit Saree Center",
  description: "Reset your password to regain access to your account.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ForgotPasswordForm />
    </main>
  )
}
