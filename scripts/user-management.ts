import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string) =>
  new Promise<string>((resolve) => rl.question(query, resolve));

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
        const email = process.argv[3];
        
        if (!email) {
          console.error("Usage: npx tsx scripts/user-management.ts add <email>");
          process.exit(1);
        }

        const password = await askQuestion(`Enter password for ${email}: `);
        
        if (!password || password.length < 6) {
          console.error("❌ Error: Password must be at least 6 characters.");
          process.exit(1);
        }

        const hashedPassword = await argon2.hash(password);
        const user = await prisma.user.upsert({
          where: { email },
          update: { password: hashedPassword },
          create: { email, password: hashedPassword },
        });

        console.log(`✅ User ${user.email} has been added/updated.`);
        break;
      }

      case "remove": {
        const email = process.argv[3];

        if (!email) {
          console.error("Usage: npx tsx scripts/user-management.ts remove <email>");
          process.exit(1);
        }

        try {
          await prisma.user.delete({ where: { email } });
          console.log(`✅ User ${email} has been removed.`);
        } catch (error) {
          console.error(`❌ Error: User ${email} not found.`);
        }
        break;
      }

      case "list": {
        const users = await prisma.user.findMany({
          select: { id: true, email: true },
        });

        if (users.length === 0) {
          console.log("ℹ️ No users found in the database.");
        } else {
          console.log("👥 Registered Users:");
          users.forEach((u) => console.log(`- ${u.email} (ID: ${u.id})`));
        }
        break;
      }

      default:
        console.log(`
🚀 User Management Utility
-------------------------
Usage:
  npx tsx scripts/user-management.ts add <email>
  npx tsx scripts/user-management.ts remove <email>
  npx tsx scripts/user-management.ts list
        `);
        process.exit(1);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});