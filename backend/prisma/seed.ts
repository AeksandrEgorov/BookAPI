import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { authors } from "../src/data/mock/authors.mock.faker.js";
import { publishers } from "../src/data/mock/publishers.mock.faker.js";
import { books } from "../src/data/mock/books.mock.faker.js";
import { reviews } from "../src/data/mock/reviews.mock.faker.js";

const databaseUrl: string | undefined = process.env.DATABASE_URL;

if (databaseUrl === undefined) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.author.createMany({
    data: authors.map((a) => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      birthYear: a.birthYear,
      nationality: a.nationality,
      biography: a.biography,
      createdAt: new Date(a.createdAt),
    })),
    skipDuplicates: true,
  });

  await prisma.publisher.createMany({
    data: publishers.map((p) => ({
      id: p.id,
      name: p.name,
      country: p.country,
      foundedYear: p.foundedYear,
      website: p.website,
      createdAt: new Date(p.createdAt),
    })),
    skipDuplicates: true,
  });

  const allGenres = Array.from(
    new Set(books.flatMap((b) => b.genres))
  );

  await prisma.genre.createMany({
    data: allGenres.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const genresFromDb = await prisma.genre.findMany();

  for (const b of books) {
    await prisma.book.create({
      data: {
        title: b.title,
        isbn: b.isbn,
        publishedYear: b.publishedYear,
        pageCount: b.pageCount,
        language: b.language,
        description: b.description,
        coverImage: b.coverImage,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),

        author: {
          connect: { id: b.authorId },
        },
        publisher: {
          connect: { id: b.publisherId },
        },

        genres: {
          connect: genresFromDb
            .filter((g) => b.genres.includes(g.name))
            .map((g) => ({ id: g.id })),
        },
      },
    });
  }

  await prisma.review.createMany({
    data: reviews.map((r) => ({
      bookId: r.bookId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: new Date(r.createdAt),
    })),
    skipDuplicates: true,
  });

  console.log("Seeding finished");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });