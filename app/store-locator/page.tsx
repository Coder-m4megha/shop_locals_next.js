import type { Metadata } from "next"
import StoreLocator from "./store-locator"

export const metadata: Metadata = {
  title: "Store Locator | Mohit Saree Center",
  description: "Find our store locations and visit us to explore our premium collection in person.",
}

export default function StoreLocatorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <StoreLocator />
    </main>
  )
}

