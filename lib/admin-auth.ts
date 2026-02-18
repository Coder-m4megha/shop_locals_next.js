import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const adminAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "a-default-secret-for-development-only",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login?type=admin",
    signOut: "/auth/login?type=admin",
    error: "/auth/login?type=admin",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password || user.role !== "ADMIN") {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: "ADMIN",
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || token.id || '',
          name: token.name || session.user?.name,
          email: token.email || session.user?.email,
          image: token.picture || session.user?.image,
          role: "ADMIN"
        }
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = "ADMIN"
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  debug: process.env.NODE_ENV === "development",
} 