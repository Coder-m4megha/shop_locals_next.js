"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "I purchased a Banarasi silk saree for my wedding and was amazed by the quality and craftsmanship. The team at Mohit Saree Center was extremely helpful in helping me choose the perfect piece.",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Ananya Patel",
    location: "Mumbai",
    rating: 5,
    text: "The designer blouses I ordered were absolutely stunning. The embroidery work is exquisite and the fit is perfect. I've received so many compliments!",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Meera Reddy",
    location: "Bangalore",
    rating: 4,
    text: "I've been a loyal customer for years. Their collection is always up-to-date with the latest trends while maintaining traditional aesthetics. Highly recommend!",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Kavita Gupta",
    location: "Jaipur",
    rating: 5,
    text: "The virtual try-on feature helped me make the perfect choice. The saree I received looked exactly like it did online. Exceptional quality and service!",
    avatar: "/placeholder.svg",
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const itemsToShow = React.useMemo(() => {
    // Responsive number of items to show
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const visibleTestimonials = React.useMemo(() => {
    const items = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % testimonials.length
      items.push(testimonials[index])
    }
    return items
  }, [currentIndex, itemsToShow])

  return (
    <div className="relative">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-6 overflow-hidden px-8">
          {visibleTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

