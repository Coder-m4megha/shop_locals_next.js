import type { Metadata } from "next"
import BlogList from "./blog-list"

export const metadata: Metadata = {
  title: "Style Guide & Blog | Mohit Saree Center",
  description: "Explore our blog for styling tips, trend updates, and fashion inspiration.",
}

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BlogList />
    </main>
  )
}

