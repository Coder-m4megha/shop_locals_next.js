import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

export default function FeaturedCollection() {
  const collections = [
    {
      id: 1,
      name: "Bridal Collection",
      description: "Exquisite sarees for your special day",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    },
    {
      id: 2,
      name: "Designer Blouses",
      description: "Intricately crafted designer pieces",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    },
    {
      id: 3,
      name: "Festive Wear",
      description: "Celebrate in style",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {collections.map((collection) => (
        <Link key={collection.id} href={`/collections/${collection.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-[400px]">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-serif mb-2">{collection.name}</h3>
                    <p className="text-sm opacity-90">{collection.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

