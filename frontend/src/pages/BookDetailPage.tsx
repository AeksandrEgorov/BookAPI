import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  deleteBook,
  getAuthors,
  getAverageRating,
  getBookById,
  getPublishers,
} from "../api/books.api.js";
import {
  createReview,
  getReviewsByBookId,
} from "../api/reviews.api.js";

import ConfirmDeleteModal from "../components/ConfirmDeleteModal.js";
import ReviewFormModal, {
  type ReviewFormState,
} from "../components/ReviewFormModal.js";

import type {
  AuthorOption,
  Book,
  PublisherOption,
} from "../types/book.types.js";
import type {
  CreateReviewInput,
  Review,
} from "../types/review.types.js";
import type { ApiErrorResponse } from "../types/common.types.js";

const initialReviewFormState: ReviewFormState = {
  userName: "",
  rating: "",
  comment: "",
};

function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const bookId: number = Number(id);

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [publishers, setPublishers] = useState<PublisherOption[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [isReviewModalOpen, setIsReviewModalOpen] =
    useState<boolean>(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(
    initialReviewFormState
  );
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const authorNameMap: Map<number, string> = useMemo(() => {
    return new Map(
      authors.map((author: AuthorOption) => [author.id, author.fullName])
    );
  }, [authors]);

  const publisherNameMap: Map<number, string> = useMemo(() => {
    return new Map(
      publishers.map((publisher: PublisherOption) => [
        publisher.id,
        publisher.name,
      ])
    );
  }, [publishers]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBookDetails(): Promise<void> {
      if (Number.isNaN(bookId)) {
        setError("Invalid book id");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          bookResponse,
          ratingResponse,
          reviewsResponse,
          authorsResponse,
          publishersResponse,
        ] = await Promise.all([
          getBookById(bookId, controller.signal),
          getAverageRating(bookId, controller.signal),
          getReviewsByBookId(bookId, controller.signal),
          getAuthors(controller.signal),
          getPublishers(controller.signal),
        ]);

        setBook(bookResponse.data);
        setAverageRating(ratingResponse.data.averageRating);
        setReviews(reviewsResponse.data);
        setAuthors(authorsResponse.data);
        setPublishers(publishersResponse.data);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          return;
        }

        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          setError(err.response?.data?.error ?? "Failed to load book details");
          return;
        }

        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    }

    void fetchBookDetails();

    return () => {
      controller.abort();
    };
  }, [bookId]);

  useEffect(() => {
    if (successMessage === "") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  function handleOpenReviewModal(): void {
    setReviewForm(initialReviewFormState);
    setReviewError("");
    setIsReviewModalOpen(true);
  }

  function handleCloseReviewModal(): void {
    if (reviewLoading) {
      return;
    }

    setIsReviewModalOpen(false);
    setReviewError("");
    setReviewForm(initialReviewFormState);
  }

  function handleReviewFormChange(
    field: keyof ReviewFormState,
    value: string
  ): void {
    setReviewForm((previousState: ReviewFormState) => ({
      ...previousState,
      [field]: value,
    }));
  }

  async function refreshReviewsAndRating(): Promise<void> {
    const [reviewsResponse, ratingResponse] = await Promise.all([
      getReviewsByBookId(bookId),
      getAverageRating(bookId),
    ]);

    setReviews(reviewsResponse.data);
    setAverageRating(ratingResponse.data.averageRating);
  }

  async function handleCreateReview(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    try {
      setReviewLoading(true);
      setReviewError("");

      const ratingNumber: number = Number(reviewForm.rating);

      if (![1, 2, 3, 4, 5].includes(ratingNumber)) {
        setReviewError("Rating must be between 1 and 5");
        return;
      }

      const data: CreateReviewInput = {
        userName: reviewForm.userName.trim(),
        rating: ratingNumber as CreateReviewInput["rating"],
        comment:
          reviewForm.comment.trim() !== ""
            ? reviewForm.comment.trim()
            : undefined,
      };

      await createReview(bookId, data);
      await refreshReviewsAndRating();

      handleCloseReviewModal();
      setSuccessMessage("Review was added successfully.");
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const apiError: ApiErrorResponse | undefined = err.response?.data;

        if (apiError?.details !== undefined && apiError.details.length > 0) {
          setReviewError(
            apiError.details.map((detail) => detail.message).join(", ")
          );
          return;
        }

        setReviewError(apiError?.error ?? "Failed to create review");
        return;
      }

      setReviewError("Failed to create review");
    } finally {
      setReviewLoading(false);
    }
  }

  function handleOpenDeleteModal(): void {
    setDeleteError("");
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal(): void {
    if (deleteLoading) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteError("");
  }

  async function handleDeleteBook(): Promise<void> {
    if (book === null) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteBook(book.id);

      navigate("/books");
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const apiError: ApiErrorResponse | undefined = err.response?.data;

        if (apiError?.details !== undefined && apiError.details.length > 0) {
          setDeleteError(
            apiError.details.map((detail) => detail.message).join(", ")
          );
          return;
        }

        setDeleteError(apiError?.error ?? "Failed to delete book");
        return;
      }

      setDeleteError("Failed to delete book");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading book details...
        </div>
      </div>
    );
  }

  if (error !== "") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="mb-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to books
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (book === null) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          Book not found.
        </div>
      </div>
    );
  }

  const authorName: string =
    authorNameMap.get(book.authorId) ?? `Author #${book.authorId}`;

  const publisherName: string =
    publisherNameMap.get(book.publisherId) ?? `Publisher #${book.publisherId}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/books"
            className="w-fit rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to books
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="cursor-not-allowed rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400 opacity-70"
              disabled
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleOpenDeleteModal}
              className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        {successMessage !== "" ? (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">{book.title}</h1>
            <p className="mt-2 text-sm text-slate-500">ISBN: {book.isbn}</p>
          </div>

          {book.coverImage !== undefined && book.coverImage !== "" ? (
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-72 w-full object-cover"
              />
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Author</p>
              <p className="mt-1 font-medium text-slate-900">{authorName}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Publisher</p>
              <p className="mt-1 font-medium text-slate-900">{publisherName}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Published year</p>
              <p className="mt-1 font-medium text-slate-900">
                {book.publishedYear}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Page count</p>
              <p className="mt-1 font-medium text-slate-900">
                {book.pageCount}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Language</p>
              <p className="mt-1 font-medium text-slate-900">{book.language}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Average rating</p>
              <p className="mt-1 font-medium text-slate-900">
                {averageRating === null ? "No rating yet" : `${averageRating}/5`}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">Genres</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {book.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">Description</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {book.description ?? "No description provided."}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Reviews
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Reviews for this book.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenReviewModal}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review: Review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-900">
                      {review.userName}
                    </p>

                    <p className="text-sm text-slate-500">
                      Rating: {review.rating}/5
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {review.comment ?? "No comment."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <ReviewFormModal
        isOpen={isReviewModalOpen}
        form={reviewForm}
        loading={reviewLoading}
        error={reviewError}
        onClose={handleCloseReviewModal}
        onChange={handleReviewFormChange}
        onSubmit={handleCreateReview}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title={book.title}
        loading={deleteLoading}
        error={deleteError}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteBook}
      />
    </div>
  );
}

export default BookDetailPage;