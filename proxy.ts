import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Matches all routes except api, _next/static, _next/image, and public files like favicon.ico
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
