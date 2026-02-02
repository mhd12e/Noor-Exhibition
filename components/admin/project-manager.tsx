"use client";

import { useState } from "react";
import { Project, Category } from "@/lib/types";
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "./projects/project-form";
import { ProjectListItem } from "./projects/project-list-item";

interface ProjectManagerProps {
  projects: Project[];
  categories: Category[];
  publicUrl: string;
}

export function ProjectManager({ projects, categories, publicUrl }: ProjectManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // No longer using process.env here directly to avoid build-time inlining issues

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    await deleteProject(deletingId);
    setDeletingId(null);
    setIsDeleting(false);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      let result;
      if (editingProject) {
        result = await updateProject(editingProject.id, formData);
      } else {
        result = await createProject(formData);
      }

      if (result && !result.error) {
        setIsFormOpen(false);
        setEditingProject(null);
      }
      return result;
    } catch (e: any) {
      console.error("Project submission error:", e);
      return { error: e.message || "An unexpected server error occurred" };
    }
  };

  return (
    <div className="space-y-8" dir="ltr">
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-left">
          <h3 className="text-lg font-bold">Projects</h3>
          <p className="text-xs text-zinc-500 text-left" dir="ltr">Showcase student innovations</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setIsFormOpen(false); setEditingProject(null); } }}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto" 
          dir="ltr"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ProjectForm 
            project={editingProject} 
            categories={categories} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsFormOpen(false)}
            publicUrl={publicUrl}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }}>
        <DialogContent className="max-w-md" dir="ltr">
          <DialogHeader className="text-left">
            <DialogTitle className="text-red-600 flex items-center gap-2 text-left" dir="ltr">
              <Trash2 className="w-5 h-5" />
              Delete Project?
            </DialogTitle>
            <DialogDescription className="text-left" dir="ltr">
              Are you sure you want to delete this project? This will permanently remove all associated media from storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-end gap-3 flex-row" dir="ltr">
            <Button variant="ghost" onClick={() => setDeletingId(null)} className="rounded-xl">Cancel</Button>
            <Button 
              variant="outline" 
              onClick={handleDelete} 
              disabled={isDeleting} 
              className="rounded-xl font-bold px-8 border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {projects.map((project) => (
          <ProjectListItem 
            key={project.id} 
            project={project} 
            categories={categories} 
            publicUrl={publicUrl} 
            onEdit={handleEdit} 
            onDelete={setDeletingId} 
          />
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 text-sm text-center" dir="ltr">No projects found. Start by adding a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
