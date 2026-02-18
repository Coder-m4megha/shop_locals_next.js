"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { hash, compare } from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// Schema for profile update validation
const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
})

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// Schema for password update validation
const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>

// Schema for address validation
const addressSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Address type is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  isDefault: z.boolean().optional(),
})

export type AddressData = z.infer<typeof addressSchema>

// Schema for payment method validation
const paymentMethodSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Payment method type is required"),
  name: z.string().min(1, "Name is required"),
  number: z.string().min(1, "Card/UPI number is required"),
  expiry: z.string().optional(),
  isDefault: z.boolean().optional(),
})

export type PaymentMethodData = z.infer<typeof paymentMethodSchema>

// Schema for notification preferences update
const notificationPreferencesSchema = z.object({
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  newArrivals: z.boolean(),
  blogPosts: z.boolean(),
})

export type NotificationPreferencesData = z.infer<typeof notificationPreferencesSchema>

// Get current user profile
export async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        addresses: true,
        paymentMethods: true,
        notificationPreferences: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        wishlist: {
          include: {
            product: true,
          },
        },
        cart: {
          include: {
            product: true,
          },
        },
      },
    })

    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// Get user by ID (admin/staff only)
export async function getUserById(userId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view user details" }
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return { success: false, message: "You do not have permission to view user details" }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
        paymentMethods: true,
        notificationPreferences: true,
        orders: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    return { success: true, user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, message: "Failed to fetch user details" }
  }
}

// Update user profile
export async function updateUserProfile(formData: ProfileUpdateData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update your profile",
      }
    }

    // Validate form data
    const validatedData = profileUpdateSchema.parse(formData)

    // Update the user
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: validatedData.name,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
      },
    })

    revalidatePath("/account")

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "An error occurred while updating your profile",
    }
  }
}

// Update user password
export async function updateUserPassword(formData: PasswordUpdateData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update your password",
      }
    }

    // Validate form data
    const validatedData = passwordUpdateSchema.parse(formData)

    // Get the user with password
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        password: true,
      },
    })

    if (!user || !user.password) {
      return {
        success: false,
        message: "User not found or password not set",
      }
    }

    // Verify current password
    const isPasswordValid = await compare(validatedData.currentPassword, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      }
    }

    // Hash the new password
    const hashedPassword = await hash(validatedData.newPassword, 10)

    // Update the password
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: "Password updated successfully",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "An error occurred while updating your password",
    }
  }
}

// Add or update address
export async function saveAddress(formData: AddressData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to save an address",
      }
    }

    // Validate form data
    const validatedData = addressSchema.parse(formData)

    // If setting as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    // If updating existing address
    if (validatedData.id) {
      // Verify the address belongs to the user
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: validatedData.id,
          userId: session.user.id,
        },
      })

      if (!existingAddress) {
        return {
          success: false,
          message: "Address not found or does not belong to you",
        }
      }

      // Update the address
      await prisma.address.update({
        where: {
          id: validatedData.id,
        },
        data: {
          type: validatedData.type,
          name: validatedData.name,
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          pincode: validatedData.pincode,
          phone: validatedData.phone,
          isDefault: validatedData.isDefault || false,
        },
      })

      revalidatePath("/account")

      return {
        success: true,
        message: "Address updated successfully",
      }
    } else {
      // Create new address
      await prisma.address.create({
        data: {
          userId: session.user.id,
          type: validatedData.type,
          name: validatedData.name,
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          pincode: validatedData.pincode,
          phone: validatedData.phone,
          isDefault: validatedData.isDefault || false,
        },
      })

      revalidatePath("/account")

      return {
        success: true,
        message: "Address added successfully",
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "An error occurred while saving your address",
    }
  }
}

// Delete address
export async function deleteAddress(addressId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete an address",
      }
    }

    // Verify the address belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return {
        success: false,
        message: "Address not found or does not belong to you",
      }
    }

    // Check if address is used in any orders
    const ordersUsingAddress = await prisma.order.count({
      where: {
        addressId,
      },
    })

    if (ordersUsingAddress > 0) {
      return {
        success: false,
        message: "This address is used in orders and cannot be deleted",
      }
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    })

    revalidatePath("/account")

    return {
      success: true,
      message: "Address deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting address:", error)
    return {
      success: false,
      message: "An error occurred while deleting your address",
    }
  }
}

