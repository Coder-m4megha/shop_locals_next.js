import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CategoryShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative overflow-hidden rounded-lg group h-[500px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg"
          alt="Luxury Saree Collection"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
          <h3 className="text-white text-2xl font-serif mb-2">Premium Sarees</h3>
          <p className="text-white/90 mb-4">Handcrafted with the finest silks and traditional techniques</p>
          <Button asChild className="w-fit">
            <Link href="/products?category=sarees">Explore Collection</Link>
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg group h-[500px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp"
          alt="Designer Blouse Collection"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
          <h3 className="text-white text-2xl font-serif mb-2">Designer Blouses</h3>
          <p className="text-white/90 mb-4">Exquisite designs with intricate embroidery and embellishments</p>
          <Button asChild className="w-fit">
            <Link href="/products?category=blouses">View Collection</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

