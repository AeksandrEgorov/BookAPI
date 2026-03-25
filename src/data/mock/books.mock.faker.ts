import { faker } from "@faker-js/faker";
import { Book } from "../../models/book.model.js";

const BOOK_COUNT = 15;
const AUTHOR_COUNT = 7;
const PUBLISHER_COUNT = 4;

const AVAILABLE_GENRES = [
  "Fiction",
  "Non-fiction",
  "Programming",
  "Science",
  "History",
  "Fantasy",
  "Biography",
  "Philosophy",
];

function generateBook(id: number): Book {
  const createdAt = faker.date.past({ years: 5 });
  const updatedAt = faker.date.between({
    from: createdAt,
    to: new Date(),
  });

  return {
    id,
    title: faker.book.title(),
    isbn: faker.string.numeric(13),
    publishedYear: faker.number.int({ min: 1980, max: 2025 }),
    pageCount: faker.number.int({ min: 80, max: 1200 }),
    language: faker.helpers.arrayElement([
      "English",
      "Estonian",
      "Finnish",
      "German",
      "French",
    ]),
    description: faker.lorem.sentences(2),
    coverImage: `https://picsum.photos/seed/book-${id}/200/300`,
    authorId: faker.number.int({ min: 1, max: AUTHOR_COUNT }),
    publisherId: faker.number.int({ min: 1, max: PUBLISHER_COUNT }),
    genres: faker.helpers.arrayElements(
      AVAILABLE_GENRES,
      faker.number.int({ min: 1, max: 3 })
    ),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

function generateBooks(count: number): Book[] {
  return Array.from({ length: count }, (_, index) => generateBook(index + 1));
}

export function generateSeededBooks(count: number, seed = 42): Book[] {
  faker.seed(seed);
  const result = generateBooks(count);
  faker.seed();
  return result;
}

export let books: Book[] = generateSeededBooks(BOOK_COUNT);

export const MOCK_COUNTS = {
  books: BOOK_COUNT,
  authors: AUTHOR_COUNT,
  publishers: PUBLISHER_COUNT,
  genres: AVAILABLE_GENRES.length,
};
