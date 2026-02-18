"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { removeFromWishlist } from "@/lib/actions/wishlist"

export function RemoveFromWishlistButton({ id }: { id: string }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRemove = async () => {
    if (isRemoving) return
    
    setIsRemoving(true)
    try {
      const result = await removeFromWishlist(id)
      
      if (result.success) {
        toast({
          title: "Item removed",
          description: "The item has been removed from your wishlist.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove item from wishlist.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      className="absolute top-2 right-2 h-8 w-8 rounded-full"
      onClick={handleRemove}
      disabled={isRemoving}
    >
      <X className="h-4 w-4" />
    </Button>
  )
}
