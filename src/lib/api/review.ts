import { fetchApi } from "./core";

export interface ReviewInput {
  rating: number;
  content: string;
}

export interface ReviewModerationInput {
  isFeatured?: boolean;
}

export const reviewApi = {
  getFeaturedReviews: (gymId: number) => fetchApi(`/gyms/${gymId}/reviews`),
  getMyReview: () => fetchApi("/reviews/me"),
  submitReview: (data: ReviewInput) => fetchApi("/reviews", { method: "POST", body: JSON.stringify(data) }),
  deleteMyReview: () => fetchApi("/reviews/me", { method: "DELETE" }),
  getReviews: () => fetchApi("/reviews"),
  moderateReview: (reviewId: number, data: ReviewModerationInput) =>
    fetchApi(`/reviews/${reviewId}`, { method: "PATCH", body: JSON.stringify(data) }),
};
