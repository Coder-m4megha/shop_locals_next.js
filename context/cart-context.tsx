"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartItems,
  clearCart as clearCartAction,
} from "@/lib/actions/cart"

interface Product {
  id: string
  name: string
  price: number
  imageUrls: string
  images?: string[]
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  product: Product
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  isLoading: boolean
  addItem: (item: { productId: string; quantity: number; size?: string; color?: string }) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to parse product images
  const parseCartItems = (cartItems: any[]): CartItem[] => {
    return cartItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        images: JSON.parse(item.product.imageUrls) as string[]
      }
    }))
  }

  // Load cart from server on initial render
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await getCartItems()
        if (result.success && result.cartItems) {
          setItems(parseCartItems(result.cartItems))
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 299
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  const addItem = async (newItem: { productId: string; quantity: number; size?: string; color?: string }) => {
    try {
      const result = await addToCart(newItem)
      if (result.success) {
        const cartResult = await getCartItems()
        if (cartResult.success && cartResult.cartItems) {
          setItems(parseCartItems(cartResult.cartItems))
        }
        toast({ title: "Added to cart", description: "Item has been added to your cart." })
      } else {
        toast({ title: "Error", description: result.message || "Failed to add item", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast({ title: "Error", description: "Failed to add item to cart. Please try again.", variant: "destructive" })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return

    try {
      const result = await updateCartItemQuantity(id, quantity)
      if (result.success) {
        setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)))
      } else {
        toast({ title: "Error", description: result.message || "Failed to update quantity", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast({ title: "Error", description: "Failed to update quantity. Please try again.", variant: "destructive" })
    }
  }

  const removeItem = async (id: string) => {
    try {
      const result = await removeFromCart(id)
      if (result.success) {
        setItems(prev => prev.filter(item => item.id !== id))
        toast({ title: "Item removed", description: "The item has been removed from your cart." })
      } else {
        toast({ title: "Error", description: result.message || "Failed to remove item", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast({ title: "Error", description: "Failed to remove item. Please try again.", variant: "destructive" })
    }
  }

  const clearCart = async () => {
    try {
      const result = await clearCartAction()
      if (result.success) {
        setItems([])
        toast({ title: "Cart cleared", description: "All items have been removed from your cart." })
      } else {
        toast({ title: "Error", description: result.message || "Failed to clear cart", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to clear cart:", error)
      toast({ title: "Error", description: "Failed to clear cart. Please try again.", variant: "destructive" })
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}