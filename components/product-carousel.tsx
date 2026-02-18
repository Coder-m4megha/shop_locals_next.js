"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

const products = [
  {
    id: 1,
    name: "Gold Brocade Designer Blouse",
    price: 12999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    description: "Metallic gold brocade blouse with intricate woven patterns",
    isNew: true,
  },
  {
    id: 2,
    name: "Royal Blue Embroidered Blouse",
    price: 15999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
    description: "Royal blue georgette blouse with detailed embroidery and sequin work",
    isNew: true,
  },
  {
    id: 3,
    name: "Teal Embroidered Blouse",
    price: 15999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    description: "Teal georgette blouse with floral embroidery and sequin details",
    isNew: false,
  },
  {
    id: 4,
    name: "Peach Organza Blouse",
    price: 18999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_01-B16q3yAZcKUp2HWUx4i4Q1QHTHiSqs.webp",
    description: "Peach organza blouse with delicate floral embroidery and metallic accents",
    isNew: false,
  },
  {
    id: 5,
    name: "Cream Floral Embroidered Blouse",
    price: 16999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
    description: "Cream georgette blouse with intricate floral embroidery",
    isNew: false,
  },
]

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const { toast } = useToast()

  const itemsToShow = React.useMemo(() => {
    // Responsive number of items to show
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= products.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1))
  }

  const visibleProducts = React.useMemo(() => {
    const items = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % products.length
      items.push(products[index])
    }
    return items
  }, [currentIndex, itemsToShow])

  const addToWishlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()
    toast({
      title: "Added to wishlist",
      description: "This product has been added to your wishlist.",
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-6 overflow-hidden px-8">
          {visibleProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="w-full">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    {product.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                      onClick={(e) => addToWishlist(e, product.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-serif">₹{product.price.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

