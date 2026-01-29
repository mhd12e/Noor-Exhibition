"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Calendar, MapPin, ChevronDown } from "lucide-react";

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 px-6 text-center bg-transparent">
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-md w-full space-y-6 z-10"
      >
        {/* Header Section */}
        <header className="space-y-4 relative flex flex-col items-center">
          
          {/* ... badge and banner ... */}
          <div className="relative inline-flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-40 animate-pulse" />
            {/* Animated Border Container */}
            <div className="relative p-[2px] rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <div className="absolute left-1/2 top-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-border-spin bg-[conic-gradient(from_var(--border-angle),#3b82f6,#8b5cf6,#ec4899,#3b82f6)]" />
              
              {/* Content Container */}
              <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-600/10" />
                <span>مدرسة النور الدولية</span>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="relative w-full h-32 sm:h-44 rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-white/10">
            <Image
              src="/reception-room.png"
              alt="معرض الابتكار"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          <h1 className="text-4xl font-medium tracking-tight sm:text-6xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent pt-4 pb-0 leading-normal">
            معرض الابتكار <span className="text-blue-600 dark:text-blue-500">2026</span>
          </h1>
        </header>

        {/* Description Section */}
        <section className="space-y-6">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[90%] mx-auto font-medium">
            مرحباً بكم في ملتقى العقول المبدعة. حيث تتحول الأفكار إلى واقع.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2">
                <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">2 - 4 فبراير</span>
             </div>
             
             <a 
               href="https://maps.app.goo.gl/37xxx8iU7f3FSrLQ9"
               target="_blank"
               rel="noopener noreferrer"
               className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2"
             >
                <div className="p-2.5 rounded-full bg-purple-50 dark:bg-purple-900/20">
                  <MapPin className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">الموقع</span>
             </a>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 justify-center pt-2">
          <Button className="flex-1 max-w-[160px] h-11 gap-2 text-sm font-bold shadow-lg shadow-blue-500/20">
            المشاريع
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="flex-1 max-w-[160px] h-11 text-sm font-bold">
            الجدول
          </Button>
        </div>
      </motion.div>

      {/* Scroll Indicator - Re-positioned for better visibility */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-bold">اسحب للأسفل</span>
        <ChevronDown className="w-8 h-8 text-blue-500 dark:text-blue-400 opacity-80" />
      </div>
    </section>
  );
}