import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Re-implementing validation/configs to be self-contained as requested
const REGEX = {
  STUDENT_NAME: /^[a-zA-Z\s\u0600-\u06FF]+$/,
};

const APP_CONFIG = {
  MAX_COVER_SIZE: 3 * 1024 * 1024, // 3MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  CURRENT_YEAR: new Date().getFullYear(),
};

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function uploadToR2(buffer: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await s3Client.send(command);
}

async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });
  await s3Client.send(command);
}

function validateCreators(creatorsStr: string) {
  const names = creatorsStr.split(";").filter(n => n.trim() !== "");
  for (const name of names) {
    if (!REGEX.STUDENT_NAME.test(name)) {
      throw new Error(`Invalid student name: "${name}". Only letters and spaces are allowed.`);
    }
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is not set.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  const command = process.argv[2];

  try {
    switch (command) {
      case "add": {
        // Usage: add <title> <description> <year> <creators> <categoryName> <coverPath> [videoPath] [link]
        const [title, description, yearStr, creators, catName, coverPath, videoPath, link] = process.argv.slice(3);

        if (!title || !description || !yearStr || !creators || !catName || !coverPath) {
          console.error("Usage: npx tsx scripts/project-management.ts add <title> <description> <year> <creators> <categoryName> <coverPath> [videoPath] [link]");
          process.exit(1);
        }

        const year = parseInt(yearStr);
        validateCreators(creators);

        const category = await prisma.category.findUnique({ where: { name: catName } });
        if (!category) {
          console.error(`❌ Error: Category "${catName}" not found. Create it first using category-management.ts`);
          process.exit(1);
        }

        if (!fs.existsSync(coverPath)) {
          console.error(`❌ Error: Cover file not found at ${coverPath}`);
          process.exit(1);
        }

        const id = uuidv4();
        console.log(`⏳ Processing project ${id}...`);

        // Process Cover
        const coverBuffer = fs.readFileSync(coverPath);
        if (coverBuffer.length > APP_CONFIG.MAX_COVER_SIZE) {
            throw new Error("Cover image exceeds 3MB");
        }
        const pngBuffer = await sharp(coverBuffer).png().toBuffer();
        console.log("📤 Uploading cover to R2...");
        await uploadToR2(pngBuffer, `imgs/${id}.png`, "image/png");

        let hasVideo = false;
        if (videoPath && fs.existsSync(videoPath)) {
          const videoBuffer = fs.readFileSync(videoPath);
          if (videoBuffer.length > APP_CONFIG.MAX_VIDEO_SIZE) {
            throw new Error("Video exceeds 50MB");
          }
          console.log("📤 Uploading video to R2...");
          await uploadToR2(videoBuffer, `videos/${id}.mp4`, "video/mp4");
          hasVideo = true;
        }

        await prisma.project.create({
          data: {
            id, title, description, year, creators,
            link: link || null,
            categoryId: category.id,
            cover: true,
            video: hasVideo,
          },
        });

        console.log(`✅ Project "${title}" has been created successfully.`);
        break;
      }

      case "remove": {
        const id = process.argv[3];
        if (!id) {
          console.error("Usage: npx tsx scripts/project-management.ts remove <projectId>");
          process.exit(1);
        }

        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
          console.error(`❌ Error: Project with ID ${id} not found.`);
          process.exit(1);
        }

        console.log(`⏳ Deleting project ${id} and its files...`);
        if (project.cover) await deleteFromR2(`imgs/${id}.png`);
        if (project.video) await deleteFromR2(`videos/${id}.mp4`);

        await prisma.project.delete({ where: { id } });
        console.log(`✅ Project "${project.title}" and associated files have been removed.`);
        break;
      }

      case "list": {
        const projects = await prisma.project.findMany({
          include: { category: true },
          orderBy: { createdAt: "desc" }
        });

        if (projects.length === 0) {
          console.log("ℹ️ No projects found.");
        } else {
          console.log("🚀 Exhibition Projects:");
          projects.forEach((p) => {
            console.log(`- [${p.id}] ${p.title} (${p.year})`);
            console.log(`  Category: ${p.category.name}`);
            console.log(`  Creators: ${p.creators}`);
            console.log(`  Files: Cover: ${p.cover ? '✅' : '❌'}, Video: ${p.video ? '✅' : '❌'}`);
            console.log('---');
          });
        }
        break;
      }

      default:
        console.log(`
🚀 Project Management Utility
----------------------------
Usage:
  npx tsx scripts/project-management.ts list
  npx tsx scripts/project-management.ts add <title> <description> <year> <creators> <categoryName> <coverPath> [videoPath] [link]
  npx tsx scripts/project-management.ts remove <projectId>

Note: 
- <creators> should be semicolon separated: "John Doe;Jane Smith"
- <categoryName> must already exist in the database.
        `);
        process.exit(1);
    }
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
