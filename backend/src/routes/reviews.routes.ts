// Routes: reviews endpoints
import { Router, Request, Response, NextFunction } from "express";
import {
  createReview,
  getReviewsByBookId,
} from "../services/reviews.service.js";
import { createReviewSchema } from "../validators/review.validator.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { CreateReviewInput } from "../interfaces/review.repository.interface.js";
import { getBookById } from "../services/books.service.js";

export const reviewsRouter: Router = Router();

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
 * /api/v1/books/{bookId}/reviews:
 *   get:
 *     summary: Get reviews for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book id
 *     responses:
 *       200:
 *         description: Reviews list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewsResponse'
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
reviewsRouter.get(
  "/:bookId/reviews",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId: number | null = parseId(req.params.bookId);

      if (bookId === null) {
        res.status(400).json({
          error: "Invalid book id",
        });
        return;
      }

      const book = await getBookById(bookId);

      if (book === null) {
        res.status(404).json({
          error: "Book not found",
        });
        return;
      }

      const bookReviews = await getReviewsByBookId(bookId);

      res.status(200).json({
        data: bookReviews,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/v1/books/{bookId}/reviews:
 *   post:
 *     summary: Add review for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewInput'
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation failed or invalid book id
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
reviewsRouter.post(
  "/:bookId/reviews",
  validateBody(createReviewSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId: number | null = parseId(req.params.bookId);

      if (bookId === null) {
        res.status(400).json({
          error: "Invalid book id",
        });
        return;
      }

      const book = await getBookById(bookId);

      if (book === null) {
        res.status(404).json({
          error: "Book not found",
        });
        return;
      }

      const body: CreateReviewInput =
        res.locals.validatedBody as CreateReviewInput;

      const createdReview = await createReview(bookId, body);

      res.status(201).json({
        data: createdReview,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
);