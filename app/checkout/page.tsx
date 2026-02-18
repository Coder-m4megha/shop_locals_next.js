import type { Metadata } from "next"
import { Suspense } from "react"
import CheckoutForm from "./checkout-form"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout | Mohit Saree Center",
  description: "Complete your purchase securely.",
}

function CheckoutLoading() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading checkout...</span>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutForm />
      </Suspense>
    </main>
  )
}

