import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  salePrice: z.number().positive().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  sku: z.string().optional(),
  imageUrls: z.string(),
  tags: z.string(),
  isActive: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = productSchema.parse(body)

    // Generate SKU if not provided
    if (!validatedData.sku) {
      const timestamp = Date.now()
      const categoryPrefix = validatedData.category.toUpperCase().substring(0, 3)
      validatedData.sku = `${categoryPrefix}-${timestamp}`
    }

    const product = await prisma.product.create({
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product,
    })

  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid product data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
