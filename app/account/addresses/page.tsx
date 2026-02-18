import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserProfile } from "@/lib/actions/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Home } from "lucide-react"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Saved Addresses | Mohit Saree Center",
  description: "Manage your delivery addresses.",
}

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const userData = await getUserProfile()
  
  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Addresses</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Failed to load addresses. Please try again later.</p>
        </div>
      </div>
    )
  }

  const addresses = userData.addresses || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add your delivery addresses to make checkout faster and easier.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address: any) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      {address.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{address.type}</Badge>
                      {address.isDefault && (
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
                  <p className="font-medium">{address.name}</p>
                  <p className="text-muted-foreground">{address.address}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-muted-foreground">Phone: {address.phone}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  {!address.isDefault && (
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

      {/* Add Address Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Address Guidelines</CardTitle>
          <CardDescription>
            Please ensure your addresses are complete and accurate for smooth delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Required Information:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Full name of recipient</li>
                <li>• Complete address with landmarks</li>
                <li>• City, state, and PIN code</li>
                <li>• Valid phone number</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Address Types:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Home:</strong> Residential address</li>
                <li>• <strong>Office:</strong> Workplace address</li>
                <li>• <strong>Other:</strong> Any other location</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
