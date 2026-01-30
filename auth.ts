import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "@/lib/db";
import argon2 from "argon2";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.log("User not found:", email);
            return null;
          }
          
          const passwordsMatch = await argon2.verify(user.password, password);

          if (passwordsMatch) return user;
          
          console.log("Password mismatch for user:", email);
        }

        return null;
      },
    }),
  ],
});
