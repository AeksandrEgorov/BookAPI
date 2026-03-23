// Repositories config
import { BookRepository } from "../interfaces/book.repository.interface";
import { ReviewRepository } from "../interfaces/review.repository.interface";

import { MockBookRepository } from "../repositories/mock-book.repository";
import { MockReviewRepository } from "../repositories/mock-review.repository";

import { PrismaBookRepository } from "../repositories/prisma-book.repository";
import { PrismaReviewRepository } from "../repositories/prisma-review.repository";

const DATA_SOURCE: string = process.env.DATA_SOURCE ?? "mock";

// debug
console.log("====================================");
console.log("DATA_SOURCE =", DATA_SOURCE);
console.log(
  "BookRepository =",
  DATA_SOURCE === "prisma"
    ? "PrismaBookRepository"
    : "MockBookRepository"
);
console.log(
  "ReviewRepository =",
  DATA_SOURCE === "prisma"
    ? "PrismaReviewRepository"
    : "MockReviewRepository"
);
console.log("====================================");

export const bookRepository: BookRepository =
  DATA_SOURCE === "prisma"
    ? new PrismaBookRepository()
    : new MockBookRepository();

export const reviewRepository: ReviewRepository =
  DATA_SOURCE === "prisma"
    ? new PrismaReviewRepository()
    : new MockReviewRepository();

export { DATA_SOURCE };