"use client";

import React, { useState } from "react";
import { Menu, X, Home, Info, Calendar, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "عن المعرض", href: "/#about", icon: Info }, // Updated to absolute path for hash
  { name: "الجدول الزمني", href: "/#schedule", icon: Calendar },
  { name: "المشاريع", href: "/projects", icon: Lightbulb },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Handle Home/Top Scroll
    if (href === "/" || href === "/#top") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }

    // Handle Hash Links (on same page or different page)
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      
      // If we are already on the path, just scroll
      if (pathname === path || (path === "/" && pathname === "/")) {
        const element = document.querySelector(`#${hash}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // If on different page, push the full path (nextjs handles hash scroll usually, or we might need a useEffect)
        router.push(href);
      }
    } else {
        // Standard Navigation
        router.push(href);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <span 
            className="font-bold text-lg cursor-pointer transition-opacity hover:opacity-70"
            onClick={() => {
                if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
                else router.push("/");
            }}
          >
            معرض الابتكار
          </span>
        </div>
        <ModeToggle />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">القائمة</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item.href)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300",
                      pathname === item.href ? "bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400" : ""
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </a>
                ))}
              </nav>
              
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="text-center text-xs text-zinc-400">
                    &copy; 2026 مدرسة النور الدولية
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
