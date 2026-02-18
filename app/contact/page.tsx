import { Metadata } from "next"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "Contact Us - Mohit Saree Center",
  description: "Get in touch with Mohit Saree Center. We're here to help with your saree and blouse needs.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ContactForm />
    </div>
  )
}
