"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Menu, Heart, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import SearchPanel from "@/components/search-panel"
import CartDrawer from "@/components/cart-drawer"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Sarees", href: "/products?category=sarees" },
    { name: "Blouses", href: "/products?category=blouses" },
    { name: "Collections", href: "/collections" },
    { name: "Style Guide", href: "/blog" },
    { name: "Store Locator", href: "/store-locator" },
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-1 sm:py-2">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="ml-2 md:ml-0">
              <img
                src="/mohit-saree-logo.png"
                alt="Mohit Saree Center"
                className="h-12 sm:h-13 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <nav className="space-x-4 lg:space-x-6 text-base lg:text-lg font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "hover:text-primary transition-colors",
                    pathname === item.href && "text-primary font-semibold",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="h-8 w-8 sm:h-10 sm:w-10">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            <Link href="/account">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <CartDrawer />
          </div>
        </div>
      </div>

      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}

