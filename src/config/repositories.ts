import { BookRepository } from "../interfaces/book.repository.interface";
import { ReviewRepository } from "../interfaces/review.repository.interface";

import { MockBookRepository } from "../repositories/mock-book.repository"
import { MockReviewRepository } from "../repositories/mock-review.repository";

const DATA_SOURCE: string = process.env.DATA_SOURCE ?? "mock";

export const bookRepository: BookRepository = new MockBookRepository();
export const reviewRepository: ReviewRepository = new MockReviewRepository();

export { DATA_SOURCE };