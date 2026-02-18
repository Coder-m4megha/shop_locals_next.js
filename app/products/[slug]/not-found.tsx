import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
      <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
