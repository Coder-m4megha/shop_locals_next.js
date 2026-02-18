import type { Metadata } from "next"
import ShoppingCart from "./shopping-cart"

export const metadata: Metadata = {
  title: "Shopping Cart | Mohit Saree Center",
  description: "View and manage items in your shopping cart.",
}

export default function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ShoppingCart />
    </main>
  )
}

