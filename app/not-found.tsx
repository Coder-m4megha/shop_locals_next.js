import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link href="/products" className="text-primary hover:underline">
                Products
              </Link>
              <span>•</span>
              <Link href="/collections" className="text-primary hover:underline">
                Collections
              </Link>
              <span>•</span>
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
