import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductDetails from './product-details'
import { getProductBySlug } from '@/lib/actions/product'

// Define the generateMetadata function to set dynamic metadata
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  // Await params to avoid the "params should be awaited" error
  const { slug } = await params

  // Get the product
  const result = await getProductBySlug(slug)
  const product = result.success ? result.product : null

  // If product not found, return default metadata
  if (!product) {
    return {
      title: 'Product Not Found | Mohit Saree Center',
      description: 'The requested product could not be found.',
    }
  }

  // Return product-specific metadata
  return {
    title: `${product.name} | Mohit Saree Center`,
    description: product.description || `Buy ${product.name} at Mohit Saree Center`,
    openGraph: {
      images: [
        {
          url: getFirstImageUrl(product.imageUrls),
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  }
}

// Helper function to get the first image URL from the JSON string
function getFirstImageUrl(imageUrlsJson: string): string {
  try {
    const urls = JSON.parse(imageUrlsJson)
    return Array.isArray(urls) && urls.length > 0
      ? urls[0]
      : '/placeholder.svg'
  } catch (error) {
    return '/placeholder.svg'
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params to avoid the "params should be awaited" error
  const { slug } = await params

  // Get the product using the imported function
  const result = await getProductBySlug(slug)

  // If product not found, show 404 page
  if (!result.success || !result.product) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={result.product} />
    </main>
  )
}
