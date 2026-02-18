"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { getCartItems, updateCartItemQuantity, removeFromCart } from "@/lib/actions/cart"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  imageUrls: string[]
  category: string
  tags: string
  stock: number
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  product: Product
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await getCartItems()
        if (result.success && result.cartItems) {
          // Transform the cart items to match our interface
          const transformedItems = result.cartItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            size: item.size || undefined,
            color: item.color || undefined,
            product: {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description,
              price: item.product.price,
              imageUrls: item.product.imageUrls ? JSON.parse(item.product.imageUrls) : [],
              category: item.product.category,
              tags: item.product.tags,
              stock: item.product.stock
            }
          }))
          setCartItems(transformedItems)
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to load cart items",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error)
        toast({
          title: "Error",
          description: "Failed to load your cart items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [toast])

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(id)
    try {
      const result = await updateCartItemQuantity(id, newQuantity)
      if (result.success) {
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(id)
    try {
      const result = await removeFromCart(id)
      if (result.success) {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 299
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your cart...</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-24 rounded-md overflow-hidden">
                        <Image
                          src={item.product.imageUrls[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Unit Price: ₹{item.product.price.toLocaleString()}
                            </p>
                            {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                            {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating === item.id || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating === item.id}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating === item.id}
                          >
                            {isUpdating === item.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Remove
                          </Button>
                          <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">We accept:</p>
              <div className="flex gap-2">
                <div className="bg-muted p-2 rounded">Credit Card</div>
                <div className="bg-muted p-2 rounded">Debit Card</div>
                <div className="bg-muted p-2 rounded">UPI</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}