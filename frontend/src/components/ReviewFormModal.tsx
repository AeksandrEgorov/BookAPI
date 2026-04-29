import type { MouseEvent } from "react";
import type { CreateReviewInput } from "../types/review.types.js";

type ReviewFormState = {
  userName: string;
  rating: string;
  comment: string;
};

type ReviewFormModalProps = {
  isOpen: boolean;
  form: ReviewFormState;
  loading: boolean;
  error: string;
  onClose: () => void;
  onChange: (field: keyof ReviewFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

function ReviewFormModal({
  isOpen,
  form,
  loading,
  error,
  onClose,
  onChange,
  onSubmit,
}: ReviewFormModalProps) {
  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Add review
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add your rating and comment for this book.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>

        {error !== "" ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="review-username"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="review-username"
                type="text"
                value={form.userName}
                onChange={(event) => onChange("userName", event.target.value)}
                placeholder="e.g. Aleksandr"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="review-rating"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Rating
              </label>
              <select
                id="review-rating"
                value={form.rating}
                onChange={(event) => onChange("rating", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                required
              >
                <option value="">Select rating</option>
                <option value="1">1 / 5</option>
                <option value="2">2 / 5</option>
                <option value="3">3 / 5</option>
                <option value="4">4 / 5</option>
                <option value="5">5 / 5</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="review-comment"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Comment{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="review-comment"
                value={form.comment}
                onChange={(event) => onChange("comment", event.target.value)}
                placeholder="Write your comment"
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? "Saving..." : "Save review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export type { ReviewFormState };
export default ReviewFormModal;