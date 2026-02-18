"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED"
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"
type DeliveryMethod = "HOME_DELIVERY" | "STORE_PICKUP"

interface Filters {
  status: OrderStatus | ""
  paymentStatus: PaymentStatus | ""
  deliveryMethod: DeliveryMethod | ""
  search: string
}

export default function OrderManagement() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<Filters>({
    status: (searchParams.get("status") as OrderStatus) || "",
    paymentStatus: (searchParams.get("paymentStatus") as PaymentStatus) || "",
    deliveryMethod: (searchParams.get("deliveryMethod") as DeliveryMethod) || "",
    search: searchParams.get("search") || "",
  })
  const [searchInput, setSearchInput] = useState(filters.search)

  // Update filters when search params change
  useEffect(() => {
    setFilters({
      status: (searchParams.get("status") as OrderStatus) || "",
      paymentStatus: (searchParams.get("paymentStatus") as PaymentStatus) || "",
      deliveryMethod: (searchParams.get("deliveryMethod") as DeliveryMethod) || "",
      search: searchParams.get("search") || "",
    })
    setSearchInput(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchInput })
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    updateFilters({ [key]: value } as Partial<Filters>)
  }

  const updateFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    // Update URL with new filters
    const params = new URLSearchParams()

    if (updatedFilters.status) params.set("status", updatedFilters.status)
    if (updatedFilters.paymentStatus) params.set("paymentStatus", updatedFilters.paymentStatus)
    if (updatedFilters.deliveryMethod) params.set("deliveryMethod", updatedFilters.deliveryMethod)
    if (updatedFilters.search) params.set("search", updatedFilters.search)

    // Reset to page 1 when filters change
    params.set("page", "1")

    router.push(`/admin/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      status: "",
      paymentStatus: "",
      deliveryMethod: "",
      search: "",
    })
    setSearchInput("")
    router.push("/admin/orders")
  }



  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search by order number or customer name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => handleFilterChange("paymentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Payment Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.deliveryMethod}
                onValueChange={(value) => handleFilterChange("deliveryMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Delivery Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Delivery Methods</SelectItem>
                  <SelectItem value="HOME_DELIVERY">Home Delivery</SelectItem>
                  <SelectItem value="STORE_PICKUP">Store Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(filters.status || filters.paymentStatus || filters.deliveryMethod || filters.search) && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  )
}