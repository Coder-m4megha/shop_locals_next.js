import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const wishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      items: wishlistItems,
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = wishlistSchema.parse(body)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if item is already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        productId: validatedData.productId,
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: validatedData.productId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
      item: wishlistItem,
    })

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = wishlistSchema.parse(body)

    // Find and delete the wishlist item
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId: validatedData.productId,
      },
    })

    if (deletedItem.count === 0) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
    })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
