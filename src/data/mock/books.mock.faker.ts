import { faker } from '@faker-js/faker';
import { Book } from "../../models/book.model";
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
		publishedYear: faker.date.past({ years: 50 }).getFullYear(),
		author: faker.person.fullName()
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
export let books: Book[] = generateBooks(20);
