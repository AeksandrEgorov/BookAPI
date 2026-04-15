type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title: string;
  loading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

function ConfirmDeleteModal({
  isOpen,
  title,
  loading,
  error,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>
  ): void {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Delete book</h2>

        <p className="mt-3 text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{title}</span>?
        </p>

        {error !== "" ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

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
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;