"use client";

import { useState, useEffect, useRef } from "react";
import { createProject, updateProject, deleteProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Plus, Loader2, Video, Image as ImageIcon, X, ExternalLink, AlertCircle, LayoutGrid, Users, UserPlus, Link as LinkIcon, FileVideo } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  year: number;
  creators: string;
  link: string | null;
  categoryId: string;
  video: boolean;
  cover: boolean;
}

export function ProjectManager({ 
  projects, 
  categories 
}: { 
  projects: Project[], 
  categories: Category[] 
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [creators, setCreators] = useState<string[]>([]);
  const [newCreator, setNewCreator] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  
  const [removeCover, setRemoveCover] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);

  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [coverInputKey, setCoverInputKey] = useState(0);
  const [videoInputKey, setVideoInputKey] = useState(0);
  
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i);

  useEffect(() => {
    if (editingProject) {
      setCreators(editingProject.creators ? editingProject.creators.split(";").filter(n => n.trim() !== "") : []);
    } else {
      setCreators([]);
    }
    setRemoveCover(false);
    setRemoveVideo(false);
    setSelectedCover(null);
    setSelectedVideo(null);
    setCoverInputKey(prev => prev + 1);
    setVideoInputKey(prev => prev + 1);
  }, [editingProject, isFormOpen]);

  const addCreator = () => {
    const name = newCreator.trim();
    if (!name) return;

    setNameError(null);
    const nameRegex = /^[a-zA-Z\s\u0600-\u06FF]+$/;
    if (!nameRegex.test(name)) {
      setNameError("Names can only contain letters and spaces.");
      return;
    }

    if (!creators.includes(name)) {
      setCreators([...creators, name]);
      setNewCreator("");
    }
  };

  const removeCreatorName = (name: string) => {
    setCreators(creators.filter(c => c !== name));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setNameError(null);
    const formData = new FormData(e.currentTarget);
    
    formData.set("creators", creators.join(";"));
    
    if (editingProject) {
      if (removeCover) formData.set("removeCover", "true");
      if (removeVideo) formData.set("removeVideo", "true");
    }
    
    let result;
    if (editingProject) {
      result = await updateProject(editingProject.id, formData);
    } else {
      result = await createProject(formData);
    }

    if (result?.error) {
      setError(result.error);
    } else {
      setIsFormOpen(false);
      setEditingProject(null);
    }
    setIsPending(false);
  }

  async function handleDelete() {
    if (!deletingId) return;
    setIsPending(true);
    const result = await deleteProject(deletingId);
    if (result?.error) {
      alert(result.error);
    } else {
      setDeletingId(null);
    }
    setIsPending(false);
  }

  return (
    <div className="space-y-8" dir="ltr">
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-left">
          <h3 className="text-lg font-bold">Projects</h3>
          <p className="text-xs text-zinc-500 text-left" dir="ltr">Showcase student innovations</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); setError(null); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setIsFormOpen(false); setEditingProject(null); } }}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto" 
          dir="ltr"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-left" dir="ltr">
              <LayoutGrid className="w-5 h-5 text-blue-500" />
              {editingProject ? "Edit Project" : "New Project"}
            </DialogTitle>
            <DialogDescription className="text-left" dir="ltr">
              Fill in the details for the student project. Images and videos will be processed automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-left" dir="ltr">
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-left" dir="ltr">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block" dir="ltr">Project Title</label>
                <Input name="title" defaultValue={editingProject?.title} required placeholder="Enter project name" className="rounded-xl text-left" dir="ltr" />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block" dir="ltr">Exhibition Year</label>
                <select 
                  name="year" 
                  defaultValue={editingProject?.year || currentYear}
                  className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 transition-all shadow-sm text-left"
                  required
                  dir="ltr"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block" dir="ltr">Creators / Students</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    value={newCreator} 
                    onChange={(e) => {
                      setNewCreator(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    placeholder="Student name..." 
                    className={`rounded-xl text-left ${nameError ? "border-red-500 focus:ring-red-500" : ""}`}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCreator(); } }}
                  />
                  <Button type="button" onClick={addCreator} variant="secondary" className="rounded-xl px-4 shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
                {nameError && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter px-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {nameError}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-dashed border-zinc-200 dark:border-zinc-800">
                {creators.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium animate-in fade-in zoom-in duration-200">
                    <Users className="w-3 h-3 text-blue-500" />
                    {name}
                    <button type="button" onClick={() => removeCreatorName(name)} className="text-zinc-400 hover:text-red-500 transition-colors ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {creators.length === 0 && <span className="text-xs text-zinc-400 italic py-1">No students added yet</span>}
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block" dir="ltr">External Link (Optional)</label>
              <Input name="link" defaultValue={editingProject?.link || ""} placeholder="https://..." className="rounded-xl text-left" dir="ltr" />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block" dir="ltr">Category</label>
              <select 
                name="categoryId" 
                defaultValue={editingProject?.categoryId}
                className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 transition-all shadow-sm text-left"
                required
                dir="ltr"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block" dir="ltr">Project Description</label>
              <Textarea 
                name="description" 
                defaultValue={editingProject?.description} 
                required 
                placeholder="Describe the innovation..."
                className="min-h-[120px] rounded-xl text-left"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 text-left" dir="ltr">
                  <ImageIcon className="w-4 h-4 text-zinc-500" /> Cover Image (Max 3MB)
                </label>
                
                {editingProject?.cover && !removeCover ? (
                  <div className="space-y-2">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                      <img src={`${publicUrl}/imgs/${editingProject.id}.png`} alt="Current cover" className="object-cover w-full h-full" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setRemoveCover(true)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 underline uppercase tracking-tighter"
                    >
                      Delete Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCover ? (
                      <div className="space-y-2">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center">
                           <img 
                             src={URL.createObjectURL(selectedCover)} 
                             alt="Selected preview" 
                             className="object-cover w-full h-full"
                             onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                           />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setSelectedCover(null); setCoverInputKey(k => k + 1); }}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 underline uppercase tracking-tighter"
                        >
                          Clear Selection
                        </button>
                      </div>
                    ) : (
                      <>
                        <Input 
                          key={coverInputKey}
                          name="cover" 
                          type="file" 
                          accept="image/*" 
                          className="cursor-pointer rounded-xl text-left" 
                          dir="ltr" 
                          required={!editingProject?.cover || removeCover} 
                          onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                        />
                        {removeCover && (
                          <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Existing cover will be deleted</p>
                            <button type="button" onClick={() => setRemoveCover(false)} className="text-[10px] font-bold text-zinc-500 underline uppercase">Undo</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 text-left" dir="ltr">
                  <Video className="w-4 h-4 text-zinc-500" /> Video (Max 50MB, MP4) <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">OPTIONAL</span>
                </label>

                {editingProject?.video && !removeVideo ? (
                  <div className="space-y-2">
                    <div className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4">
                      <Video className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-tighter text-blue-500">Video Uploaded</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setRemoveVideo(true)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 underline uppercase tracking-tighter"
                    >
                      Delete Video
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedVideo ? (
                      <div className="space-y-2">
                        <div className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-blue-50 dark:bg-blue-900/20 flex items-center px-4">
                          <FileVideo className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-xs font-bold uppercase tracking-tighter text-blue-600 truncate">{selectedVideo.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setSelectedVideo(null); setVideoInputKey(k => k + 1); }}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 underline uppercase tracking-tighter"
                        >
                          Clear Selection
                        </button>
                      </div>
                    ) : (
                      <>
                        <Input 
                          key={videoInputKey}
                          name="video" 
                          type="file" 
                          accept="video/mp4" 
                          className="cursor-pointer rounded-xl text-left" 
                          dir="ltr" 
                          onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                        />
                        {removeVideo && (
                          <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Existing video will be deleted</p>
                            <button type="button" onClick={() => setRemoveVideo(false)} className="text-[10px] font-bold text-zinc-500 underline uppercase">Undo</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4 sm:justify-end gap-3 flex-row" dir="ltr">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px] rounded-xl font-bold">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingProject ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
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
              disabled={isPending} 
              className="rounded-xl font-bold px-8 border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="group flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all"
          >
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
                    <a 
                      href={`${publicUrl}/videos/${project.id}.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline font-medium text-left"
                      dir="ltr"
                    >
                      <Video className="w-3.5 h-3.5" />
                      View Video
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-zinc-500 hover:text-blue-500 hover:underline font-medium text-left"
                      dir="ltr"
                    >
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
                onClick={() => {
                  setEditingProject(project);
                  setIsFormOpen(true);
                  setError(null);
                  setNameError(null);
                }}
              >
                <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </Button>
              <Button 
                size="icon" 
                variant="outline"
                className="h-9 w-9 rounded-xl border-red-100 dark:border-red-900/30 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-all active:scale-95"
                onClick={() => setDeletingId(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
