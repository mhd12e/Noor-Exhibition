"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import Image from "next/image";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ["hero", "about", "schedule"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 50) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href === "/" || href === "/#top") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }

    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const isHome = pathname === "/" || pathname === path;
      
      if (isHome) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  const isItemActive = (href: string) => {
    if (pathname === "/projects" && href === "/projects") return true;
    if (pathname === "/") {
      if (href === "/") {
        return activeSection === "" || activeSection === "#hero";
      }
      return href.endsWith(activeSection) && activeSection !== "";
    }
    return false;
  };

  if (pathname.startsWith("/projects/") && pathname.split("/").length > 2) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div 
            className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-70"
            onClick={() => {
                if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
                else router.push("/");
            }}
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg">
              معرض الابتكار
            </span>
          </div>
        </div>
        <ModeToggle />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            
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
                {NAV_ITEMS.map((item) => {
                  const active = isItemActive(item.href);
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavigation(e, item.href)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                        "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300",
                        active ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </a>
                  );
                })}
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
