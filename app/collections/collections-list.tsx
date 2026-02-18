import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Sample collections
const collections = [
  {
    id: 1,
    name: "Bridal Collection",
    description:
      "Exquisite sarees for your special day, featuring rich fabrics, intricate embroidery, and timeless designs that celebrate the beauty of traditional Indian craftsmanship.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    itemCount: 24,
  },
  {
    id: 2,
    name: "Designer Blouses",
    description:
      "Elevate your saree ensemble with our exclusive designer blouses, crafted with meticulous attention to detail and featuring contemporary designs that make a statement.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    itemCount: 36,
  },
  {
    id: 3,
    name: "Festive Wear",
    description:
      "Celebrate special occasions in style with our festive collection, featuring vibrant colors, luxurious fabrics, and exquisite embellishments that capture the spirit of celebration.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    itemCount: 42,
  },
  {
    id: 4,
    name: "Silk Sarees",
    description:
      "Indulge in the luxury of pure silk with our collection of handcrafted silk sarees, showcasing traditional weaving techniques and timeless designs that exude elegance.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    itemCount: 30,
  },
  {
    id: 5,
    name: "Contemporary Fusion",
    description:
      "Blend tradition with modernity through our fusion collection, featuring innovative designs that reimagine classic styles for the contemporary woman.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    itemCount: 28,
  },
  {
    id: 6,
    name: "Casual Elegance",
    description:
      "Discover everyday luxury with our casual collection, offering comfortable yet sophisticated options that transition seamlessly from day to evening.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    itemCount: 32,
  },
]

export default function CollectionsList() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Our Collections</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collections of premium sarees and designer blouses, each telling a unique story of
          craftsmanship and elegance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-0">
                <div className="relative h-[300px]">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-serif mb-2">{collection.name}</h3>
                      <p className="text-sm opacity-90">{collection.itemCount} items</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
                  <Button variant="link" className="px-0">
                    Explore Collection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

