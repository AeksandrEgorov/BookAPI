// Prisma book repository with all crud operations
import { prisma } from "../config/prisma";
import {
  BookQuery,
  BookRepository,
  CreateBookInput,
  PaginatedBooksResult,
  UpdateBookInput,
} from "../interfaces/book.repository.interface";
import { Book } from "../models/book.model";

type PrismaBookWithGenres = {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string | null;
  coverImage: string | null;
  authorId: number;
  publisherId: number;
  createdAt: Date;
  updatedAt: Date;
  genres: Array<{
    id: number;
    name: string;
  }>;
};

export class PrismaBookRepository implements BookRepository {
  private mapBook(record: PrismaBookWithGenres): Book {
    return {
      id: record.id,
      title: record.title,
      isbn: record.isbn,
      publishedYear: record.publishedYear,
      pageCount: record.pageCount,
      language: record.language,
      description: record.description ?? undefined,
      coverImage: record.coverImage ?? undefined,
      authorId: record.authorId,
      publisherId: record.publisherId,
      genres: record.genres.map((genre) => genre.name),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private async ensureGenres(genres: string[]): Promise<Array<{ id: number }>> {
    const normalizedGenres: string[] = Array.from(
      new Set(
        genres
          .map((genre: string) => genre.trim())
          .filter((genre: string) => genre.length > 0)
      )
    );

    for (const genreName of normalizedGenres) {
      await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      });
    }

    const genresFromDb = await prisma.genre.findMany({
      where: {
        name: {
          in: normalizedGenres,
        },
      },
      select: {
        id: true,
      },
    });

    return genresFromDb;
  }

  async findAll(query: BookQuery): Promise<PaginatedBooksResult> {
    const page: number =
      query.page !== undefined && query.page > 0 ? query.page : 1;

    const limit: number =
      query.limit !== undefined && query.limit > 0 ? query.limit : 10;

    const where = {
      ...(query.title !== undefined
        ? {
            title: {
              contains: query.title,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(query.language !== undefined
        ? {
            language: {
              equals: query.language,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(query.year !== undefined
        ? {
            publishedYear: query.year,
          }
        : {}),

      ...(query.author !== undefined
        ? {
            author: {
              OR: [
                {
                  firstName: {
                    contains: query.author,
                    mode: "insensitive" as const,
                  },
                },
                {
                  lastName: {
                    contains: query.author,
                    mode: "insensitive" as const,
                  },
                },
              ],
            },
          }
        : {}),

      ...(query.genre !== undefined
        ? {
            genres: {
              some: {
                name: {
                  equals: query.genre,
                  mode: "insensitive" as const,
                },
              },
            },
          }
        : {}),
    };

    const sortBy: "title" | "publishedYear" = query.sortBy ?? "title";
    const order: "asc" | "desc" = query.order ?? "asc";

    const orderBy =
      sortBy === "publishedYear"
        ? { publishedYear: order }
        : { title: order };

    const totalItems: number = await prisma.book.count({ where });

    const records = await prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalPages: number = Math.max(1, Math.ceil(totalItems / limit));

    return {
      data: records.map((record) => this.mapBook(record)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: number): Promise<Book | null> {
    const record = await prisma.book.findUnique({
      where: { id },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (record === null) {
      return null;
    }

    return this.mapBook(record);
  }

  async create(data: CreateBookInput): Promise<Book> {
    const genreConnections: Array<{ id: number }> = await this.ensureGenres(
      data.genres
    );

    const created = await prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        publishedYear: data.publishedYear,
        pageCount: data.pageCount,
        language: data.language,
        description: data.description,
        coverImage: data.coverImage,
        author: {
          connect: {
            id: data.authorId,
          },
        },
        publisher: {
          connect: {
            id: data.publisherId,
          },
        },
        genres: {
          connect: genreConnections,
        },
      },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.mapBook(created);
  }

  async update(id: number, data: UpdateBookInput): Promise<Book | null> {
    const existing = await prisma.book.findUnique({
      where: { id },
      select: { id: true },
    });

    if (existing === null) {
      return null;
    }

    let genresUpdate:
      | {
          set: Array<{ id: number }>;
        }
      | undefined = undefined;

    if (data.genres !== undefined) {
      const genreConnections: Array<{ id: number }> = await this.ensureGenres(
        data.genres
      );

      genresUpdate = {
        set: genreConnections,
      };
    }

    const updated = await prisma.book.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.isbn !== undefined ? { isbn: data.isbn } : {}),
        ...(data.publishedYear !== undefined
          ? { publishedYear: data.publishedYear }
          : {}),
        ...(data.pageCount !== undefined ? { pageCount: data.pageCount } : {}),
        ...(data.language !== undefined ? { language: data.language } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.coverImage !== undefined
          ? { coverImage: data.coverImage }
          : {}),
        ...(data.authorId !== undefined
          ? {
              author: {
                connect: {
                  id: data.authorId,
                },
              },
            }
          : {}),
        ...(data.publisherId !== undefined
          ? {
              publisher: {
                connect: {
                  id: data.publisherId,
                },
              },
            }
          : {}),
        ...(genresUpdate !== undefined
          ? {
              genres: genresUpdate,
            }
          : {}),
      },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.mapBook(updated);
  }

  async delete(id: number): Promise<Book | null> {
    const existing = await prisma.book.findUnique({
      where: { id },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (existing === null) {
      return null;
    }

    await prisma.book.delete({
      where: { id },
    });

    return this.mapBook(existing);
  }

  async getAverageRating(bookId: number): Promise<number | null> {
    const result = await prisma.review.aggregate({
      where: {
        bookId,
      },
      _avg: {
        rating: true,
      },
    });

    if (result._avg.rating === null) {
      return null;
    }

    return Number(result._avg.rating.toFixed(2));
  }
}