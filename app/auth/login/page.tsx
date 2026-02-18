import type { Metadata } from "next"
import LoginForm from "./login-form"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Login | Mohit Saree Center",
  description: "Login to your account to manage orders, wishlist, and more.",
}

export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <LoginForm />
    </main>
  )
}

