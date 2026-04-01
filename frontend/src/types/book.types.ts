import type { Pagination } from "./common.types.js";

export type Book = {
  id: number;
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
  createdAt: string;
  updatedAt: string;
};

export type AuthorOption = {
  id: number;
  fullName: string;
};

export type PublisherOption = {
  id: number;
  name: string;
};

export type BookListResponse = {
  data: Book[];
  pagination: Pagination;
};

export type SingleBookResponse = {
  data: Book;
};

export type StringListResponse = {
  data: string[];
};

export type AuthorsResponse = {
  data: AuthorOption[];
};

export type PublishersResponse = {
  data: PublisherOption[];
};

export type AverageRatingResponse = {
  data: {
    bookId: number;
    averageRating: number | null;
  };
};

export type BookQueryParams = {
  title?: string;
  author?: string;
  genre?: string;
  language?: string;
  year?: number;
  sortBy?: "title" | "publishedYear";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type CreateBookInput = {
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
};

export type UpdateBookInput = Partial<CreateBookInput>;