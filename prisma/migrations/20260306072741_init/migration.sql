-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "booksAPI";

-- CreateTable
CREATE TABLE "booksAPI"."Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "publishedYear" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booksAPI"."Author" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booksAPI"."AuthorBook" (
    "id" SERIAL NOT NULL,
    "id_author" INTEGER NOT NULL,
    "id_book" INTEGER NOT NULL,

    CONSTRAINT "AuthorBook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booksAPI"."AuthorBook" ADD CONSTRAINT "AuthorBook_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "booksAPI"."Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booksAPI"."AuthorBook" ADD CONSTRAINT "AuthorBook_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "booksAPI"."Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
