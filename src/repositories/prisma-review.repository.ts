// Prisma review repository with all crud operations
import { prisma } from "../config/prisma";
import {
  CreateReviewInput,
  ReviewRepository,
} from "../interfaces/review.repository.interface";
import { Review } from "../models/review.model";

type PrismaReviewRecord = {
  id: number;
  bookId: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
};

export class PrismaReviewRepository implements ReviewRepository {
  private mapReview(record: PrismaReviewRecord): Review {
    return {
      id: record.id,
      bookId: record.bookId,
      userName: record.userName,
      rating: record.rating as 1 | 2 | 3 | 4 | 5,
      comment: record.comment ?? undefined,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async findByBookId(bookId: number): Promise<Review[]> {
    const records = await prisma.review.findMany({
      where: { bookId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return records.map((record) => this.mapReview(record));
  }

  async create(bookId: number, data: CreateReviewInput): Promise<Review> {
    const created = await prisma.review.create({
      data: {
        book: {
          connect: {
            id: bookId,
          },
        },
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return this.mapReview(created);
  }
}