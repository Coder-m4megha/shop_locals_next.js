"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// Schema for cart item validation
const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
})

export type CartItemData = z.infer<typeof cartItemSchema>

// Get cart items for current user
export async function getCartItems() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view your cart" }
    }

    const cartItems = await prisma.cartItem.findMany({
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

    return { success: true, cartItems }
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return { success: false, message: "Failed to fetch cart items" }
  }
}

// Add item to cart
export async function addToCart(formData: CartItemData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to add items to your cart" }
    }

    // Validate form data
    const validatedData = cartItemSchema.parse(formData)

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: {
        id: validatedData.productId,
      },
    })

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    if (product.stock < validatedData.quantity) {
      return { success: false, message: "Not enough stock available" }
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: validatedData.productId,
        size: validatedData.size,
        color: validatedData.color,
      },
    })

    if (existingCartItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + validatedData.quantity,
        },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
          size: validatedData.size,
          color: validatedData.color,
        },
      })
    }

    revalidatePath("/cart")

    return { success: true, message: "Item added to cart successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    console.error("Error adding item to cart:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update your cart" }
    }

    if (quantity < 1) {
      return { success: false, message: "Quantity must be at least 1" }
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    })

    if (!cartItem) {
      return { success: false, message: "Cart item not found or does not belong to you" }
    }

    // Check if product has enough stock
    if (cartItem.product.stock < quantity) {
      return { success: false, message: "Not enough stock available" }
    }

    // Update quantity
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    })

    revalidatePath("/cart")

    return { success: true, message: "Cart updated successfully" }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return { success: false, message: "Failed to update cart item" }
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update your cart" }
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    })

    if (!cartItem) {
      return { success: false, message: "Cart item not found or does not belong to you" }
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    })

    revalidatePath("/cart")

    return { success: true, message: "Item removed from cart successfully" }
  } catch (error) {
    console.error("Error removing cart item:", error)
    return { success: false, message: "Failed to remove item from cart" }
  }
}

// Clear cart
export async function clearCart() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to clear your cart" }
    }

    // Delete all cart items for the user
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    revalidatePath("/cart")

    return { success: true, message: "Cart cleared successfully" }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, message: "Failed to clear cart" }
  }
}

// Get cart count
export async function getCartCount() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return 0
    }

    const count = await prisma.cartItem.count({
      where: {
        userId: session.user.id,
      },
    })

    return count
  } catch (error) {
    console.error("Error getting cart count:", error)
    return 0
  }
}

// Add product to cart (simplified version for quick add from order history)
export async function quickAddToCart(productId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to add items to your cart" }
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    if (product.stock < 1) {
      return { success: false, message: "Not enough stock available" }
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
        size: null,
        color: null,
      },
    })

    if (existingCartItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity: 1,
        },
      })
    }

    revalidatePath("/cart")

    return { success: true, message: "Item added to cart successfully" }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

