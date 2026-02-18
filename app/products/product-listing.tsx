"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { WishlistButton } from "@/components/wishlist-button"

// Product interface
interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  images: string[]
  category: string
  tags: string[]
  stock: number
  sku: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

// Filter options
const filterOptions = {
  category: ["sarees", "blouses"],
  fabric: ["silk", "cotton", "georgette", "organza", "brocade"],
  color: ["red", "blue", "green", "gold", "peach", "cream", "teal"],
  occasion: ["wedding", "festive", "casual"],
  priceRange: ["0-5000", "5000-10000", "10000-20000", "20000+"],
}

// Sort options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
]

export default function ProductListing({
  category,
  color,
  fabric,
  occasion,
  priceRange,
  sort = "featured",
}: {
  category?: string
  color?: string
  fabric?: string
  occasion?: string
  priceRange?: string
  sort?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // State management
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [filters, setFilters] = useState({
    category: category ? [category] : [],
    color: color ? [color] : [],
    fabric: fabric ? [fabric] : [],
    occasion: occasion ? [occasion] : [],
    priceRange: priceRange ? [priceRange] : [],
  })

  const [sortBy, setSortBy] = useState(sort)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        const data = await response.json()

        if (data.success) {
          setAllProducts(data.products)
          setError(null)
        } else {
          setError('Failed to load products')
        }
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.category.length === 1) {
      params.set("category", filters.category[0])
    }

    if (filters.color.length === 1) {
      params.set("color", filters.color[0])
    }

    if (filters.fabric.length === 1) {
      params.set("fabric", filters.fabric[0])
    }

    if (filters.occasion.length === 1) {
      params.set("occasion", filters.occasion[0])
    }

    if (filters.priceRange.length === 1) {
      params.set("price", filters.priceRange[0])
    }

    if (sortBy !== "featured") {
      params.set("sort", sortBy)
    }

    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname

    router.push(url, { scroll: false })
  }, [filters, sortBy, pathname, router])

  // Filter products based on selected filters
  useEffect(() => {
    if (allProducts.length === 0) return

    let result = [...allProducts]

    // Apply category filter
    if (filters.category.length > 0) {
      result = result.filter((product) => filters.category.includes(product.category))
    }

    // Apply color filter
    if (filters.color.length > 0) {
      result = result.filter((product) =>
        product.tags.some(tag => filters.color.some(color => tag.toLowerCase().includes(color.toLowerCase())))
      )
    }

    // Apply fabric filter
    if (filters.fabric.length > 0) {
      result = result.filter((product) =>
        product.tags.some(tag => filters.fabric.some(fabric => tag.toLowerCase().includes(fabric.toLowerCase())))
      )
    }

    // Apply occasion filter
    if (filters.occasion.length > 0) {
      result = result.filter((product) =>
        product.tags.some(tag => filters.occasion.some(occasion => tag.toLowerCase().includes(occasion.toLowerCase())))
      )
    }

    // Apply price range filter
    if (filters.priceRange.length > 0) {
      result = result.filter((product) => {
        const price = product.salePrice || product.price
        return filters.priceRange.some((range) => {
          if (range === "0-5000") return price <= 5000
          if (range === "5000-10000") return price > 5000 && price <= 10000
          if (range === "10000-20000") return price > 10000 && price <= 20000
          if (range === "20000+") return price > 20000
          return true
        })
      })
    }

    // Apply sorting
    if (sortBy === "newest") {
      result = result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    } else if (sortBy === "price-low-high") {
      result = result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    } else if (sortBy === "price-high-low") {
      result = result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    }

    setFilteredProducts(result)
  }, [filters, sortBy, allProducts])

  // Toggle filter
  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }

      return { ...prev, [type]: current }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: [],
      color: [],
      fabric: [],
      occasion: [],
      priceRange: [],
    })
    setSortBy("featured")
  }



  // Get active filter count
  const activeFilterCount = Object.values(filters).reduce((count, filterValues) => count + filterValues.length, 0)

  // Get page title based on filters
  const getPageTitle = () => {
    if (filters.category.length === 1) {
      return filters.category[0].charAt(0).toUpperCase() + filters.category[0].slice(1)
    }
    return "All Products"
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif">{getPageTitle()}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1 sm:gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your product search with filters</SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Category</h3>
                  <div className="space-y-2">
                    {filterOptions.category.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${option}`}
                          checked={filters.category.includes(option)}
                          onCheckedChange={() => toggleFilter("category", option)}
                        />
                        <Label htmlFor={`category-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Fabric</h3>
                  <div className="space-y-2">
                    {filterOptions.fabric.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fabric-${option}`}
                          checked={filters.fabric.includes(option)}
                          onCheckedChange={() => toggleFilter("fabric", option)}
                        />
                        <Label htmlFor={`fabric-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Color</h3>
                  <div className="space-y-2">
                    {filterOptions.color.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${option}`}
                          checked={filters.color.includes(option)}
                          onCheckedChange={() => toggleFilter("color", option)}
                        />
                        <Label htmlFor={`color-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Occasion</h3>
                  <div className="space-y-2">
                    {filterOptions.occasion.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`occasion-${option}`}
                          checked={filters.occasion.includes(option)}
                          onCheckedChange={() => toggleFilter("occasion", option)}
                        />
                        <Label htmlFor={`occasion-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {filterOptions.priceRange.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`price-${option}`}
                          checked={filters.priceRange.includes(option)}
                          onCheckedChange={() => toggleFilter("priceRange", option)}
                        />
                        <Label htmlFor={`price-${option}`}>
                          {option === "0-5000" && "Under ₹5,000"}
                          {option === "5000-10000" && "₹5,000 - ₹10,000"}
                          {option === "10000-20000" && "₹10,000 - ₹20,000"}
                          {option === "20000+" && "Above ₹20,000"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(filters).map(([type, values]) =>
            values.map((value) => (
              <Badge key={`${type}-${value}`} variant="secondary" className="flex items-center gap-1">
                <span className="capitalize">{value}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter(type as keyof typeof filters, value)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )),
          )}
          {activeFilterCount > 1 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6">
              Clear All
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Error loading products</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${encodeURIComponent(product.name)}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    {product.salePrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                      </Badge>
                    )}
                    <WishlistButton
                      productId={product.id}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      size="sm"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-medium mb-2 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <p className="text-base sm:text-lg font-serif text-primary">₹{product.salePrice.toLocaleString()}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground line-through">₹{product.price.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="text-base sm:text-lg font-serif">₹{product.price.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

