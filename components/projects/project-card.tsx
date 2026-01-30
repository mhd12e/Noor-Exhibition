"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  cover: boolean;
  video: boolean;
}

export function ProjectCard({ id, title, description, category, cover }: ProjectCardProps) {
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  const imageUrl = cover ? `${publicUrl}/imgs/${id}.png` : "/reception-room.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all"
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {cover ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 text-right" dir="rtl">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed h-10">
          {description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link href={`/projects/${id}`}>
            <Button 
              variant="outline" 
              className="w-full h-11 rounded-2xl font-bold border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800/50 shadow-sm transition-all active:scale-[0.98]"
            >
              التفاصيل
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
