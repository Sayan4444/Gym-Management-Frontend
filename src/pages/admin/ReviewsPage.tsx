import { useMemo, useState } from "react";
import { Loader2, MessageSquareQuote, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Review } from "@/data/types";
import { useModerateReview, useReviews } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { cn, formatDate } from "@/lib/utils";

type ReviewFilter = "All" | "Featured" | "Hidden";

const filters: ReviewFilter[] = ["All", "Featured", "Hidden"];
const EMPTY_REVIEWS: Review[] = [];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState<ReviewFilter>("All");
  const reviewsQuery = useReviews();
  const moderateReview = useModerateReview();
  const { toast } = useToast();
  const reviews = reviewsQuery.data?.reviews ?? EMPTY_REVIEWS;

  const filteredReviews = useMemo(() => {
    if (filter === "All") return reviews;
    if (filter === "Featured") return reviews.filter((review) => review.isFeatured);
    return reviews.filter((review) => !review.isFeatured);
  }, [filter, reviews]);

  const countFor = (target: ReviewFilter) => {
    if (target === "All") return reviews.length;
    if (target === "Featured") return reviews.filter((review) => review.isFeatured).length;
    return reviews.filter((review) => !review.isFeatured).length;
  };

  const updateReview = (review: Review, data: { isFeatured: boolean }, successTitle: string) => {
    moderateReview.mutate(
      { reviewId: review.id, data },
      {
        onSuccess: () => toast({ title: successTitle }),
        onError: (error) => toast({ title: "Could not update review", description: error.message, variant: "destructive" }),
      },
    );
  };

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="reviews-management-panel">
      <div className="glass-card flex flex-col gap-4 rounded-2xl border border-white/5 p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#00BFFF]/20 bg-[#00BFFF]/10">
            <MessageSquareQuote className="h-5 w-5 text-[#00BFFF]" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-white">Reviews</h1>
            <p className="mt-0.5 text-xs text-gray-500">{countFor("Featured")} featured on homepage</p>
          </div>
        </div>

        <div className="flex max-w-full overflow-x-auto rounded-lg border border-white/5 bg-black/20 p-1" aria-label="Filter reviews">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "h-8 shrink-0 rounded-md px-3 text-[11px] font-bold transition-colors",
                filter === item ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300",
              )}
            >
              {item} <span className="ml-1 font-mono text-[9px] opacity-70">{countFor(item)}</span>
            </button>
          ))}
        </div>
      </div>

      {reviewsQuery.isError && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {reviewsQuery.error.message}
        </div>
      )}

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="p-4">Member</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review</th>
                <th className="p-4">Submitted</th>
                <th className="p-4 text-center">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredReviews.map((review) => {
                const isUpdating = moderateReview.isPending && moderateReview.variables?.reviewId === review.id;
                return (
                  <tr key={review.id} className="align-top transition-colors hover:bg-white/[0.01]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10">
                          <AvatarImage src={review.userPhotoUrl} alt={review.userName} />
                          <AvatarFallback className="bg-white/5 text-[10px] font-bold text-gray-300">{initials(review.userName || "Member")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white">{review.userName || "Member"}</p>
                          <p className="mt-0.5 font-mono text-[9px] text-gray-600">MEM-{String(review.userId).padStart(4, "0")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star key={value} className={cn("h-3.5 w-3.5", value <= review.rating && "fill-current")} />
                        ))}
                      </div>
                    </td>
                    <td className="max-w-md p-4">
                      <p className="line-clamp-3 leading-5 text-gray-300" title={review.content}>{review.content}</p>
                    </td>
                    <td className="whitespace-nowrap p-4 font-mono text-[10px] text-gray-500">{formatDate(review.createdAt)}</td>
                    <td className="p-4 text-center">
                      <div className="flex h-8 items-center justify-center gap-2">
                        <Switch
                          checked={review.isFeatured}
                          disabled={isUpdating}
                          onCheckedChange={(checked) => updateReview(review, { isFeatured: checked }, checked ? "Review featured on homepage" : "Review removed from homepage")}
                          className="scale-90 data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-white/10"
                          aria-label={review.isFeatured ? "Remove review from homepage" : "Feature review on homepage"}
                          title={review.isFeatured ? "Remove from homepage" : "Feature on homepage"}
                        />
                        <Loader2 className={cn("h-3.5 w-3.5 text-[#00BFFF] transition-opacity", isUpdating ? "animate-spin opacity-100" : "opacity-0")} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-xs text-gray-500">
                    No reviews match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
