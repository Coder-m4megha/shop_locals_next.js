import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Create unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    
    // Save file to public directory
    const uploadDir = join(process.cwd(), "public", "uploads", "profile-photos")
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Update user profile with new photo URL
    const photoUrl = `/uploads/profile-photos/${filename}`
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: photoUrl }
    })

    return NextResponse.json({ 
      success: true, 
      photoUrl 
    })
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    )
  }
} 