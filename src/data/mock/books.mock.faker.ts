import { faker } from '@faker-js/faker';
import { Book } from "../../models/book.model";

// Minimum dataset sizes (follow screenshot requirements)
const BOOK_COUNT = 15; // between 10-15
const AUTHOR_COUNT = 7; // between 5-7
const PUBLISHER_COUNT = 4; // between 3-4
const GENRE_COUNT = 6; // 5+
/**
* Generates a single fake book using faker.
*
* @param id Unique identifier for the book.
* @returns A fake `Book` instance.
*/
function generateBook(id: number): Book {
	return {
		id,
		title: faker.book.title(),
		isbn: `${faker.number.int({ min: 1000000000000, max: 9999999999999 })}`,
		publishedYear: faker.date.past({ years: 50 }).getFullYear(),
		pageCount: faker.number.int({ min: 50, max: 1200 }),
		language: faker.helpers.arrayElement(["en", "et", "fi", "fr", "de"]),
		description: faker.lorem.sentences(2),
		coverImage: `https://picsum.photos/seed/${id}/200/300`,
		authorId: faker.number.int({ min: 1, max: AUTHOR_COUNT }),
		publisherId: faker.number.int({ min: 1, max: PUBLISHER_COUNT }),
		genres: Array.from(
			{ length: faker.number.int({ min: 1, max: 3 }) },
			() => String(faker.number.int({ min: 1, max: GENRE_COUNT }))
		),
		createdAt: faker.date.past({ years: 5 }).toISOString(),
		updatedAt: faker.date.recent({ days: 30 }).toISOString(),
	};
}
/**
* Generates an array of fake books.
*
* @param count Number of books to generate.
* @returns Array of fake `Book` instances.
*/
function generateBooks(count: number): Book[] {
	return Array.from({ length: count }, (_, index) => generateBook(index + 1));
}
/**
* Generates a seeded array of fake books.
* Useful for tests where data must be stable.
*
* @param count Number of books to generate.
* @param seed Seed value for faker (default 42).
* @returns Array of fake `Book` instances generated with a fixed seed.
*/
function generateSeededBooks(count: number, seed: number = 42): Book[] {
	faker.seed(seed);
	const books = Array.from({ length: count }, (_, index) => generateBook(index + 1));
	faker.seed();
	return books;
}
// Genereeri 20 raamatut
export let books: Book[] = generateBooks(BOOK_COUNT);

export const MOCK_COUNTS = {
	books: BOOK_COUNT,
	authors: AUTHOR_COUNT,
	publishers: PUBLISHER_COUNT,
	genres: GENRE_COUNT,
};
