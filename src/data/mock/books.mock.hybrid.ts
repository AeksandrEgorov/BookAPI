import { faker } from '@faker-js/faker';
import { Book } from "../../models/book.model";
/**
* Real programming books defined manually (without IDs).
*/
const REAL_BOOKS: Omit<Book, "id">[] = [
	{ title: "Clean Code", publishedYear: 2008, author: "Robert C. Martin" },
	{ title: "The Pragmatic Programmer", publishedYear: 1999, author: "David Thomas" },
	{ title: "Design Patterns", publishedYear: 1994, author: "Erich Gamma" },
	{ title: "Refactoring", publishedYear: 1999, author: "Martin Fowler" },
	{ title: "Code Complete", publishedYear: 2004, author: "Steve McConnell" },
	{ title: "You Don't Know JS", publishedYear: 2015, author: "Kyle Simpson" },
	{ title: "Eloquent JavaScript", publishedYear: 2011, author: "Marijn Haverbeke" },
	{ title: "JavaScript: The Good Parts", publishedYear: 2008, author: "Douglas Crockford" },
	{ title: "Head First Design Patterns", publishedYear: 2004, author: "Eric Freeman" },
	{ title: "Test Driven Development", publishedYear: 2002, author: "Kent Beck" }
	];
/**
* Generates a single fake book using faker.
*
* @param id Unique identifier for the book.
* @returns A single fake `Book` object.
*/
function generateFakeBook(id: number): Book {
 	return {
		id,
		title: faker.book.title(),
		publishedYear: faker.number.int({ min: 1970, max: 2024 }),
		author: faker.person.fullName()
	};
}
/**
* Combines real books with additional fake books.
*
* @param fakeCount Number of fake books to generate.
* @returns Array with real books first, followed by fake books.
*/
function generateHybridBooks(fakeCount: number = 20): Book[] {
 	// Add IDs to real books
 	const realBooksWithId = REAL_BOOKS.map((book, index) => ({
		id: index + 1,
		...book
	}));
	// Generate fake books
	const fakeBooks = Array.from(
		{ length: fakeCount },
		(_, index) => generateFakeBook(realBooksWithId.length + index + 1)
	);
	// Combine real and fake books
	return [...realBooksWithId, ...fakeBooks];
}
// 10 real + 20 fake = 30 books
export let books: Book[] = generateHybridBooks(20);