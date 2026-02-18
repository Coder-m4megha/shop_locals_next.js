import { NextResponse } from 'next/server'
import { seedProducts } from '@/lib/seed-data'

export async function POST() {
  try {
    const result = await seedProducts()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in seed API:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to seed database' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to seed the database' 
  })
}
