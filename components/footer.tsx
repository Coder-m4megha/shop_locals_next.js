import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-lg mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mohit Saree Center has been a trusted name in premium ethnic wear since 1990, offering the finest
              collection of sarees and blouses crafted with exquisite artistry and attention to detail.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/mohit.sarees" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link href="https://www.instagram.com/mohit_sarees_pvt_ltd_kanpur/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-4">Customer Service</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/contact" className="block text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
              <Link href="/shipping" className="block text-muted-foreground hover:text-primary">
                Shipping Information
              </Link>
              <Link href="/returns" className="block text-muted-foreground hover:text-primary">
                Returns & Exchanges
              </Link>
              <Link href="/size-guide" className="block text-muted-foreground hover:text-primary">
                Size Guide
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-primary">
                FAQ
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/products?category=sarees" className="block text-muted-foreground hover:text-primary">
                Sarees
              </Link>
              <Link href="/products?category=blouses" className="block text-muted-foreground hover:text-primary">
                Blouses
              </Link>
              <Link href="/collections" className="block text-muted-foreground hover:text-primary">
                Collections
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-primary">
                Style Guide
              </Link>
              <Link href="/store-locator" className="block text-muted-foreground hover:text-primary">
                Store Locator
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mohit Saree Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

