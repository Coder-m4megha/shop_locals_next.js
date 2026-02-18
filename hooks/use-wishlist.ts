'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface WishlistItem {
  id: string
  productId: string
  userId: string
  createdAt: string
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist()
    } else {
      setWishlistItems([])
    }
  }, [session?.user?.id])

  const fetchWishlist = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/wishlist')
      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId)
  }

  const addToWishlist = async (productId: string) => {
    if (!session?.user?.id) {
      toast.error('Please sign in to add items to wishlist')
      return
    }

    if (isInWishlist(productId)) {
      toast.info('Item is already in your wishlist')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (data.success) {
        setWishlistItems(prev => [...prev, data.item])
        toast.success('Added to wishlist')
      } else {
        toast.error(data.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId))
        toast.success('Removed from wishlist')
      } else {
        toast.error(data.error || 'Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    } finally {
      setLoading(false)
    }
  }

  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    loading,
  }
}
