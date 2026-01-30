"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVideoPage = pathname.startsWith("/projects/") && pathname.split("/").length > 2;

  return (
    <div className={cn(
      "relative z-10 min-h-screen flex flex-col",
      !isVideoPage && "pt-16"
    )}>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
