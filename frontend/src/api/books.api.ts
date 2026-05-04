import { api } from "./api.js";
import type {
  AuthorsResponse,
  AverageRatingResponse,
  BookListResponse,
  BookQueryParams,
  CreateBookInput,
  PublishersResponse,
  SingleBookResponse,
  StringListResponse,
  UpdateBookInput,
} from "../types/book.types.js";

export async function getBooks(
  params: BookQueryParams,
  signal?: AbortSignal
): Promise<BookListResponse> {
  const response = await api.get<BookListResponse>("/books", {
    params,
    signal,
  });

  return response.data;
}

export async function getBookById(
  id: number,
  signal?: AbortSignal
): Promise<SingleBookResponse> {
  const response = await api.get<SingleBookResponse>(`/books/${id}`, {
    signal,
  });

  return response.data;
}

export async function createBook(data: CreateBookInput): Promise<SingleBookResponse> {
  const response = await api.post<SingleBookResponse>("/books", data);
  return response.data;
}

export async function updateBook(
  id: number,
  data: UpdateBookInput
): Promise<SingleBookResponse> {
  const response = await api.put<SingleBookResponse>(`/books/${id}`, data);
  return response.data;
}

export async function deleteBook(id: number): Promise<SingleBookResponse> {
  const response = await api.delete<SingleBookResponse>(`/books/${id}`);
  return response.data;
}

export async function getLanguages(signal?: AbortSignal): Promise<StringListResponse> {
  const response = await api.get<StringListResponse>("/books/languages", {
    signal,
  });

  return response.data;
}

export async function getGenres(signal?: AbortSignal): Promise<StringListResponse> {
  const response = await api.get<StringListResponse>("/books/genres", {
    signal,
  });

  return response.data;
}

export async function getAuthors(signal?: AbortSignal): Promise<AuthorsResponse> {
  const response = await api.get<AuthorsResponse>("/books/authors", {
    signal,
  });

  return response.data;
}

export async function getPublishers(signal?: AbortSignal): Promise<PublishersResponse> {
  const response = await api.get<PublishersResponse>("/books/publishers", {
    signal,
  });

  return response.data;
}

export async function getAverageRating(
  id: number,
  signal?: AbortSignal
): Promise<AverageRatingResponse> {
  const response = await api.get<AverageRatingResponse>(
    `/books/${id}/average-rating`,
    { signal }
  );

  return response.data;
}