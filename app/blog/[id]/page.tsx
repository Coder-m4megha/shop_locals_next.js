import type { Metadata } from "next"
import BlogPost from "./blog-post"

export const metadata: Metadata = {
  title: "Blog Post | Mohit Saree Center",
  description: "Read our latest articles on styling tips, trend updates, and fashion inspiration.",
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <BlogPost id={params.id} />
    </main>
  )
}

