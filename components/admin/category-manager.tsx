"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Plus, Loader2, AlertCircle, Tags } from "lucide-react";
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

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsPending(true);
    setError(null);
    
    let result;
    if (editingCat) {
      result = await updateCategory(editingCat.id, name);
    } else {
      result = await createCategory(name);
    }

    if (result?.error) {
      setError(result.error);
    } else {
      setName("");
      setEditingCat(null);
      setIsFormOpen(false);
    }
    setIsPending(false);
  }

  async function handleDelete() {
    if (!deletingId) return;
    setIsPending(true);
    setError(null);
    const result = await deleteCategory(deletingId);
    if (result?.error) {
      setError(result.error);
    } else {
      setDeletingId(null);
    }
    setIsPending(false);
  }

  return (
    <div className="space-y-8" dir="ltr">
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-left">
          <h3 className="text-lg font-bold">Categories</h3>
          <p className="text-xs text-zinc-500 text-left" dir="ltr">Organize your projects with tags</p>
        </div>
        <Button onClick={() => { setEditingCat(null); setName(""); setIsFormOpen(true); setError(null); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-2" /> New Category
        </Button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Tags className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm">{cat.name}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
                onClick={() => {
                  setEditingCat(cat);
                  setName(cat.name);
                  setError(null);
                  setIsFormOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-xl border-red-100 dark:border-red-900/30 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-all active:scale-95"
                onClick={() => {
                  setDeletingId(cat.id);
                  setError(null);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 text-sm">No categories yet.</p>
          </div>
        )}
      </div>

      {/* Upsert Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent 
          className="max-w-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-left">{editingCat ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription className="text-left" dir="ltr">
              {editingCat ? "Change the name of your category." : "Add a new category to group your projects."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4" dir="ltr">
            <div className="space-y-2 text-left">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-left block">Category Name</label>
              <Input
                placeholder="e.g. Robotics, AI, Physics..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl h-12 text-left"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter className="pt-4 sm:justify-end gap-3 flex-row" dir="ltr">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" disabled={isPending} className="rounded-xl px-8 font-bold">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCat ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-md border-red-100 dark:border-red-900/30" dir="ltr">
          <DialogHeader className="text-left">
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
              <Trash2 className="w-5 h-5" />
              Delete Category?
            </DialogTitle>
            <DialogDescription className="text-left" dir="ltr">
              This action cannot be undone. You will only be able to delete this category if it is not linked to any projects.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <DialogFooter className="mt-6 sm:justify-end gap-3 flex-row" dir="ltr">
            <Button variant="ghost" onClick={() => setDeletingId(null)} className="rounded-xl">Cancel</Button>
            <Button 
              variant="outline" 
              onClick={handleDelete} 
              disabled={isPending} 
              className="rounded-xl font-bold px-8 border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}