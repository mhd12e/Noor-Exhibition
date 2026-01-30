"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle2, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/lib/actions/reviews";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  stars: number;
  reason: string;
}

export function RatingView({ existingReview }: { existingReview: Review | null }) {
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [reason, setReason] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(!!existingReview);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stars === 0) return;

    setIsPending(true);
    const result = await submitReview(stars, reason);
    if (result.success) {
      setSuccess(true);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  if (success || existingReview) {
    const displayStars = existingReview?.stars || stars;
    const displayReason = existingReview?.reason || reason;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center shadow-xl"
      >
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-2">شكراً لتقييمك!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">تم استلام رأيك بنجاح، نحن نقدر وقتك ومساهمتك.</p>
        
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 text-right space-y-4">
          <div className="flex flex-row-reverse justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={cn(
                  "w-6 h-6",
                  s <= displayStars ? "fill-yellow-400 text-yellow-400" : "text-zinc-300 dark:text-zinc-700"
                )} 
              />
            ))}
          </div>
          {displayReason && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-400 uppercase mb-1">رأيك:</p>
              <p className="text-zinc-700 dark:text-zinc-300">{displayReason}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button 
            variant="outline" 
            className="w-full rounded-2xl h-12 font-bold gap-2"
            onClick={() => window.location.href = "/"}
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl w-full">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-medium text-zinc-900 dark:text-white sm:text-5xl tracking-tight">
          ما هو <span className="text-blue-600">رأيك؟</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          ساعدنا في تحسين تجربة المعرض من خلال مشاركة تقييمك ورأيك الصادق.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-8">
        {/* Star Selector */}
        <div className="space-y-4 text-center">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">اختر عدد النجوم</label>
          <div className="flex flex-row-reverse justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHoveredStars(s)}
                onMouseLeave={() => setHoveredStars(0)}
                onClick={() => setStars(s)}
                className="relative p-1 transition-transform active:scale-90 hover:scale-110"
              >
                <Star 
                  className={cn(
                    "w-12 h-12 transition-colors",
                    s <= (hoveredStars || stars) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-zinc-200 dark:text-zinc-800"
                  )} 
                />
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-blue-600 h-5">
            {stars === 1 && "سيء جداً"}
            {stars === 2 && "سيء"}
            {stars === 3 && "جيد"}
            {stars === 4 && "جيد جداً"}
            {stars === 5 && "ممتاز!"}
          </p>
        </div>

        {/* Reason */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest mr-1">لماذا اخترت هذا التقييم؟ (اختياري)</label>
          <div className="relative">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب ملاحظاتك هنا..."
              className="min-h-[150px] rounded-3xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-blue-500 focus:border-blue-500 text-lg p-6 transition-all"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={stars === 0 || isPending}
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 gap-3 group"
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              إرسال التقييم
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
