import { useEffect } from "react";
import { CheckCircle2, X, AlertTriangle, AlertCircle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoCloseMs?: number;
  type?: "success" | "warning" | "error";
};

export default function WarningModal({
  open,
  onClose,
  title = "Peringatan",
  message,
  autoCloseMs,
  type = "warning",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-[101] w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 hover:bg-neutral-100"
          aria-label="Tutup"
          title="Tutup"
        >
          <X className="h-4 w-4 text-neutral-500" />
        </button>

        {/* Icon based on type */}
        <div className="mb-3 flex items-center justify-center">
          {type === "success" && (
            <CheckCircle2 className="h-16 w-16 text-emerald-600" />
          )}
          {type === "warning" && (
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          )}
          {type === "error" && (
            <AlertCircle className="h-16 w-16 text-red-600" />
          )}
        </div>

        <h3 className="text-center text-lg font-semibold text-neutral-800">
          {title}
        </h3>

        {message && (
          <p className="mt-2 text-center text-sm text-neutral-600">
            {message}
          </p>
        )}

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
