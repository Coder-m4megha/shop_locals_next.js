import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Sample blog posts
const blogPosts = [
  {
    id: 1,
    title: "How to Style Your Silk Saree",
    excerpt: "Expert tips on draping and accessorizing your silk saree for any occasion.",
    content:
      "Silk sarees are a timeless classic in Indian fashion. The rich texture and lustrous finish of silk make it a favorite for special occasions and celebrations. In this guide, we'll explore different ways to style your silk saree to create elegant and sophisticated looks.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    date: "March 15, 2023",
    author: "Priya Sharma",
    category: "Styling Tips",
  },
  {
    id: 2,
    title: "Wedding Season Lookbook",
    excerpt: "Curated collection of bridal and wedding guest sarees for the season.",
    content:
      "Wedding season is here, and it's time to update your wardrobe with stunning sarees that will make you stand out at every celebration. From traditional red bridal sarees to elegant pastels for wedding guests, our lookbook has something for everyone.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    date: "April 2, 2023",
    author: "Ananya Patel",
    category: "Lookbook",
  },
  {
    id: 3,
    title: "The Art of Blouse Design",
    excerpt: "Exploring latest trends and timeless classics in blouse designs.",
    content:
      "The blouse is an essential component of the saree ensemble, and the right design can elevate your look to new heights. In this article, we delve into the world of blouse designs, from traditional patterns to contemporary styles that are making waves in the fashion industry.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    date: "May 10, 2023",
    author: "Meera Reddy",
    category: "Fashion Trends",
  },
  {
    id: 4,
    title: "Caring for Your Silk Sarees",
    excerpt: "Essential tips to maintain the beauty and longevity of your silk sarees.",
    content:
      "Silk sarees are an investment that can last for generations if properly cared for. In this guide, we share expert tips on how to store, clean, and maintain your silk sarees to preserve their beauty and ensure they remain a treasured part of your wardrobe for years to come.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    date: "June 5, 2023",
    author: "Kavita Gupta",
    category: "Care Guide",
  },
  {
    id: 5,
    title: "Regional Saree Styles of India",
    excerpt: "A journey through the diverse saree traditions across different regions of India.",
    content:
      "India's rich cultural tapestry is reflected in the diverse saree styles found across its various regions. From the elegant Kanjeevaram of Tamil Nadu to the vibrant Bandhani of Gujarat, each style tells a story of local traditions, craftsmanship, and artistic expression.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    date: "July 12, 2023",
    author: "Priya Sharma",
    category: "Cultural Heritage",
  },
  {
    id: 6,
    title: "Accessorizing Your Ethnic Wear",
    excerpt: "Guide to selecting the perfect jewelry and accessories for your ethnic ensemble.",
    content:
      "The right accessories can transform your ethnic wear from beautiful to breathtaking. In this comprehensive guide, we explore how to select jewelry, handbags, and footwear that complement your saree or ethnic outfit, creating a harmonious and elegant look.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    date: "August 8, 2023",
    author: "Ananya Patel",
    category: "Styling Tips",
  },
]

export default function BlogList() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Style Guide & Inspiration</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our blog for styling tips, trend updates, and fashion inspiration to help you make the most of your
          ethnic wear collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-0">
                <div className="relative aspect-[3/2]">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary">{post.category}</span>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-serif mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">By {post.author}</span>
                    <Button variant="link" className="px-0">
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">Load More Articles</Button>
      </div>
    </div>
  )
}

