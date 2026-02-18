import type { Metadata } from "next"
import CollectionDetail from "./collection-detail"

export const metadata: Metadata = {
  title: "Collection | Mohit Saree Center",
  description: "Explore our curated collection of premium sarees and designer blouses.",
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <CollectionDetail id={params.id} />
    </main>
  )
}

