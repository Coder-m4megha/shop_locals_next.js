import { Metadata } from "next"
import FAQSection from "./faq-section"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Mohit Saree Center",
  description: "Find answers to common questions about our sarees, blouses, shipping, returns, and more.",
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FAQSection />
    </div>
  )
}
