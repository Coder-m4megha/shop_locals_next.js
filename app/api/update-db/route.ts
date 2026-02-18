import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔄 Updating database with latest product images...')

    // Update Kanjeevaram Silk Saree
    await prisma.product.upsert({
      where: { id: "7" },
      update: {
        name: "Kanjeevaram Silk Saree",
        description: "Traditional South Indian Kanjeevaram silk saree with gold zari work",
        price: 34999,
        salePrice: 29999,
        imageUrls: JSON.stringify([
          "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0067_compact.jpg?v=1571711124",
          "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_1200x1200.jpg?v=1571711124",
          "/placeholder.svg?height=800&width=600",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'kanjeevaram', 'silk', 'wedding', 'traditional']),
        stock: 8,
        sku: "SAREE-KAN-001",
        isActive: true,
      },
      create: {
        id: "7",
        name: "Kanjeevaram Silk Saree",
        description: "Traditional South Indian Kanjeevaram silk saree with gold zari work",
        price: 34999,
        salePrice: 29999,
        imageUrls: JSON.stringify([
          "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0067_compact.jpg?v=1571711124",
          "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_1200x1200.jpg?v=1571711124",
          "/placeholder.svg?height=800&width=600",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'kanjeevaram', 'silk', 'wedding', 'traditional']),
        stock: 8,
        sku: "SAREE-KAN-001",
        isActive: true,
      }
    })

    // Update other products with their latest images
    await prisma.product.updateMany({
      where: { name: "Banarasi Silk Saree" },
      data: {
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
          "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/v/n/e/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrf592kgvn.jpeg?q=20&crop=false",
          "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/f/x/d/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrsyhavxeu.jpeg?q=20&crop=false",
        ])
      }
    })

    // Get all products to verify
    const products = await prisma.product.findMany()
    
    return NextResponse.json({
      success: true,
      message: `Database updated successfully! Found ${products.length} products.`,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        imageCount: JSON.parse(p.imageUrls || '[]').length
      }))
    })

  } catch (error) {
    console.error('Error updating database:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to update the database' 
  })
}
