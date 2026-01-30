"use client";

import { Star, Calendar, Trash2, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/lib/actions/reviews";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  stars: number;
  reason: string;
  createdAt: Date;
}

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  async function handleDelete() {
    if (!deletingId) return;
    setIsDeleting(deletingId);
    await deleteReview(deletingId);
    setDeletingId(null);
    setIsDeleting(null);
  }

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Exhibition Reviews</h2>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Total: {reviews.length}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Feedback / Reason</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={cn(
                            "w-4 h-4",
                            s <= review.stars ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 dark:text-zinc-800"
                          )} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-700 dark:text-zinc-300 max-w-md break-words line-clamp-2 hover:line-clamp-none transition-all">
                      {review.reason || <span className="text-zinc-400 italic text-xs">No comments provided</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-500 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(review.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={isDeleting === review.id}
                      className="h-9 w-9 rounded-xl border-red-100 dark:border-red-900/30 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-all active:scale-95"
                      onClick={() => setDeletingId(review.id)}
                    >
                      {isDeleting === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                    No reviews have been submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }}>
        <DialogContent className="max-w-md" dir="ltr">
          <DialogHeader className="text-left">
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Delete Review?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this feedback? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-end gap-3 flex-row" dir="ltr">
            <Button variant="ghost" onClick={() => setDeletingId(null)} className="rounded-xl">Cancel</Button>
            <Button 
              variant="outline" 
              onClick={handleDelete} 
              disabled={!!isDeleting} 
              className="rounded-xl font-bold px-8 border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-all"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
