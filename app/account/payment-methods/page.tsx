import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserProfile } from "@/lib/actions/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Edit, Trash2, Shield, Lock } from "lucide-react"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Payment Methods | Mohit Saree Center",
  description: "Manage your payment methods and cards.",
}

export default async function PaymentMethodsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const userData = await getUserProfile()
  
  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Failed to load payment methods. Please try again later.</p>
        </div>
      </div>
    )
  }

  const paymentMethods = userData.paymentMethods || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="flex items-center gap-3 pt-6">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Your payment information is secure</p>
            <p className="text-sm text-blue-700">
              We use industry-standard encryption to protect your payment details.
            </p>
          </div>
        </CardContent>
      </Card>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add your payment methods to make checkout faster and more convenient.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method: any) => (
            <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {method.type === "CARD" ? "Credit/Debit Card" : method.type}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{method.provider}</Badge>
                      {method.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {method.type === "CARD" && (
                    <>
                      <p className="font-medium">**** **** **** {method.lastFour}</p>
                      <p className="text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                      <p className="text-muted-foreground">
                        {method.cardholderName}
                      </p>
                    </>
                  )}
                  {method.type === "UPI" && (
                    <p className="font-medium">{method.upiId}</p>
                  )}
                  {method.type === "WALLET" && (
                    <p className="font-medium">{method.walletProvider}</p>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" className="flex-1">
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Options Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Supported Payment Methods
          </CardTitle>
          <CardDescription>
            We accept various payment methods for your convenience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Cards</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Visa, Mastercard, RuPay</li>
                <li>• Credit and Debit Cards</li>
                <li>• EMI options available</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Digital Payments</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• UPI (Google Pay, PhonePe, etc.)</li>
                <li>• Net Banking</li>
                <li>• Digital Wallets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Other Options</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Cash on Delivery</li>
                <li>• Bank Transfer</li>
                <li>• Buy Now, Pay Later</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
