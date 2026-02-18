"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
