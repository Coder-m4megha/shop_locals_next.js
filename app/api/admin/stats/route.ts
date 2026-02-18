import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get total orders
    const totalOrders = await prisma.order.count()

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    })

    // Calculate status counts
    const pendingOrders = ordersByStatus.find(item => item.status === "PENDING")?._count.status || 0
    const processingOrders = ordersByStatus.find(item => item.status === "PROCESSING")?._count.status || 0
    const shippedOrders = ordersByStatus.find(item => item.status === "SHIPPED")?._count.status || 0
    const deliveredOrders = ordersByStatus.find(item => item.status === "DELIVERED")?._count.status || 0

    // Get total revenue (sum of all paid orders)
    const revenueResult = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID"
      },
      _sum: {
        total: true,
      },
    })
    const totalRevenue = revenueResult._sum.total || 0

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.user.name || `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer',
      total: order.total,
      status: order.status,
    }))

    const stats = {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
      recentOrders: formattedRecentOrders,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
