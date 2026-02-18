import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Clock, Mail } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StoreLocator() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Visit Our Store</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience our premium collection in person and get expert assistance from our knowledgeable staff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Mohit Saree Center</CardTitle>
            <CardDescription>Kanpur Flagship Store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p>55, 115, Biharilal Gupta Rd, Purani Dal Mandi, General Ganj, Kanpur, Uttar Pradesh 208001</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <p>+91 9936981786</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <p>contact@mohitsareecenter.com</p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Store Hours:</p>
                <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                <p>Sunday: 11:00 AM - 6:00 PM</p>
              </div>
            </div>

            <Button asChild className="w-full mt-4">
              <Link href="https://maps.app.goo.gl/V1DDBi1s7ozjWxtg7" target="_blank" rel="noopener noreferrer">
                Get Directions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.0394257097396!2d80.3382!3d26.4675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4770b127c46f%3A0x1778302a9fbe7b41!2sGeneral%20Ganj%2C%20Kanpur%2C%20Uttar%20Pradesh%20208001!5e0!3m2!1sen!2sin!4v1616661234567!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-serif mb-6 text-center">Store Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://ramasarees.com/wp-content/uploads/2021/05/IMG_9019-min-scaled.jpg"
              alt="Store Interior"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-medium">Store Interior</h3>
              <p className="text-sm opacity-90">Elegant shopping experience</p>
            </div>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://wholetex.sgp1.cdn.digitaloceanspaces.com/full/soft-net-stone-mirror-work-saree-3118-115.jpg"
              alt="Product Display"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-medium">Product Display</h3>
              <p className="text-sm opacity-90">Premium saree collection</p>
            </div>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://files.yappe.in/place/full/raj-ratan-9388884.webp"
              alt="Store Exterior"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-medium">Store Exterior</h3>
              <p className="text-sm opacity-90">Visit our flagship store</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-serif mb-4">Visit Us Today</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Our experienced staff is ready to help you find the perfect saree or blouse for any occasion. We offer
          personalized styling advice and alterations to ensure the perfect fit.
        </p>
        <Button size="lg" asChild>
          <Link href="https://maps.app.goo.gl/V1DDBi1s7ozjWxtg7" target="_blank" rel="noopener noreferrer">
            Get Directions
          </Link>
        </Button>
      </div>
    </div>
  )
}

