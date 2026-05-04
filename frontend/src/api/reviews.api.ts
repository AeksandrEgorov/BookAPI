import { api } from "./api.js";
import type {
  CreateReviewInput,
  ReviewsResponse,
  SingleReviewResponse,
} from "../types/review.types.js";

export async function getReviewsByBookId(
  bookId: number,
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  const response = await api.get<ReviewsResponse>(`/books/${bookId}/reviews`, {
    signal,
  });

  return response.data;
}

export async function createReview(
  bookId: number,
  data: CreateReviewInput
): Promise<SingleReviewResponse> {
  const response = await api.post<SingleReviewResponse>(
    `/books/${bookId}/reviews`,
    data
  );

  return response.data;
}