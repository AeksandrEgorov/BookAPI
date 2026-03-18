// Repo: mock book storage
import { books } from "../data/mock/books.mock.faker";
import { authors } from "../data/mock/authors.mock.faker";
import { reviews } from "../data/mock/reviews.mock.faker";
import {
  BookQuery,
  BookRepository,
  CreateBookInput,
  PaginatedBooksResult,
  UpdateBookInput,
} from "../interfaces/book.repository.interface";
import { Book } from "../models/book.model";
import { Review } from "../models/review.model";
import { Author } from "../models/author.model";

export class MockBookRepository implements BookRepository {
  // find all
  async findAll(query: BookQuery): Promise<PaginatedBooksResult> {
    let result: Book[] = [...books];

    if (query.title !== undefined) {
      const title: string = query.title.toLowerCase();
      result = result.filter((book: Book) =>
        book.title.toLowerCase().includes(title)
      );
    }

    if (query.language !== undefined) {
      const language: string = query.language.toLowerCase();
      result = result.filter(
        (book: Book) => book.language.toLowerCase() === language
      );
    }

    if (query.year !== undefined) {
      result = result.filter(
        (book: Book) => book.publishedYear === query.year
      );
    }

    if (query.genre !== undefined) {
      const genre: string = query.genre.toLowerCase();
      result = result.filter((book: Book) =>
        book.genres.some((bookGenre: string) => bookGenre.toLowerCase() === genre)
      );
    }

    if (query.author !== undefined) {
      const authorSearch: string = query.author.toLowerCase();

      result = result.filter((book: Book) => {
        const author: Author | undefined = authors.find(
          (authorItem: Author) => authorItem.id === book.authorId
        );

        if (author === undefined) {
          return false;
        }

        const fullName: string =
          `${author.firstName} ${author.lastName}`.toLowerCase();

        return fullName.includes(authorSearch);
      });
    }

    const sortBy: "title" | "publishedYear" = query.sortBy ?? "title";
    const order: "asc" | "desc" = query.order ?? "asc";

    result.sort((firstBook: Book, secondBook: Book) => {
      let compareValue: number;

      if (sortBy === "publishedYear") {
        compareValue = firstBook.publishedYear - secondBook.publishedYear;
      } else {
        compareValue = firstBook.title.localeCompare(secondBook.title);
      }

      return order === "desc" ? -compareValue : compareValue;
    });

    const page: number =
      query.page !== undefined && query.page > 0 ? query.page : 1;

    const limit: number =
      query.limit !== undefined && query.limit > 0 ? query.limit : 10;

    const totalItems: number = result.length;
    const totalPages: number = Math.max(1, Math.ceil(totalItems / limit));
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = startIndex + limit;

    const paginatedData: Book[] = result.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // find one
  async findById(id: number): Promise<Book | null> {
    const book: Book | undefined = books.find(
      (bookItem: Book) => bookItem.id === id
    );

    return book ?? null;
  }

  // create
  async create(data: CreateBookInput): Promise<Book> {
    const newId: number =
      books.length > 0
        ? Math.max(...books.map((book: Book) => book.id)) + 1
        : 1;

    const now: string = new Date().toISOString();

    const newBook: Book = {
      id: newId,
      title: data.title,
      isbn: data.isbn,
      publishedYear: data.publishedYear,
      pageCount: data.pageCount,
      language: data.language,
      description: data.description,
      coverImage: data.coverImage,
      authorId: data.authorId,
      publisherId: data.publisherId,
      genres: data.genres,
      createdAt: now,
      updatedAt: now,
    };

    books.push(newBook);

    return newBook;
  }

  // update
  async update(id: number, data: UpdateBookInput): Promise<Book | null> {
    const index: number = books.findIndex(
      (book: Book) => book.id === id
    );

    if (index === -1) {
      return null;
    }

    const existingBook: Book = books[index];

    const updatedBook: Book = {
      ...existingBook,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    books[index] = updatedBook;

    return updatedBook;
  }

  // delete
  async delete(id: number): Promise<Book | null> {
    const index: number = books.findIndex(
      (book: Book) => book.id === id
    );

    if (index === -1) {
      return null;
    }

    const deletedBook: Book = books[index];
    books.splice(index, 1);

    return deletedBook;
  }

  // avg rating
  async getAverageRating(bookId: number): Promise<number | null> {
    const bookReviews: Review[] = reviews.filter(
      (reviewItem: Review) => reviewItem.bookId === bookId
    );

    if (bookReviews.length === 0) {
      return null;
    }

    const totalRating: number = bookReviews.reduce(
      (sum: number, reviewItem: Review) => sum + reviewItem.rating,
      0
    );

    const averageRating: number = totalRating / bookReviews.length;

    return Number(averageRating.toFixed(2));
  }
}