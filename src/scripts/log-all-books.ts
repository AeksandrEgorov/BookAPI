import { books as booksFaker } from "../data/mock/books.mock.faker";
import { books as booksManual } from "../data/mock/books.mock";
import { books as booksHybrid } from "../data/mock/books.mock.hybrid";
import { books as booksPromiseGoogle } from "../data/mock/books.mock.googleapi";
import { Book } from "../models/book.model";

function logBooks(title: string, books: Book[]): void {
 	console.log("\n" + "=".repeat(60));
 	console.log(title);
 	console.log("=".repeat(60));
 	console.table(books, ["id", "title", "authorId", "publisherId", "publishedYear"]);
 	console.log(`Total: ${books.length} books\n`);
}

async function main(): Promise<void> {
 	logBooks("1. Faker (generated)", booksFaker);
 	logBooks("2. Manual (hardcoded)", booksManual);
 	logBooks("3. Hybrid (real + faker)", booksHybrid);
 	const booksGoogle = await booksPromiseGoogle;
 	logBooks("4. Google Books API", booksGoogle);
}

main().catch((err) => {
 	console.error("Failed to load books:", err);
 	process.exit(1);
});
