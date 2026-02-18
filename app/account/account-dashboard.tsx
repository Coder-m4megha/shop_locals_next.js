"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Heart, MapPin, CreditCard, LogOut, Settings, ShoppingBag, Clock, X, Loader2 } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { getUserProfile, updateUserProfile, updateNotificationPreferences } from "@/lib/actions/user"
import ProfilePhotoUpload from "@/components/profile-photo-upload"

export default function AccountDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [addressFormData, setAddressFormData] = useState({
    type: "HOME",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  })
  const [paymentFormData, setPaymentFormData] = useState({
    type: "CARD",
    name: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    isDefault: false,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      // Wait for session to finish loading
      if (status === "loading") {
        return
      }

      if (status === "authenticated") {
        try {
          const userData = await getUserProfile()
          if (userData) {
            console.log("User data loaded:", userData) // Debug log
            setUser(userData)
            // Split the name into first and last name if it exists
            const nameParts = userData.name ? userData.name.split(' ') : ['', '']
            setFormData({
              name: userData.name || "",
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(' ') || "",
              email: userData.email || "",
              phone: userData.phone || "",
            })
          } else {
            console.error("No user data returned")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          toast({
            title: "Error",
            description: "Failed to load your account information",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false)
        router.push("/auth/login")
      }
    }

    fetchUserData()
  }, [status, router, toast, session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setPaymentFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const saveProfile = async () => {
    try {
      setIsLoading(true)
      // Combine first and last name for the name field
      const profileData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      }
      const result = await updateUserProfile(profileData)

      if (result.success) {
        setUser((prev: any) => ({ ...prev, ...profileData }))
        setEditMode(false)
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        })
      } else {
        toast({
          title: "Update failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      // Import the removeFromWishlist function
      const { removeFromWishlist: removeWishlistItem } = await import("@/lib/actions/wishlist")
      const result = await removeWishlistItem(wishlistItemId)

      if (result.success) {
        // Update the user state to remove the item
        setUser((prev: any) => ({
          ...prev,
          wishlist: prev.wishlist?.filter((item: any) => item.id !== wishlistItemId) || []
        }))
        toast({
          title: "Item removed",
          description: "Item has been removed from your wishlist.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      })
    }
  }

  const handleAddNewAddress = () => {
    setEditingAddress(null)
    setAddressFormData({
      type: "HOME",
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      isDefault: false,
    })
    setShowAddressForm(true)
  }

  const handleEditAddress = (address: any) => {
    setEditingAddress(address)
    setAddressFormData({
      type: address.type || "HOME",
      name: address.name || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      phone: address.phone || "",
      isDefault: address.isDefault || false,
    })
    setShowAddressForm(true)
  }

  const saveAddress = async () => {
    try {
      setIsLoading(true)
      // Import the saveAddress function
      const { saveAddress: saveAddressAction } = await import("@/lib/actions/user")

      const addressData = {
        ...addressFormData,
        id: editingAddress?.id,
      }

      const result = await saveAddressAction(addressData)

      if (result.success) {
        // Refresh user data
        const userData = await getUserProfile()
        if (userData) {
          setUser(userData)
        }

        setShowAddressForm(false)
        setEditingAddress(null)
        toast({
          title: editingAddress ? "Address updated" : "Address added",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAddress = async (addressId: string) => {
    try {
      // Import the deleteAddress function
      const { deleteAddress: deleteAddressAction } = await import("@/lib/actions/user")
      const result = await deleteAddressAction(addressId)

      if (result.success) {
        // Update the user state to remove the address
        setUser((prev: any) => ({
          ...prev,
          addresses: prev.addresses?.filter((addr: any) => addr.id !== addressId) || []
        }))
        toast({
          title: "Address deleted",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "destructive",
      })
    }
  }

  const handleAddNewPayment = () => {
    setEditingPayment(null)
    setPaymentFormData({
      type: "CARD",
      name: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      isDefault: false,
    })
    setShowPaymentForm(true)
  }

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment)
    setPaymentFormData({
      type: payment.type || "CARD",
      name: payment.name || "",
      cardNumber: payment.number || "",
      expiryMonth: payment.expiry?.split('/')[0] || "",
      expiryYear: payment.expiry?.split('/')[1] || "",
      cvv: "",
      isDefault: payment.isDefault || false,
    })
    setShowPaymentForm(true)
  }

  const savePayment = async () => {
    try {
      setIsLoading(true)
      // Import the savePayment function
      const { savePaymentMethod: savePaymentAction } = await import("@/lib/actions/user")

      const paymentData = {
        type: paymentFormData.type,
        name: paymentFormData.name,
        number: paymentFormData.cardNumber,
        expiry: `${paymentFormData.expiryMonth}/${paymentFormData.expiryYear}`,
        isDefault: paymentFormData.isDefault,
        id: editingPayment?.id,
      }

      const result = await savePaymentAction(paymentData)

      if (result.success) {
        // Refresh user data
        const userData = await getUserProfile()
        if (userData) {
          setUser(userData)
        }

        setShowPaymentForm(false)
        setEditingPayment(null)
        toast({
          title: editingPayment ? "Payment method updated" : "Payment method added",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment method.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deletePayment = async (paymentId: string) => {
    try {
      // Import the deletePayment function
      const { deletePaymentMethod: deletePaymentAction } = await import("@/lib/actions/user")
      const result = await deletePaymentAction(paymentId)

      if (result.success) {
        // Update the user state to remove the payment method
        setUser((prev: any) => ({
          ...prev,
          paymentMethods: prev.paymentMethods?.filter((method: any) => method.id !== paymentId) || []
        }))
        toast({
          title: "Payment method deleted",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment method.",
        variant: "destructive",
      })
    }
  }

  const toggleNotification = async (key: string) => {
    if (!user?.notificationPreferences) return

    try {
      const updatedPreferences = {
        ...user.notificationPreferences,
        [key]: !user.notificationPreferences[key],
      }

      // Remove id and userId fields
      const { id, userId, ...preferencesData } = updatedPreferences

      const result = await updateNotificationPreferences(preferencesData)

      if (result.success) {
        setUser((prev: any) => ({
          ...prev,
          notificationPreferences: {
            ...prev.notificationPreferences,
            [key]: !prev.notificationPreferences[key],
          },
        }))

        toast({
          title: "Notification preferences updated",
          description: `You have ${user.notificationPreferences[key] ? "unsubscribed from" : "subscribed to"} ${key.replace(/([A-Z])/g, " $1").toLowerCase()} notifications.`,
        })
      } else {
        toast({
          title: "Update failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const setDefaultAddress = (id: number) => {
    // This would be implemented with a server action to update in database
    setUser((prev: any) => ({
      ...prev,
      addresses: prev.addresses.map((address: any) => ({
        ...address,
        isDefault: address.id === id,
      })),
    }))

    toast({
      title: "Default address updated",
      description: "Your default address has been updated successfully.",
    })
  }

  const setDefaultPayment = (id: number) => {
    // This would be implemented with a server action to update in database
    setUser((prev: any) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method: any) => ({
        ...method,
        isDefault: method.id === id,
      })),
    }))

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    })
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    })
    router.push("/auth/login")
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your account information...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Account Not Found</h2>
        <p className="mb-6">We couldn't find your account information. Please try logging in again.</p>
        <Button asChild>
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">My Account</h1>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 overflow-x-auto">
          <TabsTrigger
            value="dashboard"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Wishlist
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Addresses
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Payment Methods
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.image || "/placeholder-simple.svg"} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                        <ProfilePhotoUpload
                          currentPhotoUrl={user?.image}
                          onPhotoUpdate={(newPhotoUrl) => {
                            setUser((prev: any) => ({ ...prev, image: newPhotoUrl }))
                          }}
                        />
                      </div>
                    </div>
                    {!editMode && (
                      <Button variant="outline" size="sm" onClick={() => document.getElementById('photo-upload')?.click()}>
                        Change Photo
                      </Button>
                    )}
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const formData = new FormData()
                          formData.append("file", file)
                          fetch("/api/user/upload-photo", {
                            method: "POST",
                            body: formData,
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.success) {
                                setUser((prev: any) => ({ ...prev, image: data.photoUrl }))
                                toast({
                                  title: "Photo updated",
                                  description: "Your profile photo has been updated successfully.",
                                })
                              } else {
                                throw new Error(data.error || "Failed to upload photo")
                              }
                            })
                            .catch((error) => {
                              toast({
                                title: "Upload failed",
                                description: error.message || "Failed to upload photo",
                                variant: "destructive",
                              })
                            })
                        }
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    {editMode ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setEditMode(false)} disabled={isLoading}>
                            Cancel
                          </Button>
                          <Button onClick={saveProfile} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{user.name || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{user.phone || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" onClick={() => setEditMode(true)}>
                            Edit Profile
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Quick overview of your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user?.orders?.length || 0} Orders</p>
                    <p className="text-sm text-muted-foreground">View your order history</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user?.wishlist?.length || 0} Wishlist Items</p>
                    <p className="text-sm text-muted-foreground">Products you've saved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.addresses?.length || 0} Saved Addresses</p>
                    <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.paymentMethods?.length || 0} Payment Methods</p>
                    <p className="text-sm text-muted-foreground">Your saved payment options</p>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Track your recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {user?.orders && user.orders.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.slice(0, 2).map((order: any) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">#{order.orderNumber || order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge variant={order.status === "DELIVERED" ? "outline" : "default"}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.total?.toLocaleString() || '0'}</p>
                          <Button variant="link" size="sm" className="h-8 px-0" asChild>
                            <Link href={`/account/orders/${order.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No orders yet</p>
                )}
                {user.orders?.length > 2 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/account?tab=orders">View All Orders</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Products you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {user?.wishlist && user.wishlist.length > 0 ? (
                  <div className="space-y-4">
                    {user.wishlist.slice(0, 2).map((item: any) => {
                      // Safety check for item data
                      if (!item || !item.product) {
                        return null
                      }
                      return (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product?.imageUrls ? JSON.parse(item.product.imageUrls)[0] : "/placeholder-simple.svg"}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.product?.name || "Product"}</p>
                          <p className="text-sm">₹{item.product?.price?.toLocaleString() || '0'}</p>
                          <Button variant="link" size="sm" className="h-8 px-0" asChild>
                            <Link href={`/products/${item.product?.id || item.id}`}>View Product</Link>
                          </Button>
                        </div>
                      </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">Your wishlist is empty</p>
                )}
                {user.wishlist?.length > 2 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/account?tab=wishlist">View All Wishlist Items</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.orders && user.orders.length > 0 ? (
                <div className="space-y-6">
                  {user.orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/30 p-4 flex flex-col sm:flex-row justify-between">
                        <div>
                          <p className="font-medium">Order #{order.orderNumber || order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          <Badge variant={order.status === "DELIVERED" ? "outline" : "default"}>
                            {order.status}
                          </Badge>
                          <p className="font-medium">₹{order.total?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.product?.imageUrls ? JSON.parse(item.product.imageUrls)[0] : "/placeholder-simple.svg"}
                                  alt={item.product?.name || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.product?.name || "Product"}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity || 1}</p>
                                <p className="text-sm">₹{item.price?.toLocaleString() || '0'}</p>
                              </div>
                            </div>
                          )) || []}
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>
                              <Package className="h-4 w-4 mr-2" />
                              Track Order
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Clock className="h-4 w-4 mr-2" />
                            Order Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.wishlist && user.wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.wishlist.map((item: any) => {
                    // Safety check for item data
                    if (!item || !item.product) {
                      return null
                    }
                    return (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={item.product?.imageUrls ? JSON.parse(item.product.imageUrls)[0] : "/placeholder.svg"}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-2">{item.product?.name || "Product"}</h3>
                          <p className="text-lg font-serif mb-4">
                            ₹{item.product?.price?.toLocaleString() || '0'}
                          </p>
                          <div className="flex gap-2">
                            <Button className="w-full" asChild>
                              <Link href={`/products/${item.product?.id || item.id}`}>View Product</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Save items you love to your wishlist and find them here for easy access.
                  </p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </div>
              <Button onClick={handleAddNewAddress}>Add New Address</Button>
            </CardHeader>
            <CardContent>
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses.map((address: any) => (
                    <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <Badge variant="outline" className="mt-1">
                              {address.type}
                            </Badge>
                            {address.isDefault && <Badge className="ml-2 mt-1">Default</Badge>}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteAddress(address.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="mt-2">Phone: {address.phone}</p>
                        </div>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => setDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your delivery addresses for a faster checkout experience.
                  </p>
                  <Button onClick={handleAddNewAddress}>Add New Address</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment options</CardDescription>
              </div>
              <Button onClick={handleAddNewPayment}>Add Payment Method</Button>
            </CardHeader>
            <CardContent>
              {user.paymentMethods?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.paymentMethods.map((method: any) => (
                    <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">{method.type}</p>
                            <p className="text-sm text-muted-foreground">{method.name}</p>
                            {method.isDefault && <Badge className="mt-1">Default</Badge>}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditPayment(method)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deletePayment(method.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>{method.number}</p>
                          {method.expiry && <p>Expires: {method.expiry}</p>}
                        </div>
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => setDefaultPayment(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your payment methods for a faster checkout experience.
                  </p>
                  <Button onClick={handleAddNewPayment}>Add Payment Method</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates from us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about your order status</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={user.notificationPreferences?.orderUpdates}
                    onCheckedChange={() => toggleNotification("orderUpdates")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about sales, discounts, and special offers
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={user.notificationPreferences?.promotions}
                    onCheckedChange={() => toggleNotification("promotions")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newArrivals">New Arrivals</Label>
                    <p className="text-sm text-muted-foreground">Stay updated on new products and collections</p>
                  </div>
                  <Switch
                    id="newArrivals"
                    checked={user.notificationPreferences?.newArrivals}
                    onCheckedChange={() => toggleNotification("newArrivals")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="blogPosts">Blog & Style Guides</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates when new articles and style guides are published
                    </p>
                  </div>
                  <Switch
                    id="blogPosts"
                    checked={user.notificationPreferences?.blogPosts}
                    onCheckedChange={() => toggleNotification("blogPosts")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Address Form Dialog */}
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent className="sm:max-w-[750px] lg:max-w-[900px] xl:max-w-[1000px] max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingAddress
                ? "Update your address information below."
                : "Add a new delivery address to your account."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Address Type */}
            <div className="space-y-2">
              <Label htmlFor="addressType" className="text-sm font-medium">
                Address Type *
              </Label>
              <Select
                name="type"
                value={addressFormData.type}
                onValueChange={(value) =>
                  setAddressFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">🏠 Home</SelectItem>
                  <SelectItem value="OFFICE">🏢 Office</SelectItem>
                  <SelectItem value="OTHER">📍 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="addressName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="addressName"
                name="name"
                value={addressFormData.name}
                onChange={handleAddressInputChange}
                className="w-full"
                placeholder="Enter full name"
              />
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="addressAddress" className="text-sm font-medium">
                Street Address *
              </Label>
              <Input
                id="addressAddress"
                name="address"
                value={addressFormData.address}
                onChange={handleAddressInputChange}
                className="w-full"
                placeholder="House/Flat no., Building name, Street name"
              />
            </div>

            {/* City, State, and PIN Code Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addressCity" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="addressCity"
                  name="city"
                  value={addressFormData.city}
                  onChange={handleAddressInputChange}
                  className="w-full"
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressState" className="text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="addressState"
                  name="state"
                  value={addressFormData.state}
                  onChange={handleAddressInputChange}
                  className="w-full"
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressPincode" className="text-sm font-medium">
                  PIN Code *
                </Label>
                <Input
                  id="addressPincode"
                  name="pincode"
                  value={addressFormData.pincode}
                  onChange={handleAddressInputChange}
                  className="w-full"
                  placeholder="6-digit PIN code"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Phone Number Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addressPhone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="addressPhone"
                  name="phone"
                  value={addressFormData.phone}
                  onChange={handleAddressInputChange}
                  className="w-full"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>
              <div></div> {/* Empty space for better layout */}
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border">
              <Checkbox
                id="isDefault"
                checked={addressFormData.isDefault}
                onCheckedChange={(checked) =>
                  setAddressFormData(prev => ({ ...prev, isDefault: !!checked }))
                }
              />
              <div className="space-y-1">
                <Label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                  Set as default address
                </Label>
                <p className="text-xs text-muted-foreground">
                  This address will be selected by default during checkout
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddressForm(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={saveAddress} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingAddress ? "Update Address" : "Add Address"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="sm:max-w-[750px] lg:max-w-[900px] xl:max-w-[1000px] max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">
              {editingPayment ? "Edit Payment Method" : "Add New Payment Method"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingPayment
                ? "Update your payment method information below."
                : "Add a new payment method to your account."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="paymentType" className="text-sm font-medium">
                Payment Type *
              </Label>
              <Select
                name="type"
                value={paymentFormData.type}
                onValueChange={(value) =>
                  setPaymentFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARD">💳 Credit/Debit Card</SelectItem>
                  <SelectItem value="UPI">📱 UPI</SelectItem>
                  <SelectItem value="NETBANKING">🏦 Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label htmlFor="paymentName" className="text-sm font-medium">
                Cardholder Name *
              </Label>
              <Input
                id="paymentName"
                name="name"
                value={paymentFormData.name}
                onChange={handlePaymentInputChange}
                className="w-full"
                placeholder="Enter cardholder name"
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm font-medium">
                Card Number *
              </Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={paymentFormData.cardNumber}
                onChange={handlePaymentInputChange}
                className="w-full"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            {/* Expiry and CVV Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth" className="text-sm font-medium">
                  Expiry Month *
                </Label>
                <Select
                  name="expiryMonth"
                  value={paymentFormData.expiryMonth}
                  onValueChange={(value) =>
                    setPaymentFormData(prev => ({ ...prev, expiryMonth: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear" className="text-sm font-medium">
                  Expiry Year *
                </Label>
                <Select
                  name="expiryYear"
                  value={paymentFormData.expiryYear}
                  onValueChange={(value) =>
                    setPaymentFormData(prev => ({ ...prev, expiryYear: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-medium">
                  CVV *
                </Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={paymentFormData.cvv}
                  onChange={handlePaymentInputChange}
                  className="w-full"
                  placeholder="123"
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>

            {/* Default Payment Method Checkbox */}
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border">
              <Checkbox
                id="isDefaultPayment"
                checked={paymentFormData.isDefault}
                onCheckedChange={(checked) =>
                  setPaymentFormData(prev => ({ ...prev, isDefault: !!checked }))
                }
              />
              <div className="space-y-1">
                <Label htmlFor="isDefaultPayment" className="text-sm font-medium cursor-pointer">
                  Set as default payment method
                </Label>
                <p className="text-xs text-muted-foreground">
                  This payment method will be selected by default during checkout
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentForm(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={savePayment} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingPayment ? "Update Payment Method" : "Add Payment Method"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}