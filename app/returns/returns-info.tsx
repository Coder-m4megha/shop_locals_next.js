import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ReturnsInfo() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Returns & Exchanges</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We want you to be completely satisfied with your purchase. Learn about our hassle-free return and exchange policy.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>7-Day Return</CardTitle>
            <CardDescription>Easy returns within 7 days</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Return any item within 7 days of delivery for a full refund
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <RotateCcw className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Free Exchange</CardTitle>
            <CardDescription>No questions asked</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Exchange for different size or colour at no extra cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Easy Process</CardTitle>
            <CardDescription>Simple return steps</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Request return online and we'll arrange pickup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Conditions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Return Conditions
          </CardTitle>
          <CardDescription>
            Items must meet these conditions to be eligible for return or exchange.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-green-600">✓ Eligible for Return</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Items in original condition with tags attached</li>
                <li>• Unworn and unwashed items</li>
                <li>• Items in original packaging</li>
                <li>• Returned within 7 days of delivery</li>
                <li>• Items purchased at full price</li>
                <li>• Defective or damaged items</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-red-600">✗ Not Eligible for Return</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom tailored or altered items</li>
                <li>• Items worn or washed</li>
                <li>• Items without original tags</li>
                <li>• Sale or clearance items</li>
                <li>• Items damaged by customer</li>
                <li>• Intimate apparel for hygiene reasons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Process */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Return an Item</CardTitle>
          <CardDescription>
            Follow these simple steps to return or exchange your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Initiate Return</h4>
              <p className="text-sm text-muted-foreground">
                Log into your account and select the item you want to return
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Choose Reason</h4>
              <p className="text-sm text-muted-foreground">
                Select the reason for return and preferred resolution
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Schedule Pickup</h4>
              <p className="text-sm text-muted-foreground">
                We'll arrange free pickup from your address
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">4</span>
              </div>
              <h4 className="font-medium mb-2">Get Refund</h4>
              <p className="text-sm text-muted-foreground">
                Receive refund within 5-7 business days
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/account/orders">Start Return Process</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Refund Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Refund Timeline</h4>
              <p className="text-sm text-muted-foreground">
                Refunds are processed within 5-7 business days after we receive the returned item.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Refund Method</h4>
              <p className="text-sm text-muted-foreground">
                Refunds are credited to the original payment method used for the purchase.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Shipping Charges</h4>
              <p className="text-sm text-muted-foreground">
                Original shipping charges are non-refundable unless the item was defective.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Partial Refunds</h4>
              <p className="text-sm text-muted-foreground">
                Items returned in used condition may receive partial refunds at our discretion.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Size Exchange</h4>
              <p className="text-sm text-muted-foreground">
                Exchange for different size free of charge, subject to availability.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Colour Exchange</h4>
              <p className="text-sm text-muted-foreground">
                Exchange for different colour in the same design, if available.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Product Exchange</h4>
              <p className="text-sm text-muted-foreground">
                Exchange for different product of equal or higher value.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Exchange Timeline</h4>
              <p className="text-sm text-muted-foreground">
                New item will be shipped within 2-3 business days of receiving the returned item.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special Cases */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Special Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Defective Items</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Items with manufacturing defects can be returned anytime within 30 days.
              </p>
              <Badge variant="outline">Extended Return Period</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Wrong Item Delivered</h4>
              <p className="text-sm text-muted-foreground mb-2">
                If you receive the wrong item, we'll arrange immediate exchange at no cost.
              </p>
              <Badge variant="outline">Free Exchange</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Damaged in Transit</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Items damaged during shipping are eligible for full refund or replacement.
              </p>
              <Badge variant="outline">Full Refund</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help with Returns?</CardTitle>
          <CardDescription>
            Our customer service team is here to help with any return or exchange queries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-medium mb-2">Phone Support</h4>
              <p className="text-sm text-muted-foreground mb-2">+91 9936981786</p>
              <p className="text-xs text-muted-foreground">Mon-Sat: 10 AM - 8 PM</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Email Support</h4>
              <p className="text-sm text-muted-foreground mb-2">returns@mohitsarees.com</p>
              <p className="text-xs text-muted-foreground">Response within 24 hours</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Live Chat</h4>
              <p className="text-sm text-muted-foreground mb-2">Available on website</p>
              <p className="text-xs text-muted-foreground">Instant support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
