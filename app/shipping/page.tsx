import { Metadata } from "next"
import ShippingInfo from "./shipping-info"

export const metadata: Metadata = {
  title: "Shipping Information - Mohit Saree Center",
  description: "Learn about our shipping policies, delivery times, and shipping charges for sarees and blouses.",
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ShippingInfo />
    </div>
  )
}
