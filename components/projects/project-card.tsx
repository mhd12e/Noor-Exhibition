"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  image: string;
}

export function ProjectCard({ title, description, category, image }: ProjectCardProps) {
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
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="ghost" size="sm" className="w-full justify-between group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400">
                <span>اقرأ المزيد</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
            </Button>
        </div>
      </div>
    </motion.div>
  );
}
