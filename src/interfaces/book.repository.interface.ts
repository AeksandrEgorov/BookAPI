
// Interfaces: book repository types
import { Book } from "../models/book.model";

export interface BookQuery {
  title?: string;
  author?: string;
  genre?: string;
  language?: string;
  year?: number;
  sortBy?: "title" | "publishedYear";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateBookInput {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description?: string;
  coverImage?: string;
  authorId: number;
  publisherId: number;
  genres: string[];
}

export interface UpdateBookInput {
  title?: string;
  isbn?: string;
  publishedYear?: number;
  pageCount?: number;
  language?: string;
  description?: string;
  coverImage?: string;
  authorId?: number;
  publisherId?: number;
  genres?: string[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedBooksResult {
  data: Book[];
  pagination: PaginationMeta;
}

export interface BookRepository {
  // find
  findAll(query: BookQuery): Promise<PaginatedBooksResult>;
  // single
  findById(id: number): Promise<Book | null>;
  // create
  create(data: CreateBookInput): Promise<Book>;
  // update
  update(id: number, data: UpdateBookInput): Promise<Book | null>;
  // delete
  delete(id: number): Promise<Book | null>;
  // rating
  getAverageRating(bookId: number): Promise<number | null>;
}