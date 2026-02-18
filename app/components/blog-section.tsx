import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

export default function BlogSection() {
  const posts = [
    {
      id: 1,
      title: "How to Style Your Silk Saree",
      excerpt: "Expert tips on draping and accessorizing your silk saree for any occasion.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Wedding Season Lookbook",
      excerpt: "Curated collection of bridal and wedding guest sarees for the season.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "The Art of Blouse Design",
      excerpt: "Exploring latest trends and timeless classics in blouse designs.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative aspect-[3/2]">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

