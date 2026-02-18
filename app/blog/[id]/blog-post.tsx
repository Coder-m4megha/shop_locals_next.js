import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Facebook, Instagram, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Sample blog posts
const blogPosts = [
  {
    id: "1",
    title: "How to Style Your Silk Saree",
    excerpt: "Expert tips on draping and accessorizing your silk saree for any occasion.",
    content: `
      <p>Silk sarees are a timeless classic in Indian fashion. The rich texture and lustrous finish of silk make it a favorite for special occasions and celebrations. In this guide, we'll explore different ways to style your silk saree to create elegant and sophisticated looks.</p>
      
      <h2>Choosing the Right Blouse</h2>
      <p>The blouse is a crucial element of your saree ensemble. For silk sarees, consider these options:</p>
      <ul>
        <li>Contrast blouses that complement the saree's border color</li>
        <li>Embellished blouses with embroidery or sequin work for festive occasions</li>
        <li>High-neck or boat-neck designs for a contemporary look</li>
        <li>Three-quarter sleeves for a balanced silhouette</li>
      </ul>
      
      <h2>Draping Techniques</h2>
      <p>The way you drape your saree can significantly impact your overall look. Here are some popular draping styles for silk sarees:</p>
      <ul>
        <li><strong>Nivi Style:</strong> The most common draping style, with pleats in the front and pallu draped over the left shoulder</li>
        <li><strong>Bengali Style:</strong> No pleats in front, with the pallu draped from the right shoulder and brought back to the left</li>
        <li><strong>Gujarati Style:</strong> Similar to Nivi but with the pallu draped from the back to the front over the right shoulder</li>
      </ul>
      
      <h2>Accessorizing Your Silk Saree</h2>
      <p>The right accessories can elevate your silk saree ensemble to new heights:</p>
      <ul>
        <li><strong>Jewelry:</strong> Gold jewelry complements most silk sarees beautifully. Consider temple jewelry for traditional looks or contemporary designs for modern styling.</li>
        <li><strong>Handbags:</strong> Opt for small clutches or potli bags that match or complement your saree.</li>
        <li><strong>Footwear:</strong> Heels add elegance and help the saree drape better. Choose colors that match your blouse or the saree's border.</li>
      </ul>
      
      <h2>Hairstyles to Consider</h2>
      <p>Your hairstyle can complement your silk saree beautifully:</p>
      <ul>
        <li>A classic bun adorned with flowers or decorative pins</li>
        <li>Braided styles with traditional accessories</li>
        <li>Soft curls or waves for a contemporary look</li>
      </ul>
      
      <p>Remember, the key to styling a silk saree is to create a harmonious look where all elements complement each other without overwhelming the ensemble. With these tips, you'll be able to create stunning looks for any occasion.</p>
    `,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    date: "March 15, 2023",
    author: "Priya Sharma",
    category: "Styling Tips",
    relatedPosts: [2, 3, 6],
  },
  {
    id: "2",
    title: "Wedding Season Lookbook",
    excerpt: "Curated collection of bridal and wedding guest sarees for the season.",
    content: `
      <p>Wedding season is here, and it's time to update your wardrobe with stunning sarees that will make you stand out at every celebration. From traditional red bridal sarees to elegant pastels for wedding guests, our lookbook has something for everyone.</p>
      
      <h2>Bridal Sarees</h2>
      <p>The bridal saree is the centerpiece of the wedding ensemble. Here are some exquisite options for the modern bride:</p>
      <ul>
        <li><strong>Banarasi Silk:</strong> A timeless choice with intricate gold zari work, perfect for traditional ceremonies</li>
        <li><strong>Kanjeevaram Silk:</strong> Known for their rich texture and vibrant colors, these sarees are a South Indian favorite</li>
        <li><strong>Embellished Georgette:</strong> Lightweight with heavy embroidery and embellishments for a contemporary look</li>
      </ul>
      
      <h2>For the Mother of the Bride</h2>
      <p>Elegant and sophisticated options that complement the wedding palette:</p>
      <ul>
        <li>Rich jewel tones in silk with subtle embellishments</li>
        <li>Embroidered sarees in muted gold or silver</li>
        <li>Traditional weaves with contemporary blouse designs</li>
      </ul>
      
      <h2>Wedding Guest Attire</h2>
      <p>Stand out as a guest with these stunning options:</p>
      <ul>
        <li><strong>Pastel Organza:</strong> Light, flowy sarees with delicate embroidery for day functions</li>
        <li><strong>Sequined Georgette:</strong> Shimmering options for evening receptions</li>
        <li><strong>Printed Silk:</strong> Contemporary prints on traditional silk for a unique look</li>
      </ul>
      
      <h2>Accessorizing for Wedding Functions</h2>
      <p>Complete your wedding season looks with these accessories:</p>
      <ul>
        <li>Statement jewelry pieces that complement your saree</li>
        <li>Embellished clutches or potli bags</li>
        <li>Comfortable yet elegant heels for long ceremonies</li>
      </ul>
      
      <p>This wedding season, embrace the rich tradition of sarees while incorporating contemporary elements to create memorable looks. Whether you're the bride, a family member, or a guest, there's a perfect saree waiting for you in our collection.</p>
    `,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    date: "April 2, 2023",
    author: "Ananya Patel",
    category: "Lookbook",
    relatedPosts: [1, 3, 5],
  },
  {
    id: "3",
    title: "The Art of Blouse Design",
    excerpt: "Exploring latest trends and timeless classics in blouse designs.",
    content: `
      <p>The blouse is an essential component of the saree ensemble, and the right design can elevate your look to new heights. In this article, we delve into the world of blouse designs, from traditional patterns to contemporary styles that are making waves in the fashion industry.</p>
      
      <h2>Classic Blouse Designs</h2>
      <p>These timeless designs have stood the test of time and continue to be popular choices:</p>
      <ul>
        <li><strong>Round Neck:</strong> A versatile design that suits most body types and occasions</li>
        <li><strong>V-Neck:</strong> Elongates the neck and creates an elegant silhouette</li>
        <li><strong>Square Neck:</strong> A traditional design that frames the face beautifully</li>
        <li><strong>Sweetheart Neck:</strong> Adds a touch of romance to your ensemble</li>
      </ul>
      
      <h2>Contemporary Trends</h2>
      <p>Modern blouse designs that are currently trending:</p>
      <ul>
        <li><strong>Off-Shoulder:</strong> A chic option for cocktail sarees and evening events</li>
        <li><strong>Halter Neck:</strong> Elegant and sophisticated, perfect for special occasions</li>
        <li><strong>Crop Top Style:</strong> A fusion design that adds a contemporary touch to traditional sarees</li>
        <li><strong>Cape Blouses:</strong> Dramatic and stylish, these blouses feature an attached cape for added flair</li>
      </ul>
      
      <h2>Sleeve Variations</h2>
      <p>The sleeve design can significantly impact the overall look of your blouse:</p>
      <ul>
        <li><strong>Bell Sleeves:</strong> Flared sleeves that add movement and drama</li>
        <li><strong>Cold Shoulder:</strong> A trendy design with cutouts at the shoulders</li>
        <li><strong>Puff Sleeves:</strong> Voluminous sleeves that create a romantic silhouette</li>
        <li><strong>Three-Quarter Sleeves:</strong> A practical and elegant option for most occasions</li>
      </ul>
      
      <h2>Embellishment Techniques</h2>
      <p>Elevate your blouse with these embellishment options:</p>
      <ul>
        <li><strong>Zardozi Work:</strong> Intricate gold embroidery for a luxurious look</li>
        <li><strong>Mirror Work:</strong> Traditional embellishment that adds sparkle and cultural flair</li>
        <li><strong>Sequin Work:</strong> Shimmering details for evening and festive wear</li>
        <li><strong>Thread Embroidery:</strong> Delicate and detailed designs for a sophisticated touch</li>
      </ul>
      
      <p>When selecting a blouse design, consider your body type, the occasion, and the saree you'll be pairing it with. The right blouse can transform your saree ensemble, creating a harmonious and stunning look that turns heads and makes a statement.</p>
    `,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    date: "May 10, 2023",
    author: "Meera Reddy",
    category: "Fashion Trends",
    relatedPosts: [1, 2, 6],
  },
]

export default function BlogPost({ id }: { id: string }) {
  const post = blogPosts.find((p) => p.id === id) || blogPosts[0]
  const relatedPosts = post.relatedPosts?.map((id) => blogPosts.find((p) => p.id === id.toString())) || []

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to blog
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary">{post.category}</span>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>
          <p className="text-sm">By {post.author}</p>
        </div>

        <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

        <Separator className="my-8" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Share this article:</span>
            <div className="flex space-x-2 mt-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Share on Instagram</span>
              </Button>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href="/blog">More Articles</Link>
          </Button>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(
              (relatedPost) =>
                relatedPost && (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/2]">
                          <Image
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="font-medium mb-2">{relatedPost.title}</h3>
                          <p className="text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

