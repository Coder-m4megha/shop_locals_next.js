import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all orders with user and items information
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Create CSV content
    const csvHeaders = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Order Date',
      'Status',
      'Total Amount',
      'Items Count',
      'Product Names',
    ]

    const csvRows = orders.map(order => [
      order.orderNumber,
      order.user?.name || 'N/A',
      order.user?.email || 'N/A',
      order.user?.phone || 'N/A',
      new Date(order.createdAt).toLocaleDateString(),
      order.status,
      order.total.toString(),
      order.items.length.toString(),
      order.items.map(item => `${item.product?.name} (${item.quantity})`).join('; '),
    ])

    // Combine headers and rows
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

    return response

  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
