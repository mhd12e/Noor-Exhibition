"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  // Hide on video player pages
  if (pathname.startsWith("/projects/") && pathname.split("/").length > 2) {
    return null;
  }

  return (
    <footer className="py-8 bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-md text-center border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 space-y-2">
        <p className="text-zinc-500 text-sm">
          &copy; 2026 مدرسة النور الدولية
        </p>
        <p className="text-zinc-400 text-xs">
          صنع من قبل{" "}
          <a 
            href="https://mhd12.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            mhd12
          </a>{" "}
          من فريق{" "}
          <a 
            href="https://team.mhd12.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Al Noor Innovators Team
          </a>
        </p>
      </div>
    </footer>
  );
}
