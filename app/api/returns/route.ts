import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const returnRequestSchema = z.object({
  orderId: z.string(),
  items: z.array(z.object({
    orderItemId: z.string(),
    reason: z.string(),
    description: z.string().optional(),
  })),
  preferredResolution: z.enum(['REFUND', 'EXCHANGE']),
})

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
    const validatedData = returnRequestSchema.parse(body)

    // Verify the order belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: validatedData.orderId,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is eligible for return (delivered and within return window)
    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Only delivered orders can be returned' },
        { status: 400 }
      )
    }

    // Check if within return window (7 days)
    const deliveryDate = order.updatedAt // Assuming updatedAt is when it was delivered
    const returnWindow = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    const now = new Date()
    
    if (now.getTime() - deliveryDate.getTime() > returnWindow) {
      return NextResponse.json(
        { error: 'Return window has expired. Returns are only accepted within 7 days of delivery.' },
        { status: 400 }
      )
    }

    // Create return request
    const returnRequest = await prisma.$transaction(async (tx) => {
      // Create the return request record (we'll need to add this to schema)
      // For now, we'll create a simple record in the order notes or create a separate table
      
      // Update order status to indicate return requested
      await tx.order.update({
        where: { id: order.id },
        data: {
          notes: `Return requested: ${validatedData.preferredResolution} - ${JSON.stringify(validatedData.items)}`,
        },
      })

      return {
        id: `RET-${Date.now()}`,
        orderId: order.id,
        status: 'PENDING',
        items: validatedData.items,
        preferredResolution: validatedData.preferredResolution,
        createdAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully',
      returnRequest,
    })

  } catch (error) {
    console.error('Error creating return request:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create return request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's return requests (simplified - in real app you'd have a returns table)
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        notes: {
          contains: 'Return requested',
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      returns: orders.map(order => ({
        id: `RET-${order.id}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: 'PENDING',
        createdAt: order.updatedAt,
        items: order.items,
      })),
    })

  } catch (error) {
    console.error('Error fetching return requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch return requests' },
      { status: 500 }
    )
  }
}
