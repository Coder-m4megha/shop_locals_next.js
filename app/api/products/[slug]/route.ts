import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/actions/product'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { addToCart } from '@/lib/actions/cart'
import { addToWishlist } from '@/lib/actions/wishlist'

export async function GET(
  _request: NextRequest, // Prefix with underscore to indicate it's not used
  { params }: { params: { slug: string } }
) {
  try {
    const result = await getProductBySlug(params.slug)

    if (!result.success || !result.product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, quantity = 1, size, color } = body

    // Get the product first
    const productResult = await getProductBySlug(params.slug)

    if (!productResult.success || !productResult.product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const productId = productResult.product.id

    // Handle different actions
    if (action === 'addToCart') {
      // The addToCart function will get the userId from the session internally
      const result = await addToCart({
        productId,
        quantity: Number(quantity),
        size,
        color
      })

      if (result.success) {
        return NextResponse.json({ success: true, message: 'Product added to cart' })
      } else {
        return NextResponse.json(
          { error: result.message || 'Failed to add product to cart' },
          { status: 400 }
        )
      }
    }
    else if (action === 'addToWishlist') {
      const result = await addToWishlist(productId)

      if (result.success) {
        return NextResponse.json({ success: true, message: 'Product added to wishlist' })
      } else {
        return NextResponse.json(
          { error: result.message || 'Failed to add product to wishlist' },
          { status: 400 }
        )
      }
    }
    else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing product action:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
