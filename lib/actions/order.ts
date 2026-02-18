"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { OrderStatus, PaymentStatus, DeliveryMethod } from "@/lib/enums";
import { clearCart } from "./cart"

// Schema for creating an order
const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      size: z.string().nullable().optional(),
      color: z.string().nullable().optional(),
    }),
  ),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().positive(),
  paymentMethod: z.string(),
  deliveryMethod: z.enum(["HOME_DELIVERY", "STORE_PICKUP"]),
  addressId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type OrderData = z.infer<typeof orderSchema>

// Schema for updating an order
const orderUpdateSchema = z.object({
  orderId: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
})

export type OrderUpdateData = z.infer<typeof orderUpdateSchema>

// Schema for adding a tracking event
const trackingEventSchema = z.object({
  orderId: z.string(),
  status: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
})

export type TrackingEventData = z.infer<typeof trackingEventSchema>

// Schema for filtering orders
const orderFilterSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
})

export type OrderFilterData = z.infer<typeof orderFilterSchema>

// Schema for updating order status
const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  trackingNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type OrderStatusUpdateData = z.infer<typeof orderStatusUpdateSchema>

// Generate a unique order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD${timestamp}${random}`
}

// Create a new order
export async function createOrder(orderData: OrderData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to place an order" }
    }

    const userId = session.user.id

    // Validate order data
    const validatedData = orderSchema.parse(orderData)

    // Generate a unique order number
    const orderNumber = generateOrderNumber()

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        status: OrderStatus.PENDING,
        subtotal: validatedData.subtotal,
        tax: validatedData.tax,
        shipping: validatedData.shipping,
        total: validatedData.total,
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        deliveryMethod: validatedData.deliveryMethod as DeliveryMethod,
        addressId: validatedData.deliveryMethod === "HOME_DELIVERY" ? validatedData.addressId : null,
        notes: validatedData.notes,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
        statusHistory: {
          create: {
            status: OrderStatus.PENDING,
            notes: "Order placed",
            updatedBy: userId,
          },
        },
      },
      include: {
        items: true,
      },
    })

    // Update product stock
    for (const item of validatedData.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Clear the user's cart
    await clearCart()

    revalidatePath("/account/orders")
    revalidatePath("/cart")

    return {
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
      orderNumber: order.orderNumber,
    }
  } catch (error) {
    console.error("Error creating order:", error)

    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid order data", errors: error.errors }
    }

    return { success: false, message: "Failed to create order" }
  }
}

// Update order status (admin/staff only)
export async function updateOrderStatusByAdmin(updateData: OrderUpdateData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update order status" }
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return { success: false, message: "You do not have permission to update orders" }
    }

    const validatedData = orderUpdateSchema.parse(updateData)

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: {
        id: validatedData.orderId,
      },
      data: {
        status: validatedData.status as OrderStatus,
        ...(validatedData.paymentStatus && { paymentStatus: validatedData.paymentStatus as PaymentStatus }),
        ...(validatedData.trackingNumber && { trackingNumber: validatedData.trackingNumber }),
        statusHistory: {
          create: {
            status: validatedData.status as OrderStatus,
            notes: validatedData.notes,
            updatedBy: session.user.id,
          },
        },
      },
    })

    // If status is SHIPPED, add a tracking event
    if (validatedData.status === "SHIPPED" && validatedData.trackingNumber) {
      await prisma.trackingEvent.create({
        data: {
          orderId: validatedData.orderId,
          status: "Shipped",
          description: `Your order has been shipped with tracking number ${validatedData.trackingNumber}`,
        },
      })
    }

    // If status is DELIVERED, add a tracking event
    if (validatedData.status === "DELIVERED") {
      await prisma.trackingEvent.create({
        data: {
          orderId: validatedData.orderId,
          status: "Delivered",
          description: "Your order has been delivered successfully",
        },
      })
    }

    // If status is CANCELLED, restore product stock
    if (validatedData.status === "CANCELLED") {
      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: validatedData.orderId,
        },
      })

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }

      await prisma.trackingEvent.create({
        data: {
          orderId: validatedData.orderId,
          status: "Cancelled",
          description: "Your order has been cancelled",
        },
      })
    }

    revalidatePath(`/admin/orders/${validatedData.orderId}`)
    revalidatePath(`/account/orders/${validatedData.orderId}`)
    revalidatePath("/admin/orders")
    revalidatePath("/account/orders")

    return { success: true, message: "Order updated successfully" }
  } catch (error) {
    console.error("Error updating order:", error)

    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid update data", errors: error.errors }
    }

    return { success: false, message: "Failed to update order" }
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view order details" }
    }

    const userId = session.user.id
    const isAdminOrStaff = session.user.role === "ADMIN" || session.user.role === "STAFF"

    // Build the query
    const query: any = { id: orderId }

    // If not admin/staff, only allow viewing own orders
    if (!isAdminOrStaff) {
      query.userId = userId
    }

    const order = await prisma.order.findFirst({
      where: query,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
               imageUrls: true
              },
            },
          },
        },
        address: true,
        trackingEvents: {
          orderBy: {
            date: "desc",
          },
        },
        statusHistory: {
          orderBy: {
            timestamp: "desc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!order) {
      return { success: false, message: "Order not found" }
    }

    return { success: true, order }
  } catch (error) {
    console.error("Error fetching order:", error)
    return { success: false, message: "Failed to fetch order details" }
  }
}

