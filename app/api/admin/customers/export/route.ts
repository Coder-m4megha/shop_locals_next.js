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

    // Get all customers with order count
    const customers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Create CSV content
    const csvHeaders = [
      'Customer ID',
      'Name',
      'Email',
      'Phone',
      'Role',
      'Join Date',
      'Total Orders',
    ]

    const csvRows = customers.map(customer => [
      customer.id,
      customer.name || 'N/A',
      customer.email,
      customer.phone || 'N/A',
      customer.role,
      new Date(customer.createdAt).toLocaleDateString(),
      customer._count.orders.toString(),
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
        'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

    return response

  } catch (error) {
    console.error('Error exporting customers:', error)
    return NextResponse.json(
      { error: 'Failed to export customers' },
      { status: 500 }
    )
  }
}
