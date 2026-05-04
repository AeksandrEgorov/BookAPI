// Interfaces: review repository
import { Review } from "../models/review.model.js";

export interface CreateReviewInput {
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface ReviewRepository {
  // list
  findByBookId(bookId: number): Promise<Review[]>;
  // add
  create(bookId: number, data: CreateReviewInput): Promise<Review>;
}