"use server"

import { hash } from "bcrypt"
import { z } from "zod"
import prisma from "@/lib/prisma"

// Schema for registration validation
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    newsletter: z.boolean().optional(),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    adminKey: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // If registering as admin, require admin key
      if (data.role === "ADMIN") {
        return data.adminKey === process.env.ADMIN_REGISTRATION_KEY
      }
      return true
    },
    {
      message: "Invalid admin registration key",
      path: ["adminKey"],
    }
  )

export type RegisterFormData = z.infer<typeof registerSchema>

export async function registerUser(formData: RegisterFormData) {
  try {
    // Validate form data
    const validatedData = registerSchema.parse(formData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        phone: validatedData.phone,
        role: validatedData.role,
        notificationPreferences: {
          create: {
            orderUpdates: true,
            promotions: validatedData.newsletter || false,
            newArrivals: validatedData.newsletter || false,
            blogPosts: validatedData.newsletter || false,
          },
        },
      },
    })

    return {
      success: true,
      message: "Registration successful",
      isAdmin: validatedData.role === "ADMIN",
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
      message: "An error occurred during registration",
    }
  }
}

// Function to check if a user is an admin
export async function isAdmin(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    return user?.role === "ADMIN"
  } catch (error) {
    return false
  }
}

