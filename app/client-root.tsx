"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/components/auth-provider"

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

