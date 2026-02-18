import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

export default function ProductGrid() {
  const products = [
    {
      id: 1,
      name: "Banarasi Silk Saree",
      price: 24999,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    },
    {
      id: 2,
      name: "Designer Embroidered Blouse",
      price: 8999,
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 3,
      name: "Kanjeevaram Silk Saree",
      price: 34999,
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 4,
      name: "Zari Work Blouse",
      price: 12999,
      image: "/placeholder.svg?height=600&width=400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${encodeURIComponent(product.name)}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative aspect-[3/4]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-lg font-serif">₹{product.price.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