// Add or update payment method
export async function savePaymentMethod(formData: PaymentMethodData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to save a payment method",
      }
    }

    // Validate form data
    const validatedData = paymentMethodSchema.parse(formData)

    // If setting as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    // If updating existing payment method
    if (validatedData.id) {
      // Verify the payment method belongs to the user
      const existingPaymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          id: validatedData.id,
          userId: session.user.id,
        },
      })

      if (!existingPaymentMethod) {
        return {
          success: false,
          message: "Payment method not found or does not belong to you",
        }
      }

      // Update the payment method
      await prisma.paymentMethod.update({
        where: {
          id: validatedData.id,
        },
        data: {
          type: validatedData.type,
          name: validatedData.name,
          number: validatedData.number,
          expiry: validatedData.expiry,
          isDefault: validatedData.isDefault || false,
        },
      })

      revalidatePath("/account")

      return {
        success: true,
        message: "Payment method updated successfully",
      }
    } else {
      // Create new payment method
      await prisma.paymentMethod.create({
        data: {
          userId: session.user.id,
          type: validatedData.type,
          name: validatedData.name,
          number: validatedData.number,
          expiry: validatedData.expiry,
          isDefault: validatedData.isDefault || false,
        },
      })

      revalidatePath("/account")

      return {
        success: true,
        message: "Payment method added successfully",
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "An error occurred while saving your payment method",
    }
  }
}

// Delete payment method
export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete a payment method",
      }
    }

    // Verify the payment method belongs to the user
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: session.user.id,
      },
    })

    if (!existingPaymentMethod) {
      return {
        success: false,
        message: "Payment method not found or does not belong to you",
      }
    }

    // Delete the payment method
    await prisma.paymentMethod.delete({
      where: {
        id: paymentMethodId,
      },
    })

    revalidatePath("/account")

    return {
      success: true,
      message: "Payment method deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return {
      success: false,
      message: "An error occurred while deleting your payment method",
    }
  }
}

// Update notification preferences
export async function updateNotificationPreferences(formData: NotificationPreferencesData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update your notification preferences",
      }
    }

    // Validate form data
    const validatedData = notificationPreferencesSchema.parse(formData)

    // Update the notification preferences
    await prisma.notificationPreferences.upsert({
      where: {
        userId: session.user.id,
      },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
    })

    revalidatePath("/account")

    return {
      success: true,
      message: "Notification preferences updated successfully",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "An error occurred while updating your notification preferences",
    }
  }
}

// Delete user account
export async function deleteUserAccount(password: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete your account",
      }
    }

    // Get the user with password
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        password: true,
      },
    })

    if (!user || !user.password) {
      return {
        success: false,
        message: "User not found or password not set",
      }
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Password is incorrect",
      }
    }

    // Check if user has active orders
    const activeOrders = await prisma.order.count({
      where: {
        userId: session.user.id,
        status: {
          in: ["PENDING", "PROCESSING", "SHIPPED"],
        },
      },
    })

    if (activeOrders > 0) {
      return {
        success: false,
        message:
          "You have active orders. Please wait until they are completed or cancel them before deleting your account.",
      }
    }

    // Instead of deleting, mark as inactive and anonymize
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isActive: false,
        email: `deleted-${Date.now()}@example.com`, // Anonymize email
        name: "Deleted User",
        firstName: null,
        lastName: null,
        phone: null,
        password: null, // Remove password
      },
    })

    return {
      success: true,
      message: "Your account has been deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting user account:", error)
    return {
      success: false,
      message: "An error occurred while deleting your account",
    }
  }
}

// Get all users (admin/staff only)
export async function getAllUsers(page = 1, limit = 10, search = "") {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to view users" }
    }

    // Check if user is admin or staff
    if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
      return { success: false, message: "You do not have permission to view users" }
    }

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const totalCount = await prisma.user.count({ where })

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      success: true,
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, message: "Failed to fetch users" }
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: "ADMIN" | "STAFF" | "CUSTOMER") {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update user roles" }
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return { success: false, message: "You do not have permission to update user roles" }
    }

    // Verify the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userExists) {
      return { success: false, message: "User not found" }
    }

    // Update the user role
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath("/admin/users")

    return { success: true, message: "User role updated successfully" }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, message: "Failed to update user role" }
  }
}

// Toggle user active status (admin only)
export async function toggleUserActiveStatus(userId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update user status" }
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return { success: false, message: "You do not have permission to update user status" }
    }

    // Get current user status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Toggle status
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    })

    revalidatePath("/admin/users")

    return {
      success: true,
      message: `User ${user.isActive ? "deactivated" : "activated"} successfully`,
    }
  } catch (error) {
    console.error("Error toggling user status:", error)
    return { success: false, message: "Failed to update user status" }
  }
}

