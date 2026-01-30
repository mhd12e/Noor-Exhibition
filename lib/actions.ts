"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

// Auth Actions
export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password";
        default:
          return "An unexpected error occurred";
      }
    }
    throw error;
  }
}

// Category Actions
export async function createCategory(name: string) {
  try {
    await prisma.category.create({ data: { name } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    await prisma.category.update({ where: { id }, data: { name } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const projectCount = await prisma.project.count({
      where: { categoryId: id },
    });

    if (projectCount > 0) {
      return { error: "Cannot delete category because it has projects linked to it." };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category. Please try again." };
  }
}

// Helper for name validation
function validateCreators(creatorsStr: string) {
  const names = creatorsStr.split(";").filter(n => n.trim() !== "");
  const nameRegex = /^[a-zA-Z\s\u0600-\u06FF]+$/;
  
  for (const name of names) {
    if (!nameRegex.test(name)) {
      throw new Error(`Invalid student name: "${name}". Only letters and spaces are allowed.`);
    }
  }
}

// Project Actions
export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const year = parseInt(formData.get("year") as string);
  const creators = formData.get("creators") as string;
  const link = formData.get("link") as string | null;
  const categoryId = formData.get("categoryId") as string;
  const coverFile = formData.get("cover") as File | null;
  const videoFile = formData.get("video") as File | null;

  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year > currentYear) {
    return { error: `Invalid year. Must not be greater than ${currentYear}.` };
  }

  try {
    validateCreators(creators);

    if (!coverFile || coverFile.size === 0) {
      throw new Error("Cover image is required");
    }

    if (coverFile.size > 3 * 1024 * 1024) throw new Error("Cover image exceeds 3MB");
      
    const id = uuidv4();
    const buffer = Buffer.from(await coverFile.arrayBuffer());
    const pngBuffer = await sharp(buffer).png().toBuffer();
    await uploadFile(pngBuffer, `imgs/${id}.png`, "image/png");
    
    let hasVideo = false;
    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > 50 * 1024 * 1024) throw new Error("Video exceeds 50MB");
      if (!videoFile.name.endsWith(".mp4") && videoFile.type !== "video/mp4") {
        throw new Error("Only MP4 videos are accepted");
      }
      
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      await uploadFile(videoBuffer, `videos/${id}.mp4`, "video/mp4");
      hasVideo = true;
    }

    await prisma.project.create({
      data: {
        id,
        title,
        description,
        year,
        creators,
        link: link || null,
        categoryId,
        cover: true,
        video: hasVideo,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create project" };
  }
}

export async function deleteProject(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new Error("Project not found");

    if (project.cover) await deleteFile(`imgs/${id}.png`);
    if (project.video) await deleteFile(`videos/${id}.mp4`);

    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const year = parseInt(formData.get("year") as string);
  const creators = formData.get("creators") as string;
  const link = formData.get("link") as string | null;
  const categoryId = formData.get("categoryId") as string;
  const coverFile = formData.get("cover") as File | null;
  const videoFile = formData.get("video") as File | null;
  const removeCover = formData.get("removeCover") === "true";
  const removeVideo = formData.get("removeVideo") === "true";

  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year > currentYear) {
    return { error: `Invalid year. Must not be greater than ${currentYear}.` };
  }

  try {
    validateCreators(creators);

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new Error("Project not found");

    let coverUpdate = project.cover;
    let videoUpdate = project.video;

    // Handle removal flags first
    if (removeCover && project.cover) {
      await deleteFile(`imgs/${id}.png`);
      coverUpdate = false;
    }
    if (removeVideo && project.video) {
      await deleteFile(`videos/${id}.mp4`);
      videoUpdate = false;
    }

    // Handle new uploads
    if (coverFile && coverFile.size > 0) {
      if (coverFile.size > 3 * 1024 * 1024) throw new Error("Cover image exceeds 3MB");
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const pngBuffer = await sharp(buffer).png().toBuffer();
      await uploadFile(pngBuffer, `imgs/${id}.png`, "image/png");
      coverUpdate = true;
    }

    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > 50 * 1024 * 1024) throw new Error("Video exceeds 50MB");
      if (!videoFile.name.endsWith(".mp4") && videoFile.type !== "video/mp4") {
        throw new Error("Only MP4 videos are accepted");
      }
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      await uploadFile(videoBuffer, `videos/${id}.mp4`, "video/mp4");
      videoUpdate = true;
    }

    await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        year,
        creators,
        link: link || null,
        categoryId,
        cover: coverUpdate,
        video: videoUpdate,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update project" };
  }
}

// Review Actions
export async function submitReview(stars: number, reason: string) {
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

export async function getReviewById(id: string) {
  try {
    return await prisma.review.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete review" };
  }
}
