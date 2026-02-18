import type { Metadata } from "next"
import SizeGuide from "./size-guide"

export const metadata: Metadata = {
  title: "Size Guide | Mohit Saree Center",
  description: "Find your perfect fit with our comprehensive size guide for blouses and other garments.",
}

export default function SizeGuidePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <SizeGuide />
    </main>
  )
}

