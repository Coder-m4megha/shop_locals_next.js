import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

export default function FeaturedCollection() {
  const collections = [
    {
      id: 1,
      name: "Bridal Collection",
      description: "Exquisite sarees for your special day",
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 2,
      name: "Designer Blouses",
      description: "Intricately crafted designer pieces",
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 3,
      name: "Festive Wear",
      description: "Celebrate in style",
      image: "/placeholder.svg?height=600&width=400",
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

