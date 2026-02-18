"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProductListing from "../components/ProductListing"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function ProductsPage() {
  // Use the useSearchParams hook to safely access search parameters on the client
  const searchParams = useSearchParams();

  // Extract search parameters safely
  const category = searchParams?.get('category') || undefined;
  const color = searchParams?.get('color') || undefined;
  const fabric = searchParams?.get('fabric') || undefined;
  const occasion = searchParams?.get('occasion') || undefined;
  const priceRange = searchParams?.get('price') || undefined;
  const sort = searchParams?.get('sort') || undefined;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="container mx-auto px-4 py-8">
        <ProductListing
          category={category}
          color={color}
          fabric={fabric}
          occasion={occasion}
          priceRange={priceRange}
          sort={sort}
        />
      </main>
    </Suspense>
  )
}