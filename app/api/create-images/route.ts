import { NextResponse } from 'next/server'
import { createProductImages } from '@/lib/create-images'

export async function POST() {
  try {
    const result = createProductImages()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message,
        files: result.files
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in create-images API:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create images' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to create placeholder images' 
  })
}
