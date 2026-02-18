import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Details | Mohit Saree Center",
  description: "View detailed information about our premium products.",
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
