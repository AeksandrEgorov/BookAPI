import { Review } from "../models/review.model";

export interface CreateReviewInput {
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface ReviewRepository {
  findByBookId(bookId: number): Promise<Review[]>;
  create(bookId: number, data: CreateReviewInput): Promise<Review>;
}