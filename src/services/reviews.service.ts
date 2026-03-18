// Reviews service: business logic for reviews. Calls Repository methods.
import { reviewRepository } from "../config/repositories";

import { CreateReviewInput } from "../interfaces/review.repository.interface";
import { Review } from "../models/review.model";

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
    return reviewRepository.findByBookId(bookId);
};

export async function createReview(bookId: number, data: CreateReviewInput): Promise<Review> {
    return reviewRepository.create(bookId, data);
};

