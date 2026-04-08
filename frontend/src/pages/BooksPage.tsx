import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { getBooks, getLanguages } from "../api/books.api.js";

import type { Book, BookQueryParams } from "../types/book.types.js";
import type { ApiErrorResponse } from "../types/common.types.js";

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [sortBy, setSortBy] = useState<"title" | "publishedYear">("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState<number>(1);
  const limit = 9;

  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);
  const [languagesLoading, setLanguagesLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const queryParams: BookQueryParams = useMemo(() => {
    const params: BookQueryParams = {
      sortBy,
      order, 
      page,
      limit,
    };

    if (title.trim() !== "") {
      params.title = title.trim();
    }

    if (year.trim() !== "") {
      params.year = Number(year);
    }

    if (language.trim() !== "") {
      params.language = language;
    }

    return params;
  }, [title, year, language, sortBy, order, page, limit]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks(): Promise<void> {
      try {
        setLoading(true);
        setError("");

        const response = await getBooks(queryParams, controller.signal);

        setBooks(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          return;
        }

        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          setError(err.response?.data?.error ?? "Failed to load books");
          return;
        }

        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    void fetchBooks();

    return () => {
      controller.abort();
    };
  }, [queryParams]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLanguages(): Promise<void> {
      try {
        setLanguagesLoading(true);

        const response = await getLanguages(controller.signal);
        setLanguages(response.data);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          return;
        }
      } finally {
        setLanguagesLoading(false);
      }
    }

    void fetchLanguages();

    return () => {
      controller.abort();
    };
  }, []);

  function handleResetFilters(): void {
    setTitle("");
    setYear("");
    setLanguage("");
    setSortBy("title");
    setOrder("asc");
    setPage(1);
  }

  function handleTitleChange(value: string): void {
    setTitle(value);
    setPage(1);
  }

  function handleYearChange(value: string): void {
    setYear(value);
    setPage(1);
  }

  function handleLanguageChange(value: string): void {
    setLanguage(value);
    setPage(1);
  }

  function handleSortByChange(value: "title" | "publishedYear"): void {
    setSortBy(value);
    setPage(1);
  }

  function handleOrderChange(value: "asc" | "desc"): void {
    setOrder(value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Books</h1>
            <p className="mt-2 text-sm text-slate-600">
              Browse, filter and manage books.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Add book
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Search by title"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Year
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(event) => handleYearChange(event.target.value)}
                placeholder="e.g. 2024"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="language"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="">All languages</option>
                {languages.map((languageOption: string) => (
                  <option key={languageOption} value={languageOption}>
                    {languageOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sortBy"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Sort by
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) =>
                  handleSortByChange(
                    event.target.value as "title" | "publishedYear"
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="title">Title</option>
                <option value="publishedYear">Year</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="order"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Order
              </label>
              <select
                id="order"
                value={order}
                onChange={(event) =>
                  handleOrderChange(event.target.value as "asc" | "desc")
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reset filters
            </button>

            {languagesLoading ? (
              <span className="text-sm text-slate-500">Loading languages...</span>
            ) : null}
          </div>
        </div>

        {error !== "" ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            No books found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {books.map((book: Book) => (
              <article
                key={book.id}
                className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-4">
                  <h2 className="line-clamp-2 text-xl font-semibold text-slate-900">
                    {book.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    ISBN: {book.isbn}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-medium">Year:</span> {book.publishedYear}
                  </p>
                  <p>
                    <span className="font-medium">Language:</span> {book.language}
                  </p>
                  <p>
                    <span className="font-medium">Pages:</span> {book.pageCount}
                  </p>
                  <p>
                    <span className="font-medium">Genres:</span>{" "}
                    {book.genres.join(", ")}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-3 pt-5">
                  <Link
                    to={`/books/${book.id}`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    View
                  </Link>

                  <button
                    type="button"
                    className="shadow-sm transition hover:bg-red-100 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-400 opacity-70"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((previousPage: number) => previousPage - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((previousPage: number) => previousPage + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;