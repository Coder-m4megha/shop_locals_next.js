import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || "a-default-secret-for-development-only",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            },
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                role: "USER",
              }
            }
          })
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                image: profile.picture?.data?.url,
                role: "USER",
              }
            }
          })
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] Missing email or password")
          }
          return null
        }

        const email = String(credentials.email).trim()
        const password = String(credentials.password)

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] No user found for email:", email)
          }
          return null
        }

        if (!user.password) {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] User has no password set (maybe OAuth-only):", email)
          }
          return null
        }

        let isPasswordValid = false
        try {
          isPasswordValid = await compare(password, user.password)
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] Password compare error (invalid hash?):", err)
          }
          return null
        }

        if (!isPasswordValid) {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] Invalid password for:", email)
          }
          return null
        }

        // Check if trying to login as admin
        if (credentials.role === "ADMIN" && user.role !== "ADMIN") {
          if (process.env.NODE_ENV === "development") {
            console.error("[auth] User is not ADMIN:", email)
          }
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
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
          role: token.role || "USER"
        }
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {},
          create: {
            email: user.email!,
            name: user.name!,
            image: user.image,
            role: "USER",
          },
        })
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
}