import { Metadata } from "next"
import ReturnsInfo from "./returns-info"

export const metadata: Metadata = {
  title: "Returns & Exchanges - Mohit Saree Center",
  description: "Learn about our return and exchange policies for sarees and blouses. Easy returns within 7 days.",
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReturnsInfo />
    </div>
  )
}
