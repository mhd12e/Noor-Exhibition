"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";
import { cookies } from "next/headers";

export async function submitReview(stars: number, reason: string): Promise<ActionResponse> {
  if (stars < 1 || stars > 5) return { error: "Invalid rating" };

  try {
    const review = await prisma.review.create({
      data: { stars, reason },
    });

    const cookieStore = await cookies();
    cookieStore.set("user_review_id", review.id, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
    });

    revalidatePath("/rate");
    return { success: true };
  } catch (error) {
    return { error: "Failed to submit review" };
  }
}

export async function deleteReview(id: string): Promise<ActionResponse> {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete review" };
  }
}
