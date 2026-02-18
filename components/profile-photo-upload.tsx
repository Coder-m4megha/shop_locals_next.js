"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null
  onPhotoUpdate: (newPhotoUrl: string) => void
}

export default function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const { toast } = useToast()
  const { update: updateSession } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/user/upload-photo", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload photo")
      }

      onPhotoUpdate(data.photoUrl)
      await updateSession() // Update the session to reflect the new photo

      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="relative group">
      <div className="relative w-32 h-32 rounded-full overflow-hidden">
        {currentPhotoUrl ? (
          <Image
            src={currentPhotoUrl}
            alt="Profile photo"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            <span className="ml-2">Change Photo</span>
          </Button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
} 