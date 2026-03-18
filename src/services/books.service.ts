// Books service: business logic for books. Calls Repository methods.
import { bookRepository } from "../config/repositories";
import { Book } from "../models/book.model";
import {
    BookQuery,
    CreateBookInput,
    PaginatedBooksResult,
    UpdateBookInput,
} from "../interfaces/book.repository.interface";

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





