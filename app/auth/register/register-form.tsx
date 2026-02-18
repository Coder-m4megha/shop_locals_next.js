"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { registerUser, type RegisterFormData } from "@/lib/actions/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("type") === "admin" ? "admin" : "user"

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: true,
    role: "USER",
    adminKey: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent, type: "user" | "admin") => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await registerUser({
        ...formData,
        role: type === "admin" ? "ADMIN" : "USER",
      })

      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        })

        // Automatically sign in the user
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (signInResult?.ok) {
          // Redirect to account page for regular users, admin dashboard for admins
          const redirectPath = type === "admin" ? "/admin" : "/account"
          router.push(redirectPath)
        } else {
          // If auto sign-in fails, redirect to login
          router.push(`/auth/login?type=${type}`)
        }
      } else {
        toast({
          title: "Registration failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    setIsLoading(true)
    signIn("google", {
      callbackUrl: "/",
      redirect: true
    })
  }

  const handleFacebookRegister = () => {
    setIsLoading(true)
    signIn("facebook", {
      callbackUrl: "/",
      redirect: true
    })
  }

  const renderRegisterForm = (type: "user" | "admin") => (
    <form onSubmit={(e) => handleSubmit(e, type)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={type === "admin" ? "admin@example.com" : "your.email@example.com"}
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+91 99369 81786"
          value={formData.phone}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {type === "admin" && (
        <div className="space-y-2">
          <Label htmlFor="adminKey">Admin Registration Key</Label>
          <Input
            id="adminKey"
            name="adminKey"
            type="password"
            placeholder="Enter admin registration key"
            value={formData.adminKey}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => handleCheckboxChange("acceptTerms", checked as boolean)}
            disabled={isLoading}
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the{" "}
            <Link href="/terms" className="text-primary hover:text-primary/90">
              terms and conditions
            </Link>
          </label>
        </div>

        {type === "user" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) => handleCheckboxChange("newsletter", checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor="newsletter"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Subscribe to our newsletter
            </label>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          `Register as ${type === "admin" ? "Admin" : "User"}`
        )}
      </Button>
    </form>
  )

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join Mohit Saree Center</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User Registration</TabsTrigger>
              <TabsTrigger value="admin">Admin Registration</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              {renderRegisterForm("user")}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="w-full" onClick={handleGoogleRegister} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleFacebookRegister} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                      </svg>
                    )}
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="admin">
              {renderRegisterForm("admin")}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login?callbackUrl=%2Faccount" className="text-primary hover:text-primary/90">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

