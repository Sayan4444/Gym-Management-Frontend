import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Review } from "@/data/types";
import { api } from "@/lib/api";
import { ReviewInput, ReviewModerationInput } from "@/lib/api/review";

export function useFeaturedReviews(gymId?: number) {
  return useQuery<{ count: number; reviews: Review[] }>({
    queryKey: ["reviews", "featured", gymId],
    queryFn: () => api.getFeaturedReviews(gymId!),
    enabled: !!gymId,
  });
}

export function useMyReview() {
  return useQuery<{ review: Review | null }>({
    queryKey: ["reviews", "mine"],
    queryFn: api.getMyReview,
  });
}

export function useReviews() {
  return useQuery<{ count: number; reviews: Review[] }>({
    queryKey: ["reviews", "admin"],
    queryFn: api.getReviews,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewInput) => api.submitReview(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteMyReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: ReviewModerationInput }) => api.moderateReview(reviewId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
