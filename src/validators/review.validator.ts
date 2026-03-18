import { z } from "zod";

export const createReviewSchema = z.object({
  userName: z.string().min(1, "User name is required").max(100, "User name must be at most 100 characters"),
  rating: z.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must not be greater than 5"),
  comment: z.string().max(1000, "Comment must be at most 1000 characters").optional(),
});