import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { PrismaClient } from "@prisma/client";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is not set. Check your .env file.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const command = process.argv[2];

  try {
    switch (command) {
      case "add": {
        const name = process.argv.slice(3).join(" ");
        
        if (!name) {
          console.error("Usage: npx tsx scripts/category-management.ts add <name>");
          process.exit(1);
        }

        const category = await prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        });

        console.log(`✅ Category "${category.name}" has been added.`);
        break;
      }

      case "remove": {
        const name = process.argv.slice(3).join(" ");

        if (!name) {
          console.error("Usage: npx tsx scripts/category-management.ts remove <name>");
          process.exit(1);
        }

        try {
          const category = await prisma.category.findUnique({ where: { name } });
          if (!category) throw new Error("Not found");

          const projectCount = await prisma.project.count({ where: { categoryId: category.id } });
          if (projectCount > 0) {
            console.error(`❌ Error: Cannot delete category "${name}" because it is linked to ${projectCount} projects.`);
            process.exit(1);
          }

          await prisma.category.delete({ where: { name } });
          console.log(`✅ Category "${name}" has been removed.`);
        } catch (error) {
          console.error(`❌ Error: Category "${name}" not found.`);
        }
        break;
      }

      case "list": {
        const categories = await prisma.category.findMany({
          include: { _count: { select: { projects: true } } },
          orderBy: { name: "asc" }
        });

        if (categories.length === 0) {
          console.log("ℹ️ No categories found in the database.");
        } else {
          console.log("📂 Exhibition Categories:");
          categories.forEach((c) => console.log(`- ${c.name} (${c._count.projects} projects)`));
        }
        break;
      }

      default:
        console.log(`
🚀 Category Management Utility
-----------------------------
Usage:
  npx tsx scripts/category-management.ts add <name>
  npx tsx scripts/category-management.ts remove <name>
  npx tsx scripts/category-management.ts list
        `);
        process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
