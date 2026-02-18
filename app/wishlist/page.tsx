import { getServerSession } from "next-auth/next"
import Link from "next/link"
import Image from "next/image"
import { Heart, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { RemoveFromWishlistButton } from "./remove-button"

export const metadata = {
  title: "My Wishlist | Account",
  description: "View and manage your wishlist items",
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Please sign in to view your wishlist.</p>
          <div className="flex justify-center mt-4">
            <Button asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Fetch wishlist items with product details
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      product: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">
            Save items you love to your wishlist and find them here for easy access.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            // Parse image URLs from JSON string
            const imageUrls = item.product.imageUrls
              ? JSON.parse(item.product.imageUrls)
              : []

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={imageUrls[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <RemoveFromWishlistButton id={item.id} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{item.product.name}</h3>
                    <p className="text-lg font-medium mb-4">₹{item.product.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <Button className="w-full" asChild>
                        <Link href={`/products/${encodeURIComponent(item.product.name)}`}>View Product</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
