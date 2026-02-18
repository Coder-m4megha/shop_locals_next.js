import type { Metadata } from "next"
import CollectionsList from "./collections-list"

export const metadata: Metadata = {
  title: "Collections | Mohit Saree Center",
  description: "Explore our curated collections of premium sarees and designer blouses.",
}

export default function CollectionsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <CollectionsList />
    </main>
  )
}

