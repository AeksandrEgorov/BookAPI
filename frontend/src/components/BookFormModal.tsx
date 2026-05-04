import type { ChangeEvent, MouseEvent } from "react";
import type {
  AuthorOption,
  PublisherOption,
} from "../types/book.types.js";

export type BookFormState = {
  title: string;
  isbn: string;
  publishedYear: string;
  pageCount: string;
  language: string;
  description: string;
  coverImage: string;
  authorId: string;
  publisherId: string;
  genres: string[];
};

type BookFormModalProps = {
  isOpen: boolean;
  form: BookFormState;
  loading: boolean;
  error: string;
  languages: string[];
  authors: AuthorOption[];
  publishers: PublisherOption[];
  availableGenres: string[];
  title?: string;
  description?: string;
  submitText?: string;
  loadingText?: string;
  onClose: () => void;
  onChange: (field: keyof BookFormState, value: string | string[]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

function BookFormModal({
  isOpen,
  form,
  loading,
  error,
  languages,
  authors,
  publishers,
  availableGenres,
  title = "Add book",
  description = "Fill in the form to create a new book.",
  submitText = "Save book",
  loadingText = "Saving...",
  onClose,
  onChange,
  onSubmit,
}: BookFormModalProps) {
  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  }

  function handleGenresChange(event: ChangeEvent<HTMLSelectElement>): void {
    const selectedGenres: string[] = Array.from(
      event.target.selectedOptions
    ).map((option: HTMLOptionElement) => option.value);

    onChange("genres", selectedGenres);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="self-start rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="book-title"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Title
                </label>
                <input
                  id="book-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => onChange("title", event.target.value)}
                  placeholder="Enter book title"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="book-isbn"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  ISBN
                </label>
                <input
                  id="book-isbn"
                  type="text"
                  value={form.isbn}
                  onChange={(event) => onChange("isbn", event.target.value)}
                  placeholder="e.g. 9780132350884"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="book-language"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Language
                </label>
                <select
                  id="book-language"
                  value={form.language}
                  onChange={(event) => onChange("language", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                >
                  <option value="">Select language</option>
                  {languages.map((language: string) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="book-year"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Published year
                </label>
                <input
                  id="book-year"
                  type="number"
                  value={form.publishedYear}
                  onChange={(event) =>
                    onChange("publishedYear", event.target.value)
                  }
                  placeholder="e.g. 2008"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="book-pages"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Page count
                </label>
                <input
                  id="book-pages"
                  type="number"
                  value={form.pageCount}
                  onChange={(event) => onChange("pageCount", event.target.value)}
                  placeholder="e.g. 464"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="book-author"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Author
                </label>
                <select
                  id="book-author"
                  value={form.authorId}
                  onChange={(event) => onChange("authorId", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                >
                  <option value="">Select author</option>
                  {authors.map((author: AuthorOption) => (
                    <option key={author.id} value={String(author.id)}>
                      {author.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="book-publisher"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Publisher
                </label>
                <select
                  id="book-publisher"
                  value={form.publisherId}
                  onChange={(event) =>
                    onChange("publisherId", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                >
                  <option value="">Select publisher</option>
                  {publishers.map((publisher: PublisherOption) => (
                    <option key={publisher.id} value={String(publisher.id)}>
                      {publisher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="book-genres"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Genres
                </label>
                <select
                  id="book-genres"
                  multiple
                  value={form.genres}
                  onChange={handleGenresChange}
                  className="min-h-40 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                  required
                >
                  {availableGenres.map((genre: string) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="book-description"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Description{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="book-description"
                  value={form.description}
                  onChange={(event) =>
                    onChange("description", event.target.value)
                  }
                  rows={4}
                  placeholder="Write a short description"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="book-cover-image"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Cover image URL{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="book-cover-image"
                  type="text"
                  value={form.coverImage}
                  onChange={(event) => onChange("coverImage", event.target.value)}
                  placeholder="https://example.com/cover.jpg"
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
                {loading ? loadingText : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookFormModal;