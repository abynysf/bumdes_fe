import { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import clsx from "clsx";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  variant = "danger",
}: ConfirmDialogProps) {
  // Handle ESC key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const isDanger = variant === "danger";
  const Icon = isDanger ? Trash2 : AlertTriangle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-full",
              isDanger ? "bg-red-100" : "bg-yellow-100"
            )}
          >
            <Icon
              className={clsx(
                "h-6 w-6",
                isDanger ? "text-red-600" : "text-yellow-600"
              )}
            />
          </div>
        </div>

        {/* Title */}
        <h3
          id="confirm-dialog-title"
          className="mb-2 text-center text-lg font-semibold text-neutral-900"
        >
          {title}
        </h3>

        {/* Message */}
        <p
          id="confirm-dialog-message"
          className="mb-6 text-center text-sm text-neutral-600"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={clsx(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
              isDanger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
