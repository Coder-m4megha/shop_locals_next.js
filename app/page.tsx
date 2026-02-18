import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCarousel from "@/components/product-carousel"
import FeaturedCollection from "@/components/featured-collection"
import BlogSection from "@/components/blog-section"
import TestimonialSection from "@/components/testimonial-section"
import CategoryShowcase from "@/components/category-showcase"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative h-[600px] overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg"
            alt="Luxury Red Silk Saree Collection"
            width={2000}
            height={1200}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl text-white">
                <h1 className="text-4xl md:text-5xl font-serif mb-6">Timeless Elegance</h1>
                <p className="text-lg mb-8">
                  Discover our exquisite collection of handcrafted sarees and designer blouses, where tradition meets
                  contemporary elegance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/products?category=sarees">
                      Shop Sarees
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
                    asChild
                  >
                    <Link href="/products?category=blouses">Shop Blouses</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">Luxury Ethnic Wear</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Discover our handcrafted collection of premium sarees and blouses, made with the finest fabrics and
              traditional techniques.
            </p>
            <CategoryShowcase />
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">Designer Blouse Collection</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Exquisite blouses crafted with intricate embroidery and premium fabrics to elevate your ethnic ensemble.
            </p>
            <ProductCarousel />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8">
              <div>
                <h2 className="text-3xl font-serif">Featured Collections</h2>
                <p className="text-muted-foreground mt-2">Curated selections for every occasion</p>
              </div>
              <Link href="/collections" className="text-primary hover:text-primary/90 mt-4 md:mt-0">
                View All Collections
              </Link>
            </div>
            <FeaturedCollection />
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">What Our Customers Say</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Hear from our satisfied customers about their experience with Mohit Saree Center.
            </p>
            <TestimonialSection />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">Style Guide & Inspiration</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Explore our blog for styling tips, trend updates, and fashion inspiration.
            </p>
            <BlogSection />
          </div>
        </section>
      </main>
    </div>
  )
}

