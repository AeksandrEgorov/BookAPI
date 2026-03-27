// Books service: business logic for books. Calls Repository methods.
import { bookRepository } from "../config/repositories.js";
import { Book } from "../models/book.model.js";
import {
    BookQuery,
    CreateBookInput,
    PaginatedBooksResult,
    UpdateBookInput,
    AuthorOption,
    PublisherOption
} from "../interfaces/book.repository.interface.js";

export async function getAllBooks(query: BookQuery): Promise<PaginatedBooksResult> {
    return bookRepository.findAll(query);
};

export async function getBookById(id: number): Promise<Book | null> {
    return bookRepository.findById(id);
};

export async function createBook(data: CreateBookInput): Promise<Book> {
    return bookRepository.create(data);
};

export async function updateBook(id: number, data: UpdateBookInput): Promise<Book | null> {
    return bookRepository.update(id, data);
};

export async function deleteBook(id: number): Promise<Book | null> {
    return bookRepository.delete(id);
};

export async function getAverageRating(bookId: number): Promise<number | null> {
    return bookRepository.getAverageRating(bookId);
};

export async function getLanguages(): Promise<string[]> {
  return bookRepository.getLanguages();
}

export async function getGenres(): Promise<string[]> {
  return bookRepository.getGenres();
}

export async function getAuthors(): Promise<AuthorOption[]> {
  return bookRepository.getAuthors();
}

export async function getPublishers(): Promise<PublisherOption[]> {
  return bookRepository.getPublishers();
}





