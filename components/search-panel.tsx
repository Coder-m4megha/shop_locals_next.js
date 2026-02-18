"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

// Sample product data for search results
const allProducts = [
  {
    id: 1,
    name: "Banarasi Silk Saree",
    price: 24999,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    category: "sarees",
  },
  {
    id: 2,
    name: "Gold Brocade Designer Blouse",
    price: 12999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    category: "blouses",
  },
  {
    id: 3,
    name: "Royal Blue Embroidered Blouse",
    price: 15999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
    category: "blouses",
  },
  {
    id: 4,
    name: "Teal Embroidered Blouse",
    price: 15999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    category: "blouses",
  },
  {
    id: 7,
    name: "Kanjeevaram Silk Saree",
    price: 34999,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    category: "sarees",
  },
  {
    id: 8,
    name: "Chanderi Cotton Saree",
    price: 9999,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    category: "sarees",
  },
]

interface SearchPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof allProducts>([])
  const [isSearching, setIsSearching] = useState(false)
  const [popularSearches] = useState(["Silk Saree", "Designer Blouse", "Wedding Collection", "Festive Wear"])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true)

      // Simulate API call with setTimeout
      const timeoutId = setTimeout(() => {
        const results = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [debouncedSearchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
    }
  }

  const handlePopularSearch = (term: string) => {
    router.push(`/products?search=${encodeURIComponent(term)}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif mb-6 text-center">Search Products</h2>

          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search for products, categories, or styles..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </form>

          {isSearching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : searchQuery ? (
            <div>
              {searchResults.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Search Results ({searchResults.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {searchResults.map((product) => (
                      <Link key={product.id} href={`/products/${product.id}`} onClick={onClose} className="group">
                        <div className="flex gap-4 p-3 rounded-lg border group-hover:border-primary transition-colors">
                          <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium group-hover:text-primary transition-colors">{product.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                            <p className="text-sm font-medium mt-1">₹{product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button onClick={handleSearch}>View All Results</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">We couldn't find any products matching "{searchQuery}"</p>
                  <div className="max-w-md mx-auto">
                    <h4 className="text-sm font-medium mb-2">Popular Searches</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.map((term) => (
                        <Button key={term} variant="outline" size="sm" onClick={() => handlePopularSearch(term)}>
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Button key={term} variant="outline" size="sm" onClick={() => handlePopularSearch(term)}>
                    {term}
                  </Button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/products?category=sarees" onClick={onClose} className="group">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg"
                        alt="Sarees"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h4 className="text-white text-xl font-serif">Sarees</h4>
                      </div>
                    </div>
                  </Link>
                  <Link href="/products?category=blouses" onClick={onClose} className="group">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp"
                        alt="Blouses"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h4 className="text-white text-xl font-serif">Blouses</h4>
                      </div>
                    </div>
                  </Link>
                  <Link href="/collections/1" onClick={onClose} className="group">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg"
                        alt="Bridal Collection"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h4 className="text-white text-xl font-serif">Bridal</h4>
                      </div>
                    </div>
                  </Link>
                  <Link href="/collections/3" onClick={onClose} className="group">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp"
                        alt="Festive Collection"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h4 className="text-white text-xl font-serif">Festive</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

