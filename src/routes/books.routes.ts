import { Router, Request, Response, NextFunction } from "express";

import {
  createBook,
  deleteBook,
  getAllBooks,
  getAverageRating,
  getBookById,
  updateBook,
} from "../services/books.service";

import {
  bookQuerySchema,
  createBookSchema,
  updateBookSchema,
} from "../validators/book.validator";

import {
  validateBody,
  validateQuery,
} from "../middleware/validate.middleware";

import {
  BookQuery,
  CreateBookInput,
  UpdateBookInput,
} from "../interfaces/book.repository.interface";

import { books } from "../data/mock/books.mock.faker";
import { authors } from "../data/mock/authors.mock.faker";
import { publishers } from "../data/mock/publishers.mock.faker";

import { Book } from "../models/book.model";

export const booksRouter: Router = Router();

function parseId(idParam: string | string[]): number | null {
  if (Array.isArray(idParam)) {
    return null;
  }

  const id: number = Number(idParam);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}


booksRouter.get(
  "/",
  validateQuery(bookQuerySchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: BookQuery = res.locals.validatedQuery as BookQuery;

      const result = await getAllBooks(query);

      res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.post(
  "/",
  validateBody(createBookSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: CreateBookInput =
        res.locals.validatedBody as CreateBookInput;

      const createdBook = await createBook(body);

      res.status(201).json({
        data: createdBook,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);


booksRouter.get(
  "/languages",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const languages: string[] = Array.from(
        new Set(books.map((book: Book) => book.language.trim()))
      ).sort((a: string, b: string) => a.localeCompare(b));

      res.status(200).json({
        data: languages,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.get(
  "/genres",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const genres: string[] = Array.from(
        new Set(
          books.flatMap((book: Book) =>
            book.genres.map((genre: string) => genre.trim())
          )
        )
      ).sort((a: string, b: string) => a.localeCompare(b));

      res.status(200).json({
        data: genres,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.get(
  "/authors",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorsList = authors
        .map((author) => ({
          id: author.id,
          fullName: `${author.firstName} ${author.lastName}`,
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));

      res.status(200).json({
        data: authorsList,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.get(
  "/publishers",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publishersList = publishers
        .map((publisher) => ({
          id: publisher.id,
          name: publisher.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      res.status(200).json({
        data: publishersList,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);


booksRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: number | null = parseId(req.params.id);

      if (id === null) {
        res.status(400).json({
          error: "Invalid book id",
        });
        return;
      }

      const book = await getBookById(id);

      if (book === null) {
        res.status(404).json({
          error: "Book not found",
        });
        return;
      }

      res.status(200).json({
        data: book,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.put(
  "/:id",
  validateBody(updateBookSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: number | null = parseId(req.params.id);

      if (id === null) {
        res.status(400).json({
          error: "Invalid book id",
        });
        return;
      }

      const body: UpdateBookInput =
        res.locals.validatedBody as UpdateBookInput;

      const updatedBook = await updateBook(id, body);

      if (updatedBook === null) {
        res.status(404).json({
          error: "Book not found",
        });
        return;
      }

      res.status(200).json({
        data: updatedBook,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: number | null = parseId(req.params.id);

      if (id === null) {
        res.status(400).json({
          error: "Invalid book id",
        });
        return;
      }

      const deletedBook = await deleteBook(id);

      if (deletedBook === null) {
        res.status(404).json({
          error: "Book not found",
        });
        return;
      }

      res.status(200).json({
        data: deletedBook,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

booksRouter.get(
  "/:id/average-rating",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: number | null = parseId(req.params.id);

      if (id === null) {
        res.status(400).json({
          error: "Invalid book id",
        });
        return;
      }

      const book = await getBookById(id);

      if (book === null) {
        res.status(404).json({
          error: "Book not found",
        });
        return;
      }

      const averageRating = await getAverageRating(id);

      res.status(200).json({
        data: {
          bookId: id,
          averageRating,
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);