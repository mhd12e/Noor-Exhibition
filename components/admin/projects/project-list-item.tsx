"use client";

import { Project, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Video, Image as ImageIcon, ExternalLink, Link as LinkIcon } from "lucide-react";

interface ProjectListItemProps {
  project: Project;
  categories: Category[];
  publicUrl: string;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectListItem({ 
  project, 
  categories, 
  publicUrl, 
  onEdit, 
  onDelete 
}: ProjectListItemProps) {
  return (
    <div className="group flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all">
      <div className="flex items-center gap-6">
        {project.cover ? (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 shadow-sm">
            <img src={`${publicUrl}/imgs/${project.id}.png`} alt={project.title} className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
            <ImageIcon className="w-8 h-8 opacity-20" />
          </div>
        )}

        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-left">
            <h4 className="font-bold text-lg text-left">{project.title}</h4>
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full uppercase tracking-tighter text-left" dir="ltr">
              {project.year}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500 text-left" dir="ltr">
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-medium text-left">
              {categories.find(c => c.id === project.categoryId)?.name || "Uncategorized"}
            </span>
            
            {project.video && (
              <a href={`${publicUrl}/videos/${project.id}.mp4`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline font-medium text-left">
                <Video className="w-3.5 h-3.5" />
                View Video
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-zinc-500 hover:text-blue-500 hover:underline font-medium text-left">
                <LinkIcon className="w-3.5 h-3.5" />
                Website
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="icon" 
          variant="outline"
          className="h-9 w-9 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
          onClick={() => onEdit(project)}
        >
          <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          className="h-9 w-9 rounded-xl border-red-100 dark:border-red-900/30 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-all active:scale-95"
          onClick={() => onDelete(project.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
