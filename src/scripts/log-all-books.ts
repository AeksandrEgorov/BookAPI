import { books } from "../data/mock/books.mock.faker";
import { Book } from "../models/book.model";

function logBooks(title: string, books: Book[]): void {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));

  console.table(books, [
    "id",
    "title",
    "authorId",
    "publisherId",
    "publishedYear"
  ]);

  console.log(`Total: ${books.length} books\n`);
}

function main(): void {
  logBooks("Books (faker mock data)", books);
}

main();