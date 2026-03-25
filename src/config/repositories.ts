// Repositories config
import { BookRepository } from "../interfaces/book.repository.interface.js";
import { ReviewRepository } from "../interfaces/review.repository.interface.js";

import { MockBookRepository } from "../repositories/mock-book.repository.js";
import { MockReviewRepository } from "../repositories/mock-review.repository.js";

import { PrismaBookRepository } from "../repositories/prisma-book.repository.js";
import { PrismaReviewRepository } from "../repositories/prisma-review.repository.js";

const DATA_SOURCE: string = process.env.DATA_SOURCE ?? "mock";

console.log("====================================");
console.log("DATA_SOURCE =", DATA_SOURCE);
console.log("====================================\n");

export const bookRepository: BookRepository =
  DATA_SOURCE === "prisma"
    ? new PrismaBookRepository()
    : new MockBookRepository();

export const reviewRepository: ReviewRepository =
  DATA_SOURCE === "prisma"
    ? new PrismaReviewRepository()
    : new MockReviewRepository();

export { DATA_SOURCE };