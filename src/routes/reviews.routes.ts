import { Router, Request, Response, NextFunction } from "express";
import {
  createReview,
  getReviewsByBookId,
} from "../services/reviews.service";
import { createReviewSchema } from "../validators/review.validator";
import { validateBody } from "../middleware/validate.middleware";
import { CreateReviewInput } from "../interfaces/review.repository.interface";
import { getBookById } from "../services/books.service";

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