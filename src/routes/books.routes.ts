// Routes: books endpoints
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

/**
 * @openapi
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     description: Returns books with filters, sorting and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by book title
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author name
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by published year
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, publishedYear]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Books list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooksListResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
booksRouter.get(
  "/",
  validateQuery(bookQuerySchema),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: BookQuery = res.locals.validatedQuery as BookQuery;
      const result = await getAllBooks(query);

      res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookInput'
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
booksRouter.post(
  "/",
  validateBody(createBookSchema),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
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

/**
 * @openapi
 * /api/v1/books/languages:
 *   get:
 *     summary: Get all available languages
 *     tags: [Reference]
 *     responses:
 *       200:
 *         description: Languages list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguagesResponse'
 */
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

/**
 * @openapi
 * /api/v1/books/genres:
 *   get:
 *     summary: Get all available genres
 *     tags: [Reference]
 *     responses:
 *       200:
 *         description: Genres list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenresResponse'
 */
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

/**
 * @openapi
 * /api/v1/books/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Reference]
 *     responses:
 *       200:
 *         description: Authors list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorsResponse'
 */
booksRouter.get(
  "/authors",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorsList: { id: number; fullName: string }[] = authors
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

/**
 * @openapi
 * /api/v1/books/publishers:
 *   get:
 *     summary: Get all publishers
 *     tags: [Reference]
 *     responses:
 *       200:
 *         description: Publishers list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublishersResponse'
 */
booksRouter.get(
  "/publishers",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publishersList: { id: number; name: string }[] = publishers
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

/**
 * @openapi
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book id
 *     responses:
 *       200:
 *         description: Single book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       400:
 *         description: Invalid book id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @openapi
 * /api/v1/books/{id}:
 *   put:
 *     summary: Update book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookInput'
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       400:
 *         description: Invalid input or invalid book id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @openapi
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book id
 *     responses:
 *       200:
 *         description: Book deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       400:
 *         description: Invalid book id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @openapi
 * /api/v1/books/{id}/average-rating:
 *   get:
 *     summary: Get average rating of a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book id
 *     responses:
 *       200:
 *         description: Average rating
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AverageRatingResponse'
 *       400:
 *         description: Invalid book id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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