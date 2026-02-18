import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
  currency: z.string().min(1, 'Currency is required'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
  shippingFee: z.number().min(0, 'Shipping fee must be non-negative'),
  freeShippingThreshold: z.number().min(0, 'Free shipping threshold must be non-negative'),
  enableReviews: z.boolean(),
  enableWishlist: z.boolean(),
  enableNotifications: z.boolean(),
  maintenanceMode: z.boolean(),
})

// Default settings
const defaultSettings = {
  siteName: 'Mohit Sarees',
  siteDescription: 'Premium collection of traditional and designer sarees',
  contactEmail: 'support@mohitsarees.com',
  contactPhone: '+91 99369 81786',
  address: 'Mumbai, Maharashtra, India',
  currency: 'INR',
  taxRate: 18,
  shippingFee: 100,
  freeShippingThreshold: 2000,
  enableReviews: true,
  enableWishlist: true,
  enableNotifications: true,
  maintenanceMode: false,
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

    // For now, return default settings
    // In a real app, you'd fetch from database
    return NextResponse.json({
      success: true,
      settings: defaultSettings,
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // For now, just validate and return success
    // In a real app, you'd save to database
    console.log('Settings updated:', validatedData)

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: validatedData,
    })

  } catch (error) {
    console.error('Error updating settings:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid settings data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
