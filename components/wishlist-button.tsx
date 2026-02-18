'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

export function WishlistButton({ 
  productId, 
  className, 
  size = 'md',
  variant = 'ghost'
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist()
  const inWishlist = isInWishlist(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inWishlist) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        sizeClasses[size],
        'rounded-full transition-colors',
        inWishlist && 'text-red-500 hover:text-red-600',
        className
      )}
      onClick={handleClick}
      disabled={loading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-all',
          inWishlist && 'fill-current'
        )} 
      />
    </Button>
  )
}