// Get orders for the current user
export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view orders" }
    }

    const userId = session.user.id

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
               imageUrls: true
              },
            },
          },
        },
        trackingEvents: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, orders }
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return { success: false, message: "Failed to fetch orders" }
  }
}

// Cancel order (user)
export async function cancelOrder(orderId: string, reason: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to cancel an order" }
    }

    // Verify the order belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
    })

    if (!order) {
      return { success: false, message: "Order not found or does not belong to you" }
    }

    // Check if order can be cancelled
    if (order.status !== "PENDING" && order.status !== "PROCESSING") {
      return {
        success: false,
        message: "This order cannot be cancelled. Please contact customer support for assistance.",
      }
    }

    // Update order status
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.CANCELLED,
        statusHistory: {
          create: {
            status: OrderStatus.CANCELLED,
            notes: `Cancelled by customer. Reason: ${reason}`,
            updatedBy: session.user.id,
          },
        },
      },
    })

    // Add tracking event
    await prisma.trackingEvent.create({
      data: {
        orderId,
        status: "Cancelled",
        description: `Order cancelled by customer. Reason: ${reason}`,
      },
    })

    // Restore product stock
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId,
      },
    })

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      })
    }

    revalidatePath(`/account/orders/${orderId}`)
    revalidatePath("/account/orders")

    return { success: true, message: "Order cancelled successfully" }
  } catch (error) {
    console.error("Error cancelling order:", error)
    return { success: false, message: "Failed to cancel order" }
  }
}

// Add tracking event to an order (admin/staff only)
export async function addTrackingEvent(eventData: TrackingEventData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to add tracking events" }
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return { success: false, message: "You do not have permission to add tracking events" }
    }

    const validatedData = trackingEventSchema.parse(eventData)

    // Add the tracking event
    await prisma.trackingEvent.create({
      data: {
        orderId: validatedData.orderId,
        status: validatedData.status,
        description: validatedData.description,
        location: validatedData.location,
      },
    })

    revalidatePath(`/admin/orders/${validatedData.orderId}`)
    revalidatePath(`/account/orders/${validatedData.orderId}`)

    return { success: true, message: "Tracking event added successfully" }
  } catch (error) {
    console.error("Error adding tracking event:", error)

    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid event data", errors: error.errors }
    }

    return { success: false, message: "Failed to add tracking event" }
  }
}

// Get all orders with filtering (admin/staff only)
export async function getOrders(filters: OrderFilterData = {}) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view orders" }
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return { success: false, message: "You do not have permission to view all orders" }
    }

    const validatedFilters = orderFilterSchema.parse(filters)

    // Build the where clause based on filters
    const where: any = {}

    if (validatedFilters.status) {
      where.status = validatedFilters.status
    }

    if (validatedFilters.paymentStatus) {
      where.paymentStatus = validatedFilters.paymentStatus
    }

    if (validatedFilters.dateFrom || validatedFilters.dateTo) {
      where.createdAt = {}

      if (validatedFilters.dateFrom) {
        where.createdAt.gte = new Date(validatedFilters.dateFrom)
      }

      if (validatedFilters.dateTo) {
        where.createdAt.lte = new Date(validatedFilters.dateTo)
      }
    }

    if (validatedFilters.search) {
      where.OR = [
        { orderNumber: { contains: validatedFilters.search, mode: "insensitive" } },
        { user: { name: { contains: validatedFilters.search, mode: "insensitive" } } },
        { user: { email: { contains: validatedFilters.search, mode: "insensitive" } } },
      ]
    }

    // Pagination
    const page = validatedFilters.page || 1
    const limit = validatedFilters.limit || 10
    const skip = (page - 1) * limit

    // Get total count for pagination
    const totalCount = await prisma.order.count({ where })

    // Get orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    return {
      success: true,
      orders,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching orders:", error)

    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid filter data", errors: error.errors }
    }

    return { success: false, message: "Failed to fetch orders" }
  }
}

// Get order statistics (admin/staff only)
export async function getOrderStatistics() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view statistics" }
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return { success: false, message: "You do not have permission to view statistics" }
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

    // Get orders by payment status
    const ordersByPaymentStatus = await prisma.order.groupBy({
      by: ["paymentStatus"],
      _count: {
        paymentStatus: true,
      },
    })

    // Get total revenue
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: "PAID",
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
            email: true,
          },
        },
      },
    })

    return {
      success: true,
      statistics: {
        totalOrders,
        ordersByStatus,
        ordersByPaymentStatus,
        totalRevenue,
        recentOrders,
      },
    }
  } catch (error) {
    console.error("Error fetching order statistics:", error)
    return { success: false, message: "Failed to fetch order statistics" }
  }
}

export async function updateOrderStatus(updateData: OrderUpdateData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update order status",
      };
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return {
        success: false,
        message: "Only admins can update order status",
      };
    }

    const { orderId, status, paymentStatus, trackingNumber, notes } = updateData;

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as OrderStatus,
        paymentStatus: paymentStatus as PaymentStatus,
        trackingNumber,
        statusHistory: {
          create: {
            status: status || "STATUS_UPDATED",
            notes: notes || "Order status updated by admin",
            timestamp: new Date(),
          },
        },
      },
    });

    return {
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message: "Failed to update order status",
    };
  }
}

