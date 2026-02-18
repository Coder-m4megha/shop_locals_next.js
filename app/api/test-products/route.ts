import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
        category: true,
        isActive: true,
      }
    })

    // Test specific products that were having issues
    const testProducts = [
      'Embellished Bridal Saree',
      'Designer Wedding Saree', 
      'Red Bridal Silk Saree',
      'Gold Zari Work Bridal Saree',
      'Kanjeevaram Silk Saree'
    ]

    const foundProducts = testProducts.map(name => {
      const product = products.find(p => p.name === name)
      return {
        name,
        found: !!product,
        id: product?.id || null,
        price: product?.price || null
      }
    })

    return NextResponse.json({
      success: true,
      totalProducts: products.length,
      testResults: foundProducts,
      allProducts: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        salePrice: p.salePrice
      }))
    })

  } catch (error) {
    console.error('Error testing products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
