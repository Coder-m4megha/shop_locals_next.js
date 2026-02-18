"use server"

import { prisma } from "@/lib/prisma"

/**
 * Get a product by its ID
 */
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    return { success: true, product }
  } catch (error) {
    console.error("Error fetching product:", error)
    return { success: false, message: "Failed to fetch product" }
  }
}

/**
 * Get a product by its slug (which can be an ID or a URL-friendly name)
 */
export async function getProductBySlug(slug: string) {
  try {
    // First try to find by exact ID match (handle both string and numeric IDs)
    let product = await prisma.product.findUnique({
      where: { id: slug },
    })

    // If not found by string ID, try converting numeric ID to string
    if (!product && /^\d+$/.test(slug)) {
      product = await prisma.product.findUnique({
        where: { id: slug },
      })
    }

    // If not found by ID, try to find by name (converted to slug format)
    if (!product) {
      // Convert slug back to a potential product name
      const possibleName = decodeURIComponent(slug)

      // For SQLite, we can't use mode: 'insensitive' with equals
      product = await prisma.product.findFirst({
        where: {
          name: possibleName, // Direct equals is case-sensitive in SQLite
        },
      })

      // If not found, try case-insensitive search with contains
      if (!product) {
        product = await prisma.product.findFirst({
          where: {
            name: {
              contains: possibleName,
              // SQLite's LIKE is case-insensitive by default for ASCII
            }
          },
        })
      }
    }

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    return { success: true, product }
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return { success: false, message: "Failed to fetch product" }
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return { success: true, products }
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return { success: false, message: "Failed to fetch featured products" }
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string, limit = 20) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return { success: true, products }
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return { success: false, message: "Failed to fetch products" }
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit = 20) {
  try {
    // For SQLite, remove mode: 'insensitive' as it's not supported
    // SQLite's LIKE operator (used for contains) is case-insensitive by default for ASCII
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              // SQLite's LIKE is case-insensitive by default
            },
          },
          {
            description: {
              contains: query,
              // SQLite's LIKE is case-insensitive by default
            },
          },
          {
            category: {
              contains: query,
              // SQLite's LIKE is case-insensitive by default
            },
          },
          {
            tags: {
              contains: query,
              // SQLite's LIKE is case-insensitive by default
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return { success: true, products }
  } catch (error) {
    console.error("Error searching products:", error)
    return { success: false, message: "Failed to search products" }
  }
}
