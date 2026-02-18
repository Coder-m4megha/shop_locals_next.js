'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-destructive" />
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We encountered an error while loading this product. Please try again or browse our other products.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    </div>
  )
}
