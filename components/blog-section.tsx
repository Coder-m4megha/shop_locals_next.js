import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BlogSection() {
  const posts = [
    {
      id: 1,
      title: "How to Style Your Silk Saree",
      excerpt: "Expert tips on draping and accessorizing your silk saree for any occasion.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
      date: "March 15, 2023",
    },
    {
      id: 2,
      title: "Wedding Season Lookbook",
      excerpt: "Curated collection of bridal and wedding guest sarees for the season.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
      date: "April 2, 2023",
    },
    {
      id: 3,
      title: "The Art of Blouse Design",
      excerpt: "Exploring latest trends and timeless classics in blouse designs.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
      date: "May 10, 2023",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-0">
              <div className="relative aspect-[3/2]">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                <h3 className="text-lg font-serif mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <Button variant="link" className="px-0">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

