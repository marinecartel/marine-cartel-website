import { Metadata } from "next"
import reviews from "@/data/reviews.json"
import ReviewsGrid from "./ReviewsGrid"

const averageRating =
  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

export const metadata: Metadata = {
  title: "Client Testimonials | Marine Cartel - Trusted Marine Automation",
  description:
    "Explore 100+ verified global customer reviews. See why marine engineers trust Marine Cartel for high-quality automation and spare parts.",
}

export default function ReviewsPage() {
  return (
    <>
      {/* Professional SEO Schema - Only in Page.tsx */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Marine & Industrial Equipment Supply",
            "provider": {
              "@type": "Organization",
              "name": "Marine Cartel",
              "url": "https://marinecartel.store"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": averageRating.toFixed(1),
              "reviewCount": reviews.length,
              "bestRating": "5",
              "worstRating": "1"
            },
          }),
        }}
      />

      <ReviewsGrid
        reviews={reviews}
        averageRating={averageRating}
      />
    </>
  )
}