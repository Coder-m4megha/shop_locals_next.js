import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const color = searchParams.get('color')
    const fabric = searchParams.get('fabric')
    const occasion = searchParams.get('occasion')
    const priceRange = searchParams.get('price')
    const sort = searchParams.get('sort')

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = category
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }

    if (sort) {
      switch (sort) {
        case 'price-low':
          orderBy = { price: 'asc' }
          break
        case 'price-high':
          orderBy = { price: 'desc' }
          break
        case 'name':
          orderBy = { name: 'asc' }
          break
        case 'newest':
          orderBy = { createdAt: 'desc' }
          break
        default:
          orderBy = { createdAt: 'desc' }
      }
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        salePrice: true,
        imageUrls: true,
        category: true,
        tags: true,
        stock: true,
        sku: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Transform products to include parsed imageUrls and tags
    const transformedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.imageUrls || '[]'),
      tags: JSON.parse(product.tags || '[]'),
      // Keep the original imageUrls for compatibility
      imageUrls: product.imageUrls
    }))

    // Apply additional filters that can't be done in SQL
    let filteredProducts = transformedProducts

    if (color) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags.some((tag: string) => tag.toLowerCase().includes(color.toLowerCase()))
      )
    }

    if (fabric) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags.some((tag: string) => tag.toLowerCase().includes(fabric.toLowerCase()))
      )
    }

    if (occasion) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags.some((tag: string) => tag.toLowerCase().includes(occasion.toLowerCase()))
      )
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      filteredProducts = filteredProducts.filter(product => {
        const price = product.salePrice || product.price
        return price >= min && price <= max
      })
    }

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      count: filteredProducts.length
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        products: [],
        count: 0
      },
      { status: 500 }
    )
  }
}
