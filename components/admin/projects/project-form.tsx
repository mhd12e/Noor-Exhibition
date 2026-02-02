"use client";

import { useState, useEffect } from "react";
import { Project, Category, ActionResponse } from "@/lib/types";
import { APP_CONFIG, REGEX } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, Video, Image as ImageIcon, X, AlertCircle, 
  LayoutGrid, Users, UserPlus, FileVideo 
} from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ProjectFormProps {
  project: Project | null;
  categories: Category[];
  onSubmit: (formData: FormData) => Promise<ActionResponse>;
  onCancel: () => void;
  publicUrl: string;
}

export function ProjectForm({ project, categories, onSubmit, onCancel, publicUrl }: ProjectFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creators, setCreators] = useState<string[]>([]);
  const [newCreator, setNewCreator] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [inputKeys, setInputKeys] = useState({ cover: 0, video: 0 });

  const years = Array.from({ length: APP_CONFIG.CURRENT_YEAR - APP_CONFIG.START_YEAR + 1 }, (_, i) => APP_CONFIG.START_YEAR + i);

  useEffect(() => {
    if (project) {
      setCreators(project.creators ? project.creators.split(";").filter(n => n.trim() !== "") : []);
    } else {
      setCreators([]);
    }
  }, [project]);

  const addCreator = () => {
    const name = newCreator.trim();
    if (!name) return;
    if (!REGEX.STUDENT_NAME.test(name)) {
      setNameError("Names can only contain letters and spaces.");
      return;
    }
    if (!creators.includes(name)) {
      setCreators([...creators, name]);
      setNewCreator("");
      setNameError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (creators.length === 0) {
      setError("Please add at least one student.");
      return;
    }

    if (!project && !selectedCover) {
      setError("Cover image is required.");
      return;
    }

    if (selectedCover && selectedCover.size > APP_CONFIG.MAX_COVER_SIZE) {
      setError("Cover image exceeds 3MB.");
      return;
    }

    if (selectedVideo && selectedVideo.size > APP_CONFIG.MAX_VIDEO_SIZE) {
      setError(`Video exceeds ${APP_CONFIG.MAX_VIDEO_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    setIsPending(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("creators", creators.join(";"));
      
      console.log("Submitting project form...");
      console.log("Title:", formData.get("title"));
      
      // Explicitly set the files to ensure they are captured regardless of DOM state
      if (selectedCover) {
        console.log("Attaching cover:", selectedCover.name, `(${selectedCover.size} bytes)`);
        formData.set("cover", selectedCover);
      }
      if (selectedVideo) {
        console.log("Attaching video:", selectedVideo.name, `(${selectedVideo.size} bytes)`);
        formData.set("video", selectedVideo);
      }

      if (project) {
        if (removeCover) formData.set("removeCover", "true");
        if (removeVideo) formData.set("removeVideo", "true");
      }
      
      const result = await onSubmit(formData);
      if (result && result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError("Failed to upload. Please check your connection and file size.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <DialogHeader className="text-left">
        <DialogTitle className="flex items-center gap-2 text-left" dir="ltr">
          <LayoutGrid className="w-5 h-5 text-blue-500" />
          {project ? "Edit Project" : "New Project"}
        </DialogTitle>
        <DialogDescription className="text-left" dir="ltr">
          Fill in the details for the student project. Images and videos will be processed automatically.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleFormSubmit} className="space-y-6 pt-4 text-left" dir="ltr">
        {error && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">Project Title</label>
            <Input name="title" defaultValue={project?.title} required placeholder="Enter project name" className="rounded-xl text-left" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">Exhibition Year</label>
            <select name="year" defaultValue={project?.year || APP_CONFIG.CURRENT_YEAR} className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all" required>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">Creators / Students</label>
          <div className="flex gap-2">
            <Input value={newCreator} onChange={(e) => {setNewCreator(e.target.value); setNameError(null);}} placeholder="Student name..." className={`rounded-xl text-left ${nameError ? "border-red-500" : ""}`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCreator(); } }} />
            <Button type="button" onClick={addCreator} variant="secondary" className="rounded-xl px-4 shrink-0"><UserPlus className="w-4 h-4" /></Button>
          </div>
          {nameError && <p className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" />{nameError}</p>}
          <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-dashed border-zinc-200 dark:border-zinc-800">
            {creators.map((name, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium animate-in fade-in zoom-in duration-200">
                <Users className="w-3 h-3 text-blue-500" />
                {name}
                <button type="button" onClick={() => setCreators(creators.filter(c => c !== name))} className="text-zinc-400 hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
              </div>
            ))}
            {creators.length === 0 && <span className="text-xs text-zinc-400 italic py-1">No students added yet</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">External Link (Optional)</label>
          <Input name="link" defaultValue={project?.link || ""} placeholder="https://..." className="rounded-xl text-left" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">Category</label>
          <select name="categoryId" defaultValue={project?.categoryId} className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all" required>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 block">Project Description</label>
          <Textarea name="description" defaultValue={project?.description} required placeholder="Describe the innovation..." className="min-h-[120px] rounded-xl text-left" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Cover Image (Max 3MB)</label>
            
            {/* Existing Cover Display */}
            {project?.cover && !removeCover && (
              <div className="space-y-2">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <img src={`${publicUrl}/imgs/${project.id}.png`} alt="Current" className="object-cover w-full h-full" />
                </div>
                <button type="button" onClick={() => setRemoveCover(true)} className="text-[10px] font-bold text-red-500 underline uppercase">Delete Image</button>
              </div>
            )}

            {/* New Cover Upload/Preview */}
            {(!project?.cover || removeCover) && (
              <div className="space-y-2">
                {selectedCover ? (
                  <div className="space-y-2">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50">
                      <img src={URL.createObjectURL(selectedCover)} alt="Preview" className="object-cover w-full h-full" onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                    </div>
                    <button type="button" onClick={() => {setSelectedCover(null); setInputKeys(k => ({...k, cover: k.cover+1}))}} className="text-[10px] font-bold text-red-500 underline uppercase">Clear Selection</button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input 
                      key={inputKeys.cover} 
                      name="cover" 
                      type="file" 
                      accept="image/*" 
                      className="cursor-pointer rounded-xl" 
                      required={!project?.cover || removeCover} 
                      onChange={(e) => setSelectedCover(e.target.files?.[0] || null)} 
                    />
                    {removeCover && (
                      <div className="flex items-center justify-between px-1 mt-2">
                        <p className="text-[10px] font-bold text-red-500 uppercase">Existing cover will be deleted</p>
                        <button type="button" onClick={() => setRemoveCover(false)} className="text-[10px] font-bold text-zinc-500 underline uppercase">Undo</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Hidden actual file inputs to ensure FormData always has them if they were selected but the UI changed */}
            {selectedCover && <input type="file" name="cover-hidden" className="hidden" />}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Video className="w-4 h-4" /> Video (Max 100MB, MP4) <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">OPTIONAL</span></label>
            
            {/* Existing Video Display */}
            {project?.video && !removeVideo && (
              <div className="space-y-2">
                <div className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4">
                  <Video className="w-4 h-4 text-blue-500 mr-2" /><span className="text-xs font-bold uppercase text-blue-500">Video Uploaded</span>
                </div>
                <button type="button" onClick={() => setRemoveVideo(true)} className="text-[10px] font-bold text-red-500 underline uppercase">Delete Video</button>
              </div>
            )}

            {/* New Video Upload/Preview */}
            {(!project?.video || removeVideo) && (
              <div className="space-y-2">
                {selectedVideo ? (
                  <div className="space-y-2">
                    <div className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-blue-50 flex items-center px-4">
                      <FileVideo className="w-4 h-4 text-blue-600 mr-2" /><span className="text-xs font-bold uppercase text-blue-600 truncate">{selectedVideo.name}</span>
                    </div>
                    <button type="button" onClick={() => {setSelectedVideo(null); setInputKeys(k => ({...k, video: k.video+1}))}} className="text-[10px] font-bold text-red-500 underline uppercase">Clear Selection</button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input 
                      key={inputKeys.video} 
                      name="video" 
                      type="file" 
                      accept="video/*" 
                      className="cursor-pointer rounded-xl" 
                      onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)} 
                    />
                    {removeVideo && (
                      <div className="flex items-center justify-between px-1 mt-2">
                        <p className="text-[10px] font-bold text-red-500 uppercase">Existing video will be deleted</p>
                        <button type="button" onClick={() => setRemoveVideo(false)} className="text-[10px] font-bold text-zinc-500 underline uppercase">Undo</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4 sm:justify-end gap-3 flex-row">
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">Cancel</Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px] rounded-xl font-bold">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : project ? "Update Project" : "Create Project"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
