"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X, Plus, Minus, ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"

export default function CartDrawer() {
  const { items, itemCount, subtotal, shipping, tax, total, isLoading, updateQuantity, removeItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(id)
    try {
      await updateQuantity(id, newQuantity)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(id)
    try {
      await removeItem(id)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Shopping Cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images?.[0] || "/placeholder-simple.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                          {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                          {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                        >
                          {isUpdating === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating === item.id || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating === item.id}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Separator className="mb-4" />
              <div className="space-y-2">
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
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <SheetFooter className="mt-6 flex-col sm:flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/checkout">
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

