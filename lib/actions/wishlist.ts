"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// Get wishlist items for current user
export async function getWishlistItems() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view your wishlist" }
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, wishlistItems }
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    return { success: false, message: "Failed to fetch wishlist items" }
  }
}

// Add item to wishlist
export async function addToWishlist(productId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to add items to your wishlist" }
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    // Check if item already exists in wishlist
    const existingWishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    if (existingWishlistItem) {
      return { success: true, message: "Item already in wishlist" }
    }

    // Create new wishlist item
    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    })

    revalidatePath("/account/wishlist")
    revalidatePath("/products")

    return { success: true, message: "Item added to wishlist successfully" }
  } catch (error) {
    console.error("Error adding item to wishlist:", error)
    return { success: false, message: "Failed to add item to wishlist" }
  }
}

// Remove item from wishlist
export async function removeFromWishlist(wishlistItemId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update your wishlist" }
    }

    // Verify the wishlist item belongs to the user
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: wishlistItemId,
        userId: session.user.id,
      },
    })

    if (!wishlistItem) {
      return { success: false, message: "Wishlist item not found or does not belong to you" }
    }

    // Delete the wishlist item
    await prisma.wishlistItem.delete({
      where: {
        id: wishlistItemId,
      },
    })

    revalidatePath("/account/wishlist")
    revalidatePath("/products")

    return { success: true, message: "Item removed from wishlist successfully" }
  } catch (error) {
    console.error("Error removing wishlist item:", error)
    return { success: false, message: "Failed to remove item from wishlist" }
  }
}

// Clear wishlist
export async function clearWishlist() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to clear your wishlist" }
    }

    // Delete all wishlist items for the user
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    revalidatePath("/account/wishlist")

    return { success: true, message: "Wishlist cleared successfully" }
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    return { success: false, message: "Failed to clear wishlist" }
  }
}

