// Reviews service: business logic for reviews. Calls Repository methods.
import { reviewRepository } from "../config/repositories.js";

import { CreateReviewInput } from "../interfaces/review.repository.interface.js";
import { Review } from "../models/review.model.js";

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
    return reviewRepository.findByBookId(bookId);
};

export async function createReview(bookId: number, data: CreateReviewInput): Promise<Review> {
    return reviewRepository.create(bookId, data);
};

