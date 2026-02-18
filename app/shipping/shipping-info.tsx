import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, Clock, MapPin, Shield, CreditCard } from "lucide-react"

export default function ShippingInfo() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Shipping Information</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We offer fast and reliable shipping across India. Learn about our delivery options, charges, and policies.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Standard Delivery</CardTitle>
            <CardDescription>5-7 business days</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold mb-2">₹99</p>
            <p className="text-sm text-muted-foreground">
              Free shipping on orders above ₹2,000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Express Delivery</CardTitle>
            <CardDescription>2-3 business days</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold mb-2">₹199</p>
            <p className="text-sm text-muted-foreground">
              Fast delivery for urgent orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Same Day Delivery</CardTitle>
            <CardDescription>Within Kanpur city</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold mb-2">₹299</p>
            <p className="text-sm text-muted-foreground">
              Available for orders placed before 2 PM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Areas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Areas
          </CardTitle>
          <CardDescription>
            We deliver across India with different shipping charges based on location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium mb-2">Zone 1 - Local</h4>
              <p className="text-sm text-muted-foreground mb-2">Kanpur & nearby areas</p>
              <Badge variant="secondary">₹50 - ₹99</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Zone 2 - Regional</h4>
              <p className="text-sm text-muted-foreground mb-2">Uttar Pradesh</p>
              <Badge variant="secondary">₹99 - ₹149</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Zone 3 - National</h4>
              <p className="text-sm text-muted-foreground mb-2">Major cities</p>
              <Badge variant="secondary">₹149 - ₹199</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Zone 4 - Remote</h4>
              <p className="text-sm text-muted-foreground mb-2">Remote areas</p>
              <Badge variant="secondary">₹199 - ₹299</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Shipping Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Processing Time</h4>
              <p className="text-sm text-muted-foreground">
                Orders are processed within 1-2 business days. Custom tailoring may take additional 3-5 days.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Packaging</h4>
              <p className="text-sm text-muted-foreground">
                All items are carefully packed in protective packaging to ensure they reach you in perfect condition.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tracking</h4>
              <p className="text-sm text-muted-foreground">
                You'll receive a tracking number via SMS and email once your order is shipped.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Delivery Attempts</h4>
              <p className="text-sm text-muted-foreground">
                We make up to 3 delivery attempts. If unsuccessful, the package will be returned to our warehouse.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment & Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Cash on Delivery (COD)</h4>
              <p className="text-sm text-muted-foreground">
                Available for orders up to ₹10,000. Additional COD charges of ₹50 apply.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Prepaid Orders</h4>
              <p className="text-sm text-muted-foreground">
                Get 5% discount on prepaid orders. Free shipping on orders above ₹2,000.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">International Shipping</h4>
              <p className="text-sm text-muted-foreground">
                Currently available to select countries. Contact us for international shipping rates.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Bulk Orders</h4>
              <p className="text-sm text-muted-foreground">
                Special shipping rates available for bulk orders above ₹50,000. Contact us for details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Delivery Address</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure complete and accurate delivery address</li>
                <li>• Include landmark and contact number</li>
                <li>• Address changes not possible after dispatch</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Delivery Issues</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Contact us immediately for any delivery issues</li>
                <li>• Check package condition before accepting delivery</li>
                <li>• Report damages within 24 hours of delivery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Holidays & Delays</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No deliveries on national holidays</li>
                <li>• Weather conditions may cause delays</li>
                <li>• Festival seasons may have extended delivery times</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Customer Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Call us at +91 9936981786 for shipping queries</li>
                <li>• Email: shipping@mohitsarees.com</li>
                <li>• Live chat available on website</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
