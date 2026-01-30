import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "معرض الابتكار 2026 | مدرسة النور الدولية",
  description: "النسخة السنوية لعام 2026 من معرض الابتكار في مدرسة النور الدولية",
};

import { MainWrapper } from "@/components/layout/main-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${rubik.variable} antialiased bg-white dark:bg-zinc-950 text-foreground overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/30 dark:selection:text-blue-100 font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Fixed Living Background Layer - Global */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl dark:bg-blue-500/10 mix-blend-multiply dark:mix-blend-normal animate-blob" />
            <div className="absolute top-1/2 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl dark:bg-purple-500/10 mix-blend-multiply dark:mix-blend-normal animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl dark:bg-pink-500/10 mix-blend-multiply dark:mix-blend-normal animate-blob animation-delay-4000" />
          </div>

          <MobileNav />
          
          <MainWrapper>
            {children}
            <SiteFooter />
          </MainWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
