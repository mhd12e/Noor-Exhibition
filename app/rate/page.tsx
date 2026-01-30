import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { RatingView } from "@/components/rating/rating-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "قيمنا | معرض الابتكار 2026",
  description: "شاركنا رأيك في معرض الابتكار لعام 2026",
};

export default async function RatePage() {
  const cookieStore = await cookies();
  const reviewId = cookieStore.get("user_review_id")?.value;

  let existingReview = null;
  if (reviewId) {
    existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });
  }

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col items-center">
      <RatingView existingReview={existingReview} />
    </div>
  );
}
