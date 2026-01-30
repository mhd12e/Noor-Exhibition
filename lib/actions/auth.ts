"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

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
