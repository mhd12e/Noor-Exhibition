"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { ActionResponse } from "@/lib/types";
import { APP_CONFIG, REGEX } from "@/lib/constants";

function validateCreators(creatorsStr: string) {
  const names = creatorsStr.split(";").filter(n => n.trim() !== "");
  for (const name of names) {
    if (!REGEX.STUDENT_NAME.test(name)) {
      throw new Error(`Invalid student name: "${name}". Only letters and spaces are allowed.`);
    }
  }
}

export async function createProject(formData: FormData): Promise<ActionResponse> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const year = parseInt(formData.get("year") as string);
  const creators = formData.get("creators") as string;
  const link = formData.get("link") as string | null;
  const categoryId = formData.get("categoryId") as string;
  const coverFile = formData.get("cover") as File | null;
  const videoFile = formData.get("video") as File | null;

  if (year > APP_CONFIG.CURRENT_YEAR) {
    return { error: `Invalid year. Must not be greater than ${APP_CONFIG.CURRENT_YEAR}.` };
  }

  try {
    validateCreators(creators);

    if (!coverFile || coverFile.size === 0) {
      throw new Error("Cover image is required");
    }

    if (coverFile.size > APP_CONFIG.MAX_COVER_SIZE) throw new Error("Cover image exceeds 3MB");
      
    const id = uuidv4();
    const buffer = Buffer.from(await coverFile.arrayBuffer());
    const pngBuffer = await sharp(buffer).png().toBuffer();
    await uploadFile(pngBuffer, `imgs/${id}.png`, "image/png");
    
    let hasVideo = false;
    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > APP_CONFIG.MAX_VIDEO_SIZE) throw new Error("Video exceeds 50MB");
      if (!videoFile.name.endsWith(".mp4") && videoFile.type !== "video/mp4") {
        throw new Error("Only MP4 videos are accepted");
      }
      
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      await uploadFile(videoBuffer, `videos/${id}.mp4`, "video/mp4");
      hasVideo = true;
    }

    await prisma.project.create({
      data: {
        id, title, description, year, creators,
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

export async function updateProject(id: string, formData: FormData): Promise<ActionResponse> {
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

  if (year > APP_CONFIG.CURRENT_YEAR) {
    return { error: `Invalid year. Must not be greater than ${APP_CONFIG.CURRENT_YEAR}.` };
  }

  try {
    validateCreators(creators);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new Error("Project not found");

    let coverUpdate = project.cover;
    let videoUpdate = project.video;

    if (removeCover && project.cover) {
      await deleteFile(`imgs/${id}.png`);
      coverUpdate = false;
    }
    if (removeVideo && project.video) {
      await deleteFile(`videos/${id}.mp4`);
      videoUpdate = false;
    }

    if (coverFile && coverFile.size > 0) {
      if (coverFile.size > APP_CONFIG.MAX_COVER_SIZE) throw new Error("Cover image exceeds 3MB");
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const pngBuffer = await sharp(buffer).png().toBuffer();
      await uploadFile(pngBuffer, `imgs/${id}.png`, "image/png");
      coverUpdate = true;
    }

    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > APP_CONFIG.MAX_VIDEO_SIZE) throw new Error("Video exceeds 50MB");
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
        title, description, year, creators, categoryId,
        link: link || null,
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

export async function deleteProject(id: string): Promise<ActionResponse> {
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
