import { faker } from "@faker-js/faker";
import { Review } from "../../models/review.model";
import { MOCK_COUNTS } from "./books.mock.faker";

const BOOK_COUNT = MOCK_COUNTS.books;
const REVIEW_COUNT = 15;

function generateReview(id: number): Review {
  return {
    id,
    bookId: faker.number.int({ min: 1, max: BOOK_COUNT }),
    userName: faker.internet.username(),
    rating: faker.number.int({ min: 1, max: 5 }) as 1 | 2 | 3 | 4 | 5,
    comment: faker.lorem.sentence(),
    createdAt: faker.date.recent({ days: 365 }).toISOString(),
  };
}

export const reviews: Review[] = Array.from(
  { length: REVIEW_COUNT },
  (_, index) => generateReview(index + 1)
);
