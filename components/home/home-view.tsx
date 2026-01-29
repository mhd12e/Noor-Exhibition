"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Calendar, MapPin } from "lucide-react";

export function HomeView() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-md w-full space-y-8"
      >
        {/* Header Section */}
        <motion.header variants={item} className="space-y-6 relative flex flex-col items-center">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl dark:bg-blue-500/10 mix-blend-multiply dark:mix-blend-normal animate-blob" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl dark:bg-purple-500/10 mix-blend-multiply dark:mix-blend-normal animate-blob animation-delay-2000" />
          <div className="absolute top-20 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl dark:bg-pink-500/10 mix-blend-multiply dark:mix-blend-normal animate-blob animation-delay-4000 hidden sm:block" />
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group inline-flex items-center justify-center z-10"
          >
            {/* Glow Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
            
            {/* Animated Border Container */}
            <div className="relative p-[2px] rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <div className="absolute inset-[-100%] animate-border-spin bg-[conic-gradient(from_var(--border-angle),#3b82f6,#8b5cf6,#ec4899,#3b82f6)]" />
              
              {/* Content Container */}
              <div className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-zinc-950 text-blue-700 dark:text-blue-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-600/10" />
                <span>مدرسة النور الدولية</span>
              </div>
            </div>
          </motion.div>

          {/* Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full h-32 sm:h-40 rounded-3xl overflow-hidden shadow-lg shadow-blue-500/10 border border-white/20 dark:border-white/10"
          >
            <Image
              src="/reception-room.png"
              alt="معرض الابتكار - القاعة الرئيسية"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Gradient for better text contrast if needed, or just style */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent pb-2">
            معرض الابتكار <br/>
            <span className="text-blue-600 dark:text-blue-500">2026</span>
          </h1>
        </motion.header>

        {/* Description Section */}
        <motion.section variants={item} className="space-y-8">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            مرحباً بكم في ملتقى العقول المبدعة. حيث تتحول الأفكار إلى واقع، ونرسم معاً ملامح مستقبل مشرق بأيدي طلابنا الموهوبين.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
             <motion.div 
               whileHover={{ y: -5, scale: 1.02 }}
               className="group p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 flex flex-col items-center gap-2 cursor-default"
             >
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">2 - 4 فبراير 2026</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">3 أيام من الإبداع</span>
                </div>
             </motion.div>
             
             <motion.a 
               href="https://maps.app.goo.gl/37xxx8iU7f3FSrLQ9"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ y: -5, scale: 1.02 }}
               className="group p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer"
             >
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  <MapPin className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">موقع المدرسة</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">افتح في الخرائط</span>
                </div>
             </motion.a>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-semibold shadow-lg shadow-blue-500/20">
            تصفح المشاريع
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
            جدول الفعاليات
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
