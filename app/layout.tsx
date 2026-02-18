import type { Metadata } from "next"
import React from "react"
import "./globals.css"
import ClientRoot from "./client-root"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Mohit Saree Center",
  description: "Discover exquisite sarees and blouses at Mohit Saree Center",
  generator: "v0.dev",
  icons: {
    icon: "/mohit_title_logo.png",
    shortcut: "/mohit_title_logo.png",
    apple: "/mohit_title_logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  )
}
