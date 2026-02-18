"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, HelpCircle, Package, Truck, RotateCcw, CreditCard } from "lucide-react"

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = {
    general: {
      title: "General",
      icon: HelpCircle,
      faqs: [
        {
          question: "What types of sarees do you sell?",
          answer: "We offer a wide variety of sarees including Banarasi silk, cotton, georgette, chiffon, designer sarees, and traditional handloom sarees. Each saree comes with a matching or contrasting blouse piece."
        },
        {
          question: "Do you offer custom tailoring services?",
          answer: "Yes, we provide custom tailoring services for blouses. You can provide your measurements during checkout, and our skilled tailors will create a perfectly fitted blouse for you."
        },
        {
          question: "Are your sarees authentic?",
          answer: "Absolutely! All our sarees are sourced directly from authentic weavers and manufacturers. We guarantee the quality and authenticity of every product we sell."
        },
        {
          question: "Do you have a physical store?",
          answer: "Yes, we have a physical store located in Kanpur, Uttar Pradesh. You can visit us for a personalized shopping experience and to feel the fabric quality firsthand."
        }
      ]
    },
    orders: {
      title: "Orders",
      icon: Package,
      faqs: [
        {
          question: "How do I place an order?",
          answer: "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You'll need to provide delivery address and payment information."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 2 hours of placing it. After that, the order goes into processing and cannot be changed. Contact our customer service for assistance."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI payments, net banking, and cash on delivery (COD) for orders up to ₹10,000."
        },
        {
          question: "Do you offer bulk discounts?",
          answer: "Yes, we offer special discounts for bulk orders above ₹50,000. Please contact our sales team for custom pricing and wholesale rates."
        }
      ]
    },
    shipping: {
      title: "Shipping",
      icon: Truck,
      faqs: [
        {
          question: "What are your shipping charges?",
          answer: "Shipping charges vary by location: ₹50-99 for local areas, ₹99-149 for regional, ₹149-199 for national, and ₹199-299 for remote areas. Free shipping on orders above ₹2,000."
        },
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 5-7 business days, express delivery takes 2-3 days, and same-day delivery is available within Kanpur city for orders placed before 2 PM."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to select international destinations. Shipping charges and delivery times vary by country. Please contact us for international shipping rates."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can track your order status in your account dashboard or on our website."
        }
      ]
    },
    returns: {
      title: "Returns",
      icon: RotateCcw,
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 7-day return policy for items in original condition with tags attached. Custom tailored items and sale items are not eligible for return."
        },
        {
          question: "How do I return an item?",
          answer: "Log into your account, select the item you want to return, choose the reason, and schedule a pickup. We'll arrange free pickup from your address."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method."
        },
        {
          question: "Can I exchange an item instead of returning it?",
          answer: "Yes, you can exchange items for different size or colour subject to availability. Exchanges are processed faster than returns and refunds."
        }
      ]
    },
    sizing: {
      title: "Sizing",
      icon: CreditCard,
      faqs: [
        {
          question: "How do I choose the right blouse size?",
          answer: "Please refer to our detailed size guide which includes measurement instructions. For custom tailoring, provide your bust, waist, hip, shoulder, and sleeve length measurements."
        },
        {
          question: "What if the blouse doesn't fit?",
          answer: "If the blouse doesn't fit properly, you can return it within 7 days for a refund or exchange. For custom tailored blouses, we offer one free alteration."
        },
        {
          question: "Are saree lengths standard?",
          answer: "Yes, our sarees are standard 6.3 meters (5.5 yards) in length, suitable for all heights and draping styles. Each saree comes with a 0.8-meter blouse piece."
        },
        {
          question: "Do you offer plus-size options?",
          answer: "Yes, we offer blouses in sizes up to 46 and can accommodate custom measurements for larger sizes. Our sarees are one-size-fits-all due to their draping nature."
        }
      ]
    }
  }

  const filteredFAQs = Object.entries(faqCategories).reduce((acc, [key, category]) => {
    const filteredCategoryFAQs = category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filteredCategoryFAQs.length > 0) {
      acc[key] = { ...category, faqs: filteredCategoryFAQs }
    }
    return acc
  }, {} as typeof faqCategories)

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions about our products, orders, shipping, and more.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="general" className="mb-12">
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(faqCategories).map(([key, category]) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(searchQuery ? filteredFAQs : faqCategories).map(([key, category]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title} Questions
                </CardTitle>
                <CardDescription>
                  Common questions about {category.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            Can't find the answer you're looking for? Our customer service team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-medium mb-2">Phone Support</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Call us at +91 99369 81786<br />
                Mon-Sat: 10 AM - 8 PM
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    try {
                      window.location.href = 'tel:+919936981786';
                    } catch (error) {
                      navigator.clipboard.writeText('+91 99369 81786');
                      alert('Phone number copied to clipboard: +91 99369 81786');
                    }
                  }}
                >
                  📞 Call Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const whatsappUrl = 'https://wa.me/919936981786?text=Hello, I need help with your sarees.';
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  📱 WhatsApp Call
                </Button>
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Email Support</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Send us an email<br />
                support@mohitsarees.com
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const emailUrl = 'mailto:support@mohitsarees.com?subject=Inquiry about Sarees&body=Hello, I have a question about your products.';
                  try {
                    window.location.href = emailUrl;
                  } catch (error) {
                    // Fallback - copy email to clipboard
                    navigator.clipboard.writeText('support@mohitsarees.com');
                    alert('Email address copied to clipboard: support@mohitsarees.com');
                  }
                }}
              >
                ✉️ Send Email
              </Button>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Live Chat</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our team<br />
                Available via WhatsApp
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const whatsappUrl = 'https://wa.me/919936981786?text=Hello, I have a question about your sarees and would like to chat with your team.';
                  window.open(whatsappUrl, '_blank');
                }}
              >
                💬 Start WhatsApp Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
