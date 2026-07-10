import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, MessageSquareQuote, Send, Star, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteReview, useMyReview, useSubmitReview } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MIN_REVIEW_LENGTH = 20;
const MAX_REVIEW_LENGTH = 1000;

function ReviewVisibility({ isFeatured }: { isFeatured: boolean }) {
  const config = isFeatured
    ? {
      icon: Eye,
      label: "Featured on the homepage",
      detail: "Your review is currently visible on the gym homepage.",
      className: "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]",
    }
    : {
      icon: EyeOff,
      label: "Review saved",
      detail: "Your gym can feature this review on the homepage.",
      className: "border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[#00BFFF]",
    };
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-3 rounded-lg border px-4 py-3", config.className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="text-xs font-black uppercase">{config.label}</p>
        <p className="mt-1 text-xs text-gray-400">{config.detail}</p>
      </div>
    </div>
  );
}

export default function MemberReview() {
  const reviewQuery = useMyReview();
  const submitReview = useSubmitReview();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();
  const existingReview = reviewQuery.data?.review;
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!existingReview) return;
    setRating(existingReview.rating);
    setContent(existingReview.content);
  }, [existingReview]);

  const trimmedLength = content.trim().length;
  const isValid = rating >= 1 && rating <= 5 && trimmedLength >= MIN_REVIEW_LENGTH && trimmedLength <= MAX_REVIEW_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    submitReview.mutate(
      { rating, content: content.trim() },
      {
        onSuccess: () => toast({ title: existingReview ? "Review updated" : "Review submitted", description: "Your review has been saved." }),
        onError: (error) => toast({ title: "Could not submit review", description: error.message, variant: "destructive" }),
      },
    );
  };

  const handleDelete = () => {
    if (!existingReview) return;

    deleteReview.mutate(undefined, {
      onSuccess: () => {
        setRating(0);
        setContent("");
        setDeleteDialogOpen(false);
        toast({ title: "Review deleted" });
      },
      onError: (error) => toast({ title: "Could not delete review", description: error.message, variant: "destructive" }),
    });
  };

  if (reviewQuery.isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="member-review-panel">
      <div className="glass-card flex items-center gap-4 rounded-2xl border border-white/5 p-5 shadow-xl">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#00BFFF]/20 bg-[#00BFFF]/10">
          <MessageSquareQuote className="h-5 w-5 text-[#00BFFF]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-black uppercase tracking-tight text-white">My Review</h1>
          <p className="mt-1 text-xs text-gray-500">Share your experience with your gym.</p>
        </div>
      </div>

      {reviewQuery.isError && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {reviewQuery.error.message}
        </div>
      )}

      {existingReview && <ReviewVisibility isFeatured={existingReview.isFeatured} />}

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 shadow-2xl sm:p-6">
        <div className="border-b border-white/5 pb-5">
          <label className="text-xs font-black uppercase tracking-wider text-white">Your rating</label>
          <div className="mt-3 flex h-11 items-center gap-1" role="radiogroup" aria-label="Review rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                onClick={() => setRating(value)}
                className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF]"
              >
                <Star className={cn("h-6 w-6", value <= rating ? "fill-amber-400 text-amber-400" : "text-gray-700")} />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-5">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="review-content" className="text-xs font-black uppercase tracking-wider text-white">Your review</label>
            <span className={cn("font-mono text-[10px]", trimmedLength > MAX_REVIEW_LENGTH ? "text-red-400" : "text-gray-500")}>
              {content.length}/{MAX_REVIEW_LENGTH}
            </span>
          </div>
          <textarea
            id="review-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={MAX_REVIEW_LENGTH}
            rows={7}
            placeholder="Tell us about the training, facilities, staff, or your progress..."
            className="mt-3 w-full resize-y rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-[#00BFFF]/50 focus:ring-1 focus:ring-[#00BFFF]/30"
          />
          <p className="mt-2 text-[11px] text-gray-500">Minimum {MIN_REVIEW_LENGTH} characters.</p>
        </div>

        {existingReview?.isFeatured && (
          <p className="mt-5 rounded-lg border border-amber-400/10 bg-amber-400/5 px-3 py-2 text-xs text-gray-400">
            Saving changes will hide this review from the homepage until your gym features the updated version.
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {existingReview ? (
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={(open) => {
                if (!deleteReview.isPending) setDeleteDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={submitReview.isPending || deleteReview.isPending}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-400/5 px-4 text-xs font-black text-red-300 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Review
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-red-400/20 bg-[#090909] text-white sm:max-w-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base font-black uppercase tracking-tight">Delete Review?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500">
                    This will remove your review from the gym and the homepage if it is currently featured.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:space-x-0">
                  <AlertDialogCancel
                    disabled={deleteReview.isPending}
                    className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteReview.isPending}
                    onClick={(event) => {
                      event.preventDefault();
                      handleDelete();
                    }}
                    className="bg-red-500 text-white hover:bg-red-400 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {deleteReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete Review
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={!isValid || submitReview.isPending || deleteReview.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-5 text-xs font-black text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {existingReview ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
