import { faker } from '@faker-js/faker';
import { Book } from "../../models/book.model";

const REAL_BOOKS: Omit<Book, "id">[] = [
	{
		title: "Clean Code",
		isbn: "9780132350884",
		publishedYear: 2008,
		pageCount: 464,
		language: "en",
		description: "A handbook of agile software craftsmanship.",
		coverImage: undefined,
		authorId: 1,
		publisherId: 1,
		genres: ["1","2"],
		createdAt: new Date("2008-08-01T00:00:00.000Z").toISOString(),
	},
	{
		title: "The Pragmatic Programmer",
		isbn: "9780201616224",
		publishedYear: 1999,
		pageCount: 352,
		language: "en",
		authorId: 2,
		publisherId: 2,
		genres: ["2"],
		createdAt: new Date("1999-10-20T00:00:00.000Z").toISOString(),
	},
	{
		title: "Design Patterns",
		isbn: "9780201633610",
		publishedYear: 1994,
		pageCount: 395,
		language: "en",
		authorId: 3,
		publisherId: 3,
		genres: ["3"],
		createdAt: new Date("1994-10-31T00:00:00.000Z").toISOString(),
	},
	{
		title: "Refactoring",
		isbn: "9780201485677",
		publishedYear: 1999,
		pageCount: 448,
		language: "en",
		authorId: 4,
		publisherId: 4,
		genres: ["2","4"],
		createdAt: new Date("1999-07-08T00:00:00.000Z").toISOString(),
	},
	{
		title: "Code Complete",
		isbn: "9780735619678",
		publishedYear: 2004,
		pageCount: 960,
		language: "en",
		authorId: 5,
		publisherId: 5,
		genres: ["1"],
		createdAt: new Date("2004-06-09T00:00:00.000Z").toISOString(),
	},
	{
		title: "You Don't Know JS",
		isbn: "9781491904244",
		publishedYear: 2015,
		pageCount: 278,
		language: "en",
		authorId: 6,
		publisherId: 6,
		genres: ["2"],
		createdAt: new Date("2015-01-01T00:00:00.000Z").toISOString(),
	},
	{
		title: "Eloquent JavaScript",
		isbn: "9781593279509",
		publishedYear: 2011,
		pageCount: 472,
		language: "en",
		authorId: 7,
		publisherId: 7,
		genres: ["2"],
		createdAt: new Date("2011-12-14T00:00:00.000Z").toISOString(),
	},
	{
		title: "JavaScript: The Good Parts",
		isbn: "9780596517748",
		publishedYear: 2008,
		pageCount: 176,
		language: "en",
		authorId: 8,
		publisherId: 8,
		genres: ["2"],
		createdAt: new Date("2008-05-01T00:00:00.000Z").toISOString(),
	},
	{
		title: "Head First Design Patterns",
		isbn: "9780596007126",
		publishedYear: 2004,
		pageCount: 694,
		language: "en",
		authorId: 9,
		publisherId: 9,
		genres: ["3"],
		createdAt: new Date("2004-10-25T00:00:00.000Z").toISOString(),
	},
	{
		title: "Test Driven Development",
		isbn: "9780321146533",
		publishedYear: 2002,
		pageCount: 240,
		language: "en",
		authorId: 10,
		publisherId: 10,
		genres: ["2"],
		createdAt: new Date("2002-11-08T00:00:00.000Z").toISOString(),
	},
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
		isbn: `${faker.number.int({ min: 1000000000000, max: 9999999999999 })}`,
		publishedYear: faker.number.int({ min: 1970, max: 2024 }),
		pageCount: faker.number.int({ min: 50, max: 1200 }),
		language: faker.helpers.arrayElement(["en", "et", "fi", "fr"]),
		description: faker.lorem.sentence(),
		coverImage: `https://picsum.photos/seed/h${id}/200/300`,
		authorId: faker.number.int({ min: 1, max: 12 }),
		publisherId: faker.number.int({ min: 1, max: 6 }),
		genres: [String(faker.number.int({ min: 1, max: 6 }))],
		createdAt: faker.date.past({ years: 10 }).toISOString(),
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