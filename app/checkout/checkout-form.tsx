"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, CreditCard, Truck, Shield, CheckCircle, MapPin, Store, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/lib/actions/order"
import { getUserProfile } from "@/lib/actions/user"

// Define the Product type with required properties
type Product = {
  id: string
  name: string
  price: number
  image?: string
  // Add other product properties as needed
}

// Define the CartItem type
type CartItem = {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

export default function CheckoutForm() {
  const { toast } = useToast()
  const router = useRouter()
  const { items, subtotal, shipping, tax, total } = useCart()
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: true,
  })

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card")

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  })

  const [upiInfo, setUpiInfo] = useState({
    upiId: "",
  })

  const [orderDetails, setOrderDetails] = useState({
    id: "",
    orderNumber: "",
  })

  const [deliveryMethod, setDeliveryMethod] = useState<"HOME_DELIVERY" | "STORE_PICKUP">("HOME_DELIVERY")

  // Load user profile and addresses
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile()

        if (userProfile) {
          // Pre-fill shipping info
          setShippingInfo({
            firstName: userProfile.firstName || "",
            lastName: userProfile.lastName || "",
            email: userProfile.email || "",
            phone: userProfile.phone || "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            saveAddress: true,
          })

          // Load addresses
          if (userProfile.addresses && userProfile.addresses.length > 0) {
            setAddresses(userProfile.addresses)

            // Select default address if available
            const defaultAddress = userProfile.addresses.find((addr: any) => addr.isDefault)
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id)
            } else {
              setSelectedAddressId(userProfile.addresses[0].id)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (deliveryMethod === "HOME_DELIVERY" && !selectedAddressId && !validateShippingInfo()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping information.",
        variant: "destructive",
      })
      return
    }

    setStep("payment")
    window.scrollTo(0, 0)
  }

  const validateShippingInfo = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"]
    return requiredFields.every((field) => (shippingInfo as any)[field]?.trim())
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate payment info
    if (paymentMethod === "card" && !validateCardInfo()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required card information.",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "upi" && !upiInfo.upiId) {
      toast({
        title: "Missing information",
        description: "Please enter your UPI ID.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size || null,
          color: item.color || null,
        })),
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod:
          paymentMethod === "card"
            ? `Credit Card (${cardInfo.cardName})`
            : paymentMethod === "upi"
              ? `UPI (${upiInfo.upiId})`
              : "Cash on Delivery",
        deliveryMethod,
        addressId: selectedAddressId || null,
        notes: null,
      }

      // Create the order
      const result = await createOrder(orderData)

      if (result.success) {
        setOrderDetails({
          id: result.orderId || "",
          orderNumber: result.orderNumber || "",
        })

        toast({
          title: "Order placed successfully",
          description: "Your order has been placed and is being processed.",
        })

        setStep("confirmation")
        window.scrollTo(0, 0)
      } else {
        toast({
          title: "Order failed",
          description: result.message || "There was a problem processing your order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Order failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateCardInfo = () => {
    return cardInfo.cardNumber && cardInfo.cardName && cardInfo.expiry && cardInfo.cvv
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target

    if (step === "shipping") {
      setShippingInfo((prev) => ({
        ...prev,
        [name]: name === "saveAddress" ? checked : value,
      }))
    } else if (step === "payment") {
      if (paymentMethod === "card") {
        setCardInfo((prev) => ({
          ...prev,
          [name]: name === "saveCard" ? checked : value,
        }))
      } else if (paymentMethod === "upi") {
        setUpiInfo((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    }
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">You need to add items to your cart before proceeding to checkout.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading checkout information...</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {step !== "confirmation" && (
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Cart
            </Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Delivery Method</h3>
                    <RadioGroup
                      defaultValue={deliveryMethod}
                      value={deliveryMethod}
                      onValueChange={(value) => setDeliveryMethod(value as "HOME_DELIVERY" | "STORE_PICKUP")}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="HOME_DELIVERY" id="delivery" />
                        <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Home Delivery</p>
                              <p className="text-sm text-muted-foreground">Delivered to your doorstep</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="STORE_PICKUP" id="pickup" />
                        <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">In-Store Pickup</p>
                              <p className="text-sm text-muted-foreground">
                                Collect from our store at your convenience
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {deliveryMethod === "HOME_DELIVERY" && (
                    <>
                      {addresses.length > 0 && (
                        <div className="mt-6 space-y-4">
                          <h3 className="font-medium">Select a Saved Address</h3>
                          <RadioGroup
                            value={selectedAddressId}
                            onValueChange={setSelectedAddressId}
                            className="space-y-3"
                          >
                            {addresses.map((address) => (
                              <div key={address.id} className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                                <RadioGroupItem value={address.id} id={`address-${address.id}`} />
                                <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-medium">{address.name}</p>
                                      <p className="text-sm">{address.address}</p>
                                      <p className="text-sm">
                                        {address.city}, {address.state} - {address.pincode}
                                      </p>
                                      <p className="text-sm">Phone: {address.phone}</p>
                                      {address.isDefault && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-1 inline-block">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>

                          <div className="flex items-center">
                            <Separator className="flex-1" />
                            <span className="px-2 text-sm text-muted-foreground">Or</span>
                            <Separator className="flex-1" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h3 className="font-medium">Add a New Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={shippingInfo.firstName}
                              onChange={handleInputChange}
                              required={!selectedAddressId}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={shippingInfo.lastName}
                              onChange={handleInputChange}
                              required={!selectedAddressId}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={shippingInfo.email}
                              onChange={handleInputChange}
                              required={!selectedAddressId}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={shippingInfo.phone}
                              onChange={handleInputChange}
                              required={!selectedAddressId}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleInputChange}
                            required={!selectedAddressId}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={shippingInfo.city}
                              onChange={handleInputChange}
                              required={!selectedAddressId}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              value={shippingInfo.state}
                              onChange={handleInputChange}
                              required={!selectedAddressId}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            value={shippingInfo.pincode}
                            onChange={handleInputChange}
                            required={!selectedAddressId}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="saveAddress"
                            name="saveAddress"
                            checked={shippingInfo.saveAddress}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="saveAddress" className="text-sm font-normal">
                            Save this address for future orders
                          </Label>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="shipping-form" className="w-full">
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "card" | "upi" | "cod")}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span>Credit/Debit Card</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-8 h-5 bg-blue-600 rounded"></div>
                            <div className="w-8 h-5 bg-red-500 rounded"></div>
                            <div className="w-8 h-5 bg-green-500 rounded"></div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">UPI</span>
                            <span>UPI Payment</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-8 h-5 bg-green-500 rounded"></div>
                            <div className="w-8 h-5 bg-blue-500 rounded"></div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          <span>Cash on Delivery</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-6 border-t pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardInfo.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardInfo.expiry}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={cardInfo.cvv}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="saveCard"
                          name="saveCard"
                          checked={cardInfo.saveCard}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="saveCard" className="text-sm font-normal">
                          Save this card for future payments
                        </Label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-4 mt-6 border-t pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          name="upiId"
                          placeholder="yourname@upi"
                          value={upiInfo.upiId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("shipping")}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Back to Shipping
                </Button>
                <Button type="submit" form="payment-form" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === "confirmation" && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Order Confirmed!</CardTitle>
                <CardDescription>Thank you for your purchase. Your order has been placed successfully.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <p className="font-medium">Order Number: {orderDetails.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    A confirmation email has been sent to {shippingInfo.email}
                  </p>
                </div>

                <div>
                  {deliveryMethod === "HOME_DELIVERY" ? (
                    <>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <p>
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                      <p>{shippingInfo.address}</p>
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                      </p>
                      <p>Phone: {shippingInfo.phone}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium mb-2">In-Store Pickup Information</h3>
                      <div className="flex items-start gap-3">
                        <Store className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Mohit Saree Center - Kanpur Flagship Store</p>
                          <p>55, 115, Biharilal Gupta Rd, Purani Dal Mandi, General Ganj</p>
                          <p>Kanpur, Uttar Pradesh 208001</p>
                          <p className="mt-2">Store Hours: 10:00 AM - 8:00 PM (Mon-Sat), 11:00 AM - 6:00 PM (Sun)</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Please bring your order number and a valid ID for pickup
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p>
                    {paymentMethod === "card" && "Credit/Debit Card"}
                    {paymentMethod === "upi" && "UPI Payment"}
                    {paymentMethod === "cod" && "Cash on Delivery"}
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <p>Your order will be processed and shipped soon.</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button asChild>
                      <Link href={`/account/orders/${orderDetails.id}`}>Track Your Order</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step !== "confirmation" && (
                <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                  {(items as CartItem[]).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name || 'Product image'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium line-clamp-1">{item.product.name}</p>
                            {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                            {item.color && <p className="text-xs text-muted-foreground">Color: {item.color}</p>}
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

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
            </CardContent>
          </Card>

          {step !== "confirmation" && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free shipping on orders above ₹5,000</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure checkout with 256-bit encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}