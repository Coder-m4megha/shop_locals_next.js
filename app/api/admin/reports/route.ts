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

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const previousStartDate = new Date()
    previousStartDate.setDate(previousStartDate.getDate() - (days * 2))
    previousStartDate.setDate(previousStartDate.getDate() + days)

    // Get current period data
    const [
      currentOrders,
      previousOrders,
      totalCustomers,
      totalProducts,
      ordersByStatus,
    ] = await Promise.all([
      // Current period orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      
      // Previous period orders for comparison
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      }),
      
      // Total customers
      prisma.user.count(),
      
      // Total products
      prisma.product.count({
        where: { isActive: true },
      }),
      
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ])

    // Calculate metrics
    const totalRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    const totalOrders = currentOrders.length
    const previousOrderCount = previousOrders.length
    const orderGrowth = previousOrderCount > 0 ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 0

    // For customer growth, we'll use a simple calculation
    const customerGrowth = 5.2 // Placeholder - you can implement proper calculation

    // Calculate top products
    const productSales: Record<string, { sales: number; revenue: number }> = {}
    
    currentOrders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.product?.name || 'Unknown Product'
        if (!productSales[productName]) {
          productSales[productName] = { sales: 0, revenue: 0 }
        }
        productSales[productName].sales += item.quantity
        productSales[productName].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // Calculate monthly sales (simplified for last few months)
    const monthlySales = []
    for (let i = 2; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i)
      monthStart.setDate(1)
      
      const monthEnd = new Date()
      monthEnd.setMonth(monthEnd.getMonth() - i + 1)
      monthEnd.setDate(0)
      
      const monthOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0)
      
      monthlySales.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        orders: monthOrders.length,
      })
    }

    const reportData = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueGrowth,
      orderGrowth,
      customerGrowth,
      topProducts,
      monthlySales,
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: item._count.status,
      })),
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
