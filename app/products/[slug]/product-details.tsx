"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart, Share2, Star, Truck, ZoomIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import VirtualTryOn from "./virtual-try-on"

// Sample product data
const products = [
  {
    id: "1",
    name: "Banarasi Silk Saree",
    price: 12999,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
      "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/v/n/e/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrf592kgvn.jpeg?q=20&crop=false",
      "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/f/x/d/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrsyhavxeu.jpeg?q=20&crop=false",
    ],
    category: "sarees",
    fabric: "Banarasi Silk",
    colour: "Red",
    occasion: "Wedding",
    isNew: true,
    description:
      "This exquisite Banarasi silk saree is handcrafted by skilled artisans using traditional techniques. The rich red colour symbolizes prosperity and is adorned with intricate gold zari work that showcases the heritage of Indian craftsmanship. Perfect for weddings and special occasions, this saree is a timeless addition to your ethnic wardrobe.",
    details: [
      "Material: Pure Banarasi Silk",
      "Length: 6.3 meters (saree), 0.8 meters (blouse piece)",
      "Zari: Real gold thread work",
      "Border: Wide golden border with traditional motifs",
      "Pallu: Richly decorated with intricate patterns",
      "Blouse Piece: Included (unstitched)",
      "Care: Dry clean only",
    ],
    reviews: [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        date: "March 15, 2023",
        comment:
          "The saree is absolutely stunning! The colour is vibrant and the zari work is exquisite. I received so many compliments when I wore it for my sister's wedding.",
      },
      {
        id: 2,
        name: "Ananya Patel",
        rating: 4,
        date: "April 2, 2023",
        comment:
          "Beautiful saree with excellent craftsmanship. The only reason for 4 stars is that the blouse piece was slightly different in colour tone.",
      },
    ],
  },
  {
    id: "2",
    name: "Gold Brocade Designer Blouse",
    price: 8999,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
      "https://img.tatacliq.com/images/i23//437Wx649H/MP000000025750170_437Wx649H_202503201352162.jpeg",
      "https://img.tatacliq.com/images/i23//437Wx649H/MP000000025750164_437Wx649H_202503201352114.jpeg",
    ],
    category: "blouses",
    fabric: "Brocade",
    colour: "Gold",
    occasion: "Wedding",
    isNew: true,
    description:
      "This stunning gold brocade designer blouse features intricate woven patterns that add a touch of luxury to your ensemble. The metallic gold finish catches the light beautifully, making it perfect for special occasions and celebrations. Pair it with a contrasting saree for a head-turning look.",
    details: [
      "Material: Premium Brocade",
      "Style: Ready-to-wear",
      "Back: Hook closure",
      "Sleeve Length: Sleeveless",
      "Neckline: Round neck",
      "Care: Dry clean only",
    ],
    reviews: [
      {
        id: 1,
        name: "Meera Reddy",
        rating: 5,
        date: "February 10, 2023",
        comment:
          "The blouse is absolutely gorgeous! The quality is excellent and the fit is perfect. I paired it with my maroon saree and received so many compliments.",
      },
    ],
  },
  {
    id: "3",
    name: "Royal Blue Embroidered Blouse",
    price: 8499,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
    category: "blouses",
    fabric: "Georgette",
    colour: "Royal Blue",
    occasion: "Festive",
    isNew: true,
    description:
      "This royal blue georgette blouse features exquisite embroidery and sequin work that adds a touch of glamour to your festive ensemble. The vibrant blue colour is complemented by intricate patterns, making it a versatile piece that can be paired with various sarees for different occasions.",
    details: [
      "Material: Georgette with embroidery",
      "Style: Ready-to-wear",
      "Back: Hook closure",
      "Sleeve Length: Elbow length",
      "Neckline: Round neck",
      "Embellishments: Sequins and thread work",
      "Care: Dry clean only",
    ],
    reviews: [
      {
        id: 1,
        name: "Kavita Gupta",
        rating: 5,
        date: "January 20, 2023",
        comment:
          "The colour is even more vibrant in person! The embroidery work is detailed and beautiful. Very happy with my purchase.",
      },
    ],
  },
  {
    id: "4",
    name: "Teal Embroidered Blouse",
    price: 10999,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
    category: "blouses",
    fabric: "Georgette",
    colour: "Teal",
    occasion: "Party",
    isNew: false,
    description:
      "This teal georgette blouse features delicate floral embroidery and sequin details that catch the light beautifully. The rich teal colour provides a sophisticated backdrop for the intricate needlework, making it perfect for festive occasions and celebrations.",
    details: [
      "Material: Georgette with embroidery",
      "Style: Ready-to-wear",
      "Back: Hook closure",
      "Sleeve Length: Elbow length",
      "Neckline: Round neck",
      "Embellishments: Sequins and thread work",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "5",
    name: "Peach Organza Blouse",
    price: 9999,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_01-B16q3yAZcKUp2HWUx4i4Q1QHTHiSqs.webp",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
    category: "blouses",
    fabric: "Organza",
    colour: "Peach",
    occasion: "Event",
    isNew: false,
    description:
      "This peach organza blouse features delicate floral embroidery and metallic accents that add a touch of elegance to your bridal ensemble. The soft peach colour is complemented by intricate patterns, making it a perfect choice for wedding ceremonies and special occasions.",
    details: [
      "Material: Organza with embroidery",
      "Style: Ready-to-wear",
      "Back: Hook closure",
      "Sleeve Length: Elbow length",
      "Neckline: V-neck",
      "Embellishments: Sequins and thread work",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "6",
    name: "Cream Floral Embroidered Blouse",
    price: 7999,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
    category: "blouses",
    fabric: "Georgette",
    colour: "Cream",
    occasion: "Festive/Party",
    isNew: false,
    description:
      "This cream georgette blouse features intricate floral embroidery that adds a touch of elegance to your festive ensemble. The neutral cream colour makes it versatile enough to pair with sarees of various colours and patterns, making it a valuable addition to your ethnic wardrobe.",
    details: [
      "Material: Georgette with embroidery",
      "Style: Ready-to-wear",
      "Back: Hook closure",
      "Sleeve Length: Elbow length",
      "Neckline: Round neck",
      "Embellishments: Thread work",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "7",
    name: "Kanjeevaram Silk Saree",
    price: 1999,
    images: [
      "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_3_1024x1024.jpg?v=1698125767",
      "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_6_1024x1024.jpg?v=1698125765",
      "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_1.jpg",
    ],
    category: "sarees",
    fabric: "Kanjeevaram Silk",
    colour: "Purple",
    occasion: "Wedding",
    isNew: true,
    description:
      "This exquisite Kanjeevaram silk saree features traditional South Indian craftsmanship with rich red colour and intricate gold zari work. The heavy silk fabric and authentic weaving techniques make it perfect for weddings and special ceremonies. A timeless piece that represents the heritage of Tamil Nadu's textile artistry.",
    details: [
      "Material: Pure Kanjeevaram Silk",
      "Style: Traditional South Indian",
      "Border: Heavy gold zari work",
      "Pallu: Intricate traditional motifs",
      "Length: 6.5 meters with blouse piece",
      "Weave: Handwoven",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "8",
    name: "Embellished Bridal Saree",
    price: 2499,
    images: [
      "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_01_1.jpg?width=820",
      "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_03_1.jpg?width=820",
      "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_04_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
    ],
    category: "sarees",
    fabric: "Silk",
    colour: "Red",
    occasion: "Festive/Party",
    isNew: true,
    description:
      "This stunning embellished bridal saree features heavy embroidery work with sequins, beads, and zari detailing. Perfect for wedding ceremonies, this saree combines traditional craftsmanship with contemporary design elements to create a truly magnificent bridal ensemble.",
    details: [
      "Material: Pure Silk with embellishments",
      "Style: Heavy bridal work",
      "Border: Embellished with sequins and beads",
      "Pallu: Heavy embroidery work",
      "Length: 6.5 meters with blouse piece",
      "Occasion: Wedding ceremonies",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "9",
    name: "Designer Wedding Saree",
    price: 1000,
    images: [
      "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_02.jpg?width=820",
      "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_04.jpg?width=1200",
      "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_03.jpg?width=750&height=1125&canvas=750,1125&optimize=medium&bg-color=255,255,255&fit=bounds",
    ],
    category: "sarees",
    fabric: "Designer Silk",
    colour: "Multi",
    occasion: "Party/Event",
    isNew: true,
    description:
      "This designer wedding saree showcases exquisite craftsmanship with intricate patterns and luxurious fabric. Designed for the modern bride who appreciates traditional elegance with contemporary flair, this saree is perfect for wedding ceremonies and special occasions.",
    details: [
      "Material: Designer Silk",
      "Style: Contemporary design",
      "Border: Designer patterns",
      "Pallu: Intricate work",
      "Length: 6.5 meters with blouse piece",
      "Occasion: Wedding and special events",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "10",
    name: "Red Bridal Silk Saree",
    price: 8999,
    images: [
      "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/2024/DECEMBER/4/NBCn41cG_7e28348561d442f6b04a99b02a3f4d24.jpg",
      "https://queensuits.com/wp-content/uploads/2024/06/Beautiful-Red-Color-Soft-Lichi-Silk-Jacquard-All-Over-Work-Saree-2-1.jpeg",
      "https://assets0.mirraw.com/images/12562525/image_zoom.jpeg?1718496094",
    ],
    category: "sarees",
    fabric: "Pure Silk",
    colour: "Red",
    occasion: "Wedding/Party",
    isNew: true,
    description:
      "This magnificent red bridal silk saree embodies the essence of traditional Indian weddings. Crafted from pure silk with intricate gold zari work, this saree represents prosperity and joy. The rich red colour symbolizes love and commitment, making it perfect for the bride's special day.",
    details: [
      "Material: Pure Silk",
      "Style: Traditional bridal",
      "Border: Gold zari work",
      "Pallu: Traditional motifs",
      "Length: 6.5 meters with blouse piece",
      "Colour: Rich red",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
  {
    id: "11",
    name: "Gold Zari Work Bridal Saree",
    price: 9999,
    images: [
      "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_04.jpg?width=1200",
      "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_02.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
      "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_01.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
    ],
    category: "sarees",
    fabric: "Silk with Zari",
    colour: "Gold",
    occasion: "Wedding",
    isNew: true,
    description:
      "This opulent bridal saree features extensive gold zari work that creates stunning patterns across the fabric. The intricate metallic threadwork catches light beautifully, creating a regal appearance perfect for wedding ceremonies and grand celebrations.",
    details: [
      "Material: Silk with gold zari",
      "Style: Heavy zari work",
      "Border: Extensive gold work",
      "Pallu: Rich zari patterns",
      "Length: 6.5 meters with blouse piece",
      "Finish: Metallic gold",
      "Care: Dry clean only",
    ],
    reviews: [],
  },
]

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  imageUrls: string
  description: string
  category: string
  tags: string
  stock: number
  sku: string
  isActive: boolean
}

export default function ProductDetail({ product: dbProduct }: { product: Product }) {
  // Parse the imageUrls from JSON string
  const imageUrls = JSON.parse(dbProduct.imageUrls || '[]')
  const tags = JSON.parse(dbProduct.tags || '[]')

  // Find matching sample product for additional details, fallback to first product
  const sampleProduct = products.find((p) => p.name === dbProduct.name) || products[0]

  // Merge database product with sample product details
  const product = {
    ...sampleProduct,
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    salePrice: dbProduct.salePrice,
    images: imageUrls.length > 0 ? imageUrls : sampleProduct.images,
    description: dbProduct.description || sampleProduct.description,
    category: dbProduct.category,
    isNew: tags.includes('new') || sampleProduct.isNew,
  }
  const { toast } = useToast()
  const { addItem } = useCart()

  const [mainImage, setMainImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState("1")
  const [size, setSize] = useState("")
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState("details")

  const addToCart = () => {
  if (product.category === "blouses" && !size) {
    toast({
      title: "Please select a size",
      description: "You need to select a size before adding this item to your cart.",
      variant: "destructive",
    })
    return
  }

  addItem({
    productId: product.id,
    quantity: Number.parseInt(quantity),
    size: size || undefined,
    // Only include colour if your cart context accepts it
    ...(product.colour ? { colour: product.colour } : {}),
  })
}

  const addToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      toast({
        title: "Share",
        description: "Copy link: " + window.location.href,
      })
    }
  }

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return

    const container = e.currentTarget
    const rect = container.getBoundingClientRect()

    // Calculate relative position within the container (0 to 1)
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setZoomPosition({ x, y })
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div
            className={`relative aspect-square overflow-hidden rounded-lg border ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleImageZoom}
            onMouseLeave={() => isZoomed && setIsZoomed(false)}
          >
            <div
              className={`w-full h-full transition-transform ${isZoomed ? "scale-150" : ""}`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                    }
                  : {}
              }
            >
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            {product.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
            {!isZoomed && (
              <div className="absolute bottom-2 right-2 bg-white/80 p-1 rounded-full">
                <ZoomIn className="h-5 w-5" />
              </div>
            )}
          </div>

          <div className="flex gap-4 overflow-auto pb-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`relative w-20 h-20 rounded-md border overflow-hidden flex-shrink-0 ${
                  mainImage === image ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setMainImage(image)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-serif mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-secondary text-secondary" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.reviews.length} reviews</span>
          </div>

          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-heading text-primary">₹{product.salePrice.toLocaleString()}</p>
                <p className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</p>
                <Badge variant="destructive" className="text-xs">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </Badge>
              </div>
            ) : (
              <p className="text-2xl font-heading">₹{product.price.toLocaleString()}</p>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Fabric</p>
                <p>{product.fabric}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Colour</p>
                <p>{product.colour}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Occasion</p>
                <p>{product.occasion}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Category</p>
                <p className="capitalize">{product.category}</p>
              </div>
            </div>

            {product.category === "blouses" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Size</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32">32</SelectItem>
                    <SelectItem value="34">34</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="38">38</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="42">42</SelectItem>
                  </SelectContent>
                </Select>
                <Link href="/size-guide" className="text-sm text-primary mt-1 inline-block">
                  Size Guide
                </Link>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Quantity</label>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="flex-1" onClick={addToCart}>
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={addToWishlist}>
              <Heart className="h-4 w-4 mr-2" />
              Add to Wishlist
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Truck className="h-4 w-4" />
            <span>Free shipping on orders above ₹5,000</span>
          </div>

          <Button variant="ghost" size="sm" onClick={shareProduct}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger
            value="details"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Product Details
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Reviews ({product.reviews.length})
          </TabsTrigger>
          <TabsTrigger
            value="virtual-try-on"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Virtual Try-On
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Specifications</h3>
            <ul className="space-y-2">
              {product.details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  {detail}
                </li>
              ))}
            </ul>

            {product.category === "blouses" && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Size Chart</h3>
                <div className="overflow-x-auto">
                  <table className="w-full size-guide-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Bust (inches)</th>
                        <th>Waist (inches)</th>
                        <th>Hip (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>32</td>
                        <td>32</td>
                        <td>28</td>
                        <td>35</td>
                      </tr>
                      <tr>
                        <td>34</td>
                        <td>34</td>
                        <td>30</td>
                        <td>37</td>
                      </tr>
                      <tr>
                        <td>36</td>
                        <td>36</td>
                        <td>32</td>
                        <td>39</td>
                      </tr>
                      <tr>
                        <td>38</td>
                        <td>38</td>
                        <td>34</td>
                        <td>41</td>
                      </tr>
                      <tr>
                        <td>40</td>
                        <td>40</td>
                        <td>36</td>
                        <td>43</td>
                      </tr>
                      <tr>
                        <td>42</td>
                        <td>42</td>
                        <td>38</td>
                        <td>45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Care Instructions</h3>
              <p>To ensure the longevity of your garment, please follow these care instructions:</p>
              <ul className="space-y-2 mt-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Dry clean only
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Store in a cool, dry place
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Avoid direct sunlight for extended periods
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Handle embellishments with care
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{review.name}</h4>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to review this product</p>
              <Button>Write a Review</Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="virtual-try-on" className="pt-6">
          <VirtualTryOn productImage={product.images[0]} productName={product.name} />
        </TabsContent>
      </Tabs>

      <div className="mb-12">
        <h2 className="text-2xl font-serif mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${encodeURIComponent(relatedProduct.name)}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{relatedProduct.name}</h3>
                      <p className="text-lg font-serif">₹{relatedProduct.price.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

